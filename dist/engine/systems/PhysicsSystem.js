import { System } from "ecsy";
import RAPIER from "@dimforge/rapier3d-compat";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { Collider } from "../components/Collider";
import { DefaultRapierSync } from "../utils/RapierSync";
export class PhysicsSystem extends System {
    constructor() {
        super(...arguments);
        this.bodies = new Map();
        this.syncer = new DefaultRapierSync();
    }
    async init(attributes) {
        this.rapier = await RAPIER.init();
        const gravity = attributes?.gravity ?? { x: 0, y: -9.81, z: 0 };
        this.physicsWorld = new this.rapier.World(gravity);
        if (attributes?.syncer) {
            this.syncer = attributes.syncer;
        }
    }
    execute(_delta) {
        // create bodies for newly added entities
        if (this.queries.movers?.added) {
            this.queries.movers.added.forEach((entity) => {
                const pos = entity.getComponent(Position);
                const desc = this.rapier.RigidBodyDesc.newDynamic().setTranslation(pos.x, pos.y, pos.z);
                const body = this.physicsWorld.createRigidBody(desc);
                this.bodies.set(entity, body);
            });
        }
        // update bodies with data from components
        this.queries.movers.results.forEach((entity) => {
            const body = this.bodies.get(entity);
            if (body) {
                this.syncer.toRapier(entity, body);
            }
        });
        this.physicsWorld.step();
        // sync physics results back to components
        this.queries.movers.results.forEach((entity) => {
            const body = this.bodies.get(entity);
            if (body) {
                this.syncer.fromRapier(entity, body);
            }
        });
        this.handleCollisions();
    }
    stop() {
        this.bodies.clear();
    }
    handleCollisions() {
        const world = this.world;
        const colliders = this.queries.colliders?.results ?? [];
        for (let i = 0; i < colliders.length; i++) {
            for (let j = i + 1; j < colliders.length; j++) {
                const a = colliders[i];
                const b = colliders[j];
                const posA = a.getComponent(Position);
                const posB = b.getComponent(Position);
                const colA = a.getComponent(Collider);
                const colB = b.getComponent(Collider);
                const dx = posA.x - posB.x;
                const dy = posA.y - posB.y;
                const dz = posA.z - posB.z;
                const distSq = dx * dx + dy * dy + dz * dz;
                const rad = colA.radius + colB.radius;
                if (distSq <= rad * rad) {
                    if (world && world.commandQueue && world.commandQueue.enqueue) {
                        world.commandQueue.enqueue({ type: "collision", a, b });
                    }
                }
            }
        }
    }
}
PhysicsSystem.queries = {
    movers: {
        components: [Position, Velocity],
        listen: {
            added: true,
        },
    },
    colliders: {
        components: [Position, Collider],
    },
};
