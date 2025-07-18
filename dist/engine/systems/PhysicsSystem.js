import { System } from "ecsy";
import RAPIER from "@dimforge/rapier3d-compat";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
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
