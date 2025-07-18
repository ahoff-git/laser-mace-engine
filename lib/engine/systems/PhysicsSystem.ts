import { System, Entity } from "ecsy";
import RAPIER from "@dimforge/rapier3d-compat";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";

export interface PhysicsSystemConfig {
  gravity?: { x: number; y: number; z: number };
}

export class PhysicsSystem extends System {
  private rapier: any;
  private physicsWorld: any;
  private bodies = new Map<Entity, any>();

  async init(attributes?: PhysicsSystemConfig): Promise<void> {
    this.rapier = await RAPIER.init();
    const gravity = attributes?.gravity ?? { x: 0, y: -9.81, z: 0 };
    this.physicsWorld = new this.rapier.World(gravity);
  }

  execute(_delta: number): void {
    // create bodies for newly added entities
    if (this.queries.movers?.added) {
      this.queries.movers.added.forEach((entity: Entity) => {
        const pos = entity.getComponent(Position)!;
        const desc = this.rapier.RigidBodyDesc.newDynamic().setTranslation(
          pos.x,
          pos.y,
          pos.z
        );
        const body = this.physicsWorld.createRigidBody(desc);
        this.bodies.set(entity, body);
      });
    }

    // update bodies with velocity from components
    this.queries.movers.results.forEach((entity: Entity) => {
      const vel = entity.getComponent(Velocity)!;
      const body = this.bodies.get(entity);
      if (body && body.setLinvel) {
        body.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);
      }
    });

    this.physicsWorld.step();

    // sync positions back to components
    this.queries.movers.results.forEach((entity: Entity) => {
      const body = this.bodies.get(entity);
      if (body && body.translation) {
        const t = body.translation();
        const pos = entity.getMutableComponent(Position)!;
        pos.x = t.x;
        pos.y = t.y;
        pos.z = t.z;
      }
    });
  }

  stop(): void {
    this.bodies.clear();
  }
}

PhysicsSystem.queries = {
  movers: {
    components: [Position, Velocity],
    listen: {
      added: true,
    },
  },
};
