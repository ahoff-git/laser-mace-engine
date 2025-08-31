export declare class EventQueue {
    constructor(_autoDrain: boolean);
    drainCollisionEvents(_cb: (h1: number, h2: number, started: boolean) => void): void;
}
export declare const ActiveEvents: {
    COLLISION_EVENTS: number;
};
export declare class RigidBodyDesc {
    static dynamic(): RigidBodyDesc;
    static fixed(): RigidBodyDesc;
    static newDynamic(): RigidBodyDesc;
    setTranslation(_x: number, _y: number, _z: number): this;
    setLinvel(_x: number, _y: number, _z: number): this;
    setAdditionalMass(_m: number): this;
}
export declare class ColliderDesc {
    static cuboid(_x: number, _y: number, _z: number): ColliderDesc;
    setRestitution(_v: number): this;
    setFriction(_v: number): this;
}
export declare class World {
    gravity: any;
    timestep: number;
    constructor(gravity: any);
    step(_queue?: EventQueue): void;
    createRigidBody(_desc: RigidBodyDesc): any;
    createCollider(_desc: ColliderDesc, _body: any): any;
    removeRigidBody(_body: any): void;
}
export type RigidBody = ReturnType<World['createRigidBody']>;
export type Collider = ReturnType<World['createCollider']>;
export type RapierWorld = World;
declare const DefaultExport: {
    init(): Promise<any>;
    World: typeof World;
    RigidBodyDesc: typeof RigidBodyDesc;
    ColliderDesc: typeof ColliderDesc;
    EventQueue: typeof EventQueue;
    ActiveEvents: {
        COLLISION_EVENTS: number;
    };
};
export default DefaultExport;
