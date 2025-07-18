import { System } from "ecsy";
import RAPIER from "@dimforge/rapier3d-compat";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
export class PhysicsSystem extends System {
    constructor() {
        super(...arguments);
        this.bodies = new Map();
    }
    async init(attributes) {
        this.rapier = await RAPIER.init();
        const gravity = attributes?.gravity ?? { x: 0, y: -9.81, z: 0 };
        this.physicsWorld = new this.rapier.World(gravity);
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
        // update bodies with velocity from components
        this.queries.movers.results.forEach((entity) => {
            const vel = entity.getComponent(Velocity);
            const body = this.bodies.get(entity);
            if (body && body.setLinvel) {
                body.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);
            }
        });
        this.physicsWorld.step();
        // sync positions back to components
        this.queries.movers.results.forEach((entity) => {
            const body = this.bodies.get(entity);
            if (body && body.translation) {
                const t = body.translation();
                const pos = entity.getMutableComponent(Position);
                pos.x = t.x;
                pos.y = t.y;
                pos.z = t.z;
            }
        });
    }
    stop() {
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
