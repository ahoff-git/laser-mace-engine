export class EventQueue {
    constructor(_autoDrain) { }
    drainCollisionEvents(_cb) { }
}
export const ActiveEvents = {
    COLLISION_EVENTS: 1,
};
export class RigidBodyDesc {
    static dynamic() { return new RigidBodyDesc(); }
    static fixed() { return new RigidBodyDesc(); }
    static newDynamic() { return new RigidBodyDesc(); }
    setTranslation(_x, _y, _z) { return this; }
    setLinvel(_x, _y, _z) { return this; }
    setAdditionalMass(_m) { return this; }
}
export class ColliderDesc {
    static cuboid(_x, _y, _z) { return new ColliderDesc(); }
    setRestitution(_v) { return this; }
    setFriction(_v) { return this; }
}
export class World {
    constructor(gravity) {
        this.timestep = 0;
        this.gravity = gravity;
    }
    step(_queue) { }
    createRigidBody(_desc) {
        return {
            translation() { return { x: 0, y: 0, z: 0 }; },
            linvel() { return { x: 0, y: 0, z: 0 }; },
        };
    }
    createCollider(_desc, _body) {
        return {
            handle: Math.floor(Math.random() * 1000000),
            setActiveEvents(_ev) { },
        };
    }
    removeRigidBody(_body) { }
}
const DefaultExport = {
    async init() { return DefaultExport; },
    World,
    RigidBodyDesc,
    ColliderDesc,
    EventQueue,
    ActiveEvents,
};
export default DefaultExport;
