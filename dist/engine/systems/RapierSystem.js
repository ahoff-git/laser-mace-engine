import { System } from 'ecsy';
import { Position } from '../components/Position';
import { Velocity } from '../components/Velocity';
import { Collider } from '../components/Collider';
import { Immovable } from '../components/Immovable';
import { nowMs, massFromSize } from '../utils/common';
// Cache the Rapier module across HMR/StrictMode to avoid multiple WASM instances
const RAP_GLOBAL_KEY = '__LM_RAPIER_MODULE__';
async function loadRapierModule() {
    const g = globalThis;
    if (g[RAP_GLOBAL_KEY])
        return g[RAP_GLOBAL_KEY];
    const modNs = await import('@dimforge/rapier3d-compat');
    const mod = modNs?.default ?? modNs;
    // Use the object-form to satisfy newer Rapier init API
    await mod.init({});
    g[RAP_GLOBAL_KEY] = mod;
    return mod;
}
export class RapierSystem extends System {
    constructor() {
        super(...arguments);
        this.rapier = null;
        this.world = null;
        this.bodyMap = new Map();
        this.colliderMap = new Map();
        this.entityColliderMap = new Map();
        this.eventQueue = null;
        this.pendingAdds = [];
        this.pendingRemoves = [];
        this.accumulator = 0;
        this.fixedDelta = 1 / 60;
        this.maxSubSteps = 5;
    }
    init(attrs) {
        const gravity = attrs?.gravity ?? { x: 0, y: 0, z: 0 };
        this.onCollision = attrs?.onCollision;
        this.pendingBounds = attrs?.bounds;
        if (attrs?.fixedDelta)
            this.fixedDelta = attrs.fixedDelta;
        if (attrs?.maxSubSteps)
            this.maxSubSteps = attrs.maxSubSteps;
        loadRapierModule().then((mod) => {
            this.rapier = mod;
            this.world = new mod.World(gravity);
            // Temporarily disable EventQueue to avoid WASM panics observed in dev
            this.eventQueue = null;
            if (this.pendingBounds) {
                this.createBoundaryColliders(this.pendingBounds);
                this.pendingBounds = undefined;
            }
        });
    }
    execute(delta) {
        if (!this.world)
            return;
        const added = this.queries.movers.added ?? [];
        const removed = this.queries.movers.removed ?? [];
        // Defer mutations to the physics world to a controlled phase
        for (const e of added)
            this.pendingAdds.push(e);
        for (const e of this.queries.movers.results) {
            if (!this.bodyMap.has(e.id))
                this.pendingAdds.push(e);
        }
        for (const e of removed)
            this.pendingRemoves.push(e);
        // Apply pending removals first, then additions
        if (this.pendingRemoves.length) {
            const todo = this.pendingRemoves.splice(0);
            for (const e of todo) {
                try {
                    this.removeBody(e);
                }
                catch (_) { /* retry next frame */ }
            }
        }
        if (this.pendingAdds.length) {
            const todo = this.pendingAdds.splice(0);
            for (const e of todo) {
                try {
                    this.addBody(e);
                }
                catch (_) { /* retry next frame */
                    this.pendingAdds.push(e);
                }
            }
        }
        // step physics using a fixed timestep accumulator
        this.accumulator += delta;
        let steps = 0;
        while (this.accumulator >= this.fixedDelta && steps < this.maxSubSteps) {
            try {
                this.world.timestep = this.fixedDelta;
                this.world.step(this.eventQueue ?? undefined);
            }
            catch (_e) {
                break; // if WASM not ready or invalid state, bail this frame
            }
            this.accumulator -= this.fixedDelta;
            steps++;
        }
        // Collision events disabled while stabilizing WASM usage in dev.
        // sync components from bodies
        for (const entity of this.queries.movers.results) {
            const body = this.bodyMap.get(entity.id);
            if (!body)
                continue;
            const pos = entity.getMutableComponent(Position);
            const vel = entity.getMutableComponent(Velocity);
            try {
                if (typeof body.translation !== 'function' || typeof body.linvel !== 'function') {
                    continue;
                }
                const t = body.translation();
                const v = body.linvel();
                // Only flag timestamp when values actually change
                if (pos.x !== t.x || pos.y !== t.y || pos.z !== t.z) {
                    pos.x = t.x;
                    pos.y = t.y;
                    pos.z = t.z;
                    pos.updatedAt = nowMs();
                }
                vel.x = v.x;
                vel.y = v.y;
                vel.z = v.z;
                vel.updatedAt = nowMs();
            }
            catch (_err) {
                // If the body became invalid for any reason, try to rebuild it next tick
                this.removeBody(entity);
                this.addBody(entity);
            }
        }
    }
    addBody(entity) {
        if (!this.world || !this.rapier)
            return;
        const pos = entity.getComponent(Position);
        const vel = entity.getComponent(Velocity);
        const collider = entity.getComponent(Collider);
        const R = this.rapier;
        const isFixed = entity.hasComponent(Immovable);
        const desc = (isFixed ? R.RigidBodyDesc.fixed() : R.RigidBodyDesc.dynamic())
            .setTranslation(pos.x, pos.y, pos.z);
        if (!isFixed) {
            desc.setLinvel(vel.x, vel.y, vel.z);
        }
        const size = collider ? (collider.size ?? 1) : 1;
        if (!isFixed) {
            // Prevent extreme masses that could destabilize the simulation
            const mass = massFromSize(size);
            if (typeof desc.setAdditionalMass === 'function') {
                desc.setAdditionalMass(mass);
            }
        }
        const body = this.world.createRigidBody(desc);
        const friction = collider ? (collider.friction ?? 0) : 0; // default 0 to avoid drag
        const half = size / 2;
        const colDesc = R.ColliderDesc.cuboid(half, half, half)
            .setRestitution(0)
            .setFriction(friction);
        const col = this.world.createCollider(colDesc, body);
        col.setActiveEvents(R.ActiveEvents.COLLISION_EVENTS);
        this.bodyMap.set(entity.id, body);
        this.colliderMap.set(col.handle, entity);
        this.entityColliderMap.set(entity.id, col.handle);
    }
    createBoundaryColliders(bounds) {
        if (!this.world || !this.rapier)
            return;
        const R = this.rapier;
        const hx = (bounds.max.x - bounds.min.x) / 2;
        const hy = (bounds.max.y - bounds.min.y) / 2;
        const hz = (bounds.max.z - bounds.min.z) / 2;
        const midX = (bounds.min.x + bounds.max.x) / 2;
        const midY = (bounds.min.y + bounds.max.y) / 2;
        const midZ = (bounds.min.z + bounds.max.z) / 2;
        const thickness = 0.1;
        const makeWall = (x, y, z, sx, sy, sz) => {
            const body = this.world.createRigidBody(R.RigidBodyDesc.fixed().setTranslation(x, y, z));
            const colDesc = R.ColliderDesc.cuboid(sx, sy, sz)
                .setRestitution(0)
                .setFriction(1);
            const col = this.world.createCollider(colDesc, body);
            col.setActiveEvents(R.ActiveEvents.COLLISION_EVENTS);
        };
        // left/right
        makeWall(bounds.min.x - thickness, midY, midZ, thickness, hy, hz);
        makeWall(bounds.max.x + thickness, midY, midZ, thickness, hy, hz);
        // bottom/top
        makeWall(midX, bounds.min.y - thickness, midZ, hx, thickness, hz);
        makeWall(midX, bounds.max.y + thickness, midZ, hx, thickness, hz);
        // back/front
        makeWall(midX, midY, bounds.min.z - thickness, hx, hy, thickness);
        makeWall(midX, midY, bounds.max.z + thickness, hx, hy, thickness);
    }
    /** Remove the Rapier rigid body and collider for the given entity. */
    removeBody(entity) {
        const body = this.bodyMap.get(entity.id);
        if (body && this.world) {
            this.world.removeRigidBody(body);
            this.bodyMap.delete(entity.id);
            const handle = this.entityColliderMap.get(entity.id);
            if (handle !== undefined) {
                this.colliderMap.delete(handle);
                this.entityColliderMap.delete(entity.id);
            }
        }
    }
}
RapierSystem.queries = {
    movers: {
        components: [Position, Velocity, Collider],
        listen: {
            added: true,
            removed: true,
        },
    },
};
