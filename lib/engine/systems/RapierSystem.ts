import { System } from 'ecsy';
import { Position } from '../components/Position';
import { Velocity } from '../components/Velocity';
import { Collider } from '../components/Collider';
import { Immovable } from '../components/Immovable';
import type * as RAPIERType from '@dimforge/rapier3d-compat';
import { Bounds } from '../types';

export interface RapierSystemConfig {
  gravity?: { x: number; y: number; z: number };
  /** Callback fired when two colliders start or stop colliding */
  onCollision?: (entityA: any, entityB: any, started: boolean) => void;
  /** Optional bounds to create static wall colliders */
  bounds?: Bounds;
}

export class RapierSystem extends System<RapierSystemConfig> {
  rapier: typeof import('@dimforge/rapier3d-compat') | null = null;
  world: RAPIERType.World | null = null;
  private bodyMap = new Map<number, RAPIERType.RigidBody>();
  private colliderMap = new Map<number, any>();
  private entityColliderMap = new Map<number, number>();
  private eventQueue: RAPIERType.EventQueue | null = null;
  private onCollision?: (entityA: any, entityB: any, started: boolean) => void;
  private pendingBounds?: Bounds;

  init(attrs?: RapierSystemConfig): void {
    const gravity = attrs?.gravity ?? { x: 0, y: 0, z: 0 };
    this.onCollision = attrs?.onCollision;
    this.pendingBounds = attrs?.bounds;
    import('@dimforge/rapier3d-compat').then(async (RAPIER) => {
      const mod: any = (RAPIER as any)?.default ?? (RAPIER as any);
      await mod.init();
      this.rapier = mod;
      this.world = new mod.World(gravity);
      this.eventQueue = new mod.EventQueue(true);
      if (this.pendingBounds) {
        this.createBoundaryColliders(this.pendingBounds);
        this.pendingBounds = undefined;
      }
    });
  }

  execute(delta: number): void {
    if (!this.world) return;

    const added = (this.queries.movers.added as any[]) ?? [];
    const removed = (this.queries.movers.removed as any[]) ?? [];

    for (const entity of added) {
      this.addBody(entity);
    }

    // Ensure any movers that existed before world init get bodies once ready
    for (const entity of this.queries.movers.results) {
      if (!this.bodyMap.has(entity.id)) {
        this.addBody(entity);
      }
    }

    for (const entity of removed) {
      this.removeBody(entity);
    }

    // step physics
    (this.world as any).timestep = delta;
    (this.world as any).step(this.eventQueue ?? undefined);

    if (this.eventQueue) {
      this.eventQueue.drainCollisionEvents((h1, h2, started) => {
        const e1 = this.colliderMap.get(h1);
        const e2 = this.colliderMap.get(h2);
        if (e1 && e2) this.onCollision?.(e1, e2, started);
      });
    }

    // sync components from bodies
    for (const entity of this.queries.movers.results) {
      const body = this.bodyMap.get(entity.id);
      if (!body) continue;
      const pos = entity.getMutableComponent(Position)!;
      const vel = entity.getMutableComponent(Velocity)!;
      const t = body.translation();
      const v = body.linvel();
      pos.x = t.x;
      pos.y = t.y;
      pos.z = t.z;
      vel.x = v.x;
      vel.y = v.y;
      vel.z = v.z;
    }
  }

  private addBody(entity: any): void {
    if (!this.world || !this.rapier) return;

    const pos = entity.getComponent(Position)!;
    const vel = entity.getComponent(Velocity)!;
    const collider = entity.getComponent(Collider);
    const R = this.rapier as any;

    const isFixed = entity.hasComponent(Immovable);
    const desc = (isFixed ? R.RigidBodyDesc.fixed() : R.RigidBodyDesc.dynamic())
      .setTranslation(pos.x, pos.y, pos.z);
    if (!isFixed) {
      desc.setLinvel(vel.x, vel.y, vel.z);
    }
    const size = collider ? ((collider as any).size ?? 1) : 1;
    if (!isFixed) {
      const mass = size * size * size;
      desc.setAdditionalMass(mass);
    }
    const body = (this.world as any).createRigidBody(desc);

    const friction = collider ? ((collider as any).friction ?? 0) : 0; // default 0 to avoid drag
    const half = size / 2;
    const colDesc = R.ColliderDesc.cuboid(half, half, half)
      .setRestitution(0)
      .setFriction(friction);
    const col = (this.world as any).createCollider(colDesc, body);
    col.setActiveEvents(R.ActiveEvents.COLLISION_EVENTS);
    this.bodyMap.set(entity.id, body);
    this.colliderMap.set(col.handle, entity);
    this.entityColliderMap.set(entity.id, col.handle);
  }

  private createBoundaryColliders(bounds: Bounds): void {
    if (!this.world || !this.rapier) return;
    const R = this.rapier as any;
    const hx = (bounds.max.x - bounds.min.x) / 2;
    const hy = (bounds.max.y - bounds.min.y) / 2;
    const hz = (bounds.max.z - bounds.min.z) / 2;
    const midX = (bounds.min.x + bounds.max.x) / 2;
    const midY = (bounds.min.y + bounds.max.y) / 2;
    const midZ = (bounds.min.z + bounds.max.z) / 2;
    const thickness = 0.1;
    const makeWall = (
      x: number,
      y: number,
      z: number,
      sx: number,
      sy: number,
      sz: number
    ) => {
      const body = (this.world as any).createRigidBody(R.RigidBodyDesc.fixed().setTranslation(x, y, z));
      const colDesc = R.ColliderDesc.cuboid(sx, sy, sz)
        .setRestitution(0)
        .setFriction(1);
      const col = (this.world as any).createCollider(colDesc, body);
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
  removeBody(entity: any): void {
    const body = this.bodyMap.get(entity.id);
    if (body && this.world) {
      (this.world as any).removeRigidBody(body);
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
