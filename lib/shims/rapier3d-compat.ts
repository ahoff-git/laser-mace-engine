export class EventQueue {
  constructor(_autoDrain: boolean) {}
  drainCollisionEvents(_cb: (h1: number, h2: number, started: boolean) => void): void {}
}

export const ActiveEvents = {
  COLLISION_EVENTS: 1,
};

export class RigidBodyDesc {
  static dynamic(): RigidBodyDesc { return new RigidBodyDesc(); }
  static fixed(): RigidBodyDesc { return new RigidBodyDesc(); }
  static newDynamic(): RigidBodyDesc { return new RigidBodyDesc(); }
  setTranslation(_x: number, _y: number, _z: number) { return this; }
  setLinvel(_x: number, _y: number, _z: number) { return this; }
  setAdditionalMass(_m: number) { return this; }
}

export class ColliderDesc {
  static cuboid(_x: number, _y: number, _z: number): ColliderDesc { return new ColliderDesc(); }
  setRestitution(_v: number) { return this; }
  setFriction(_v: number) { return this; }
}

export class World {
  gravity: any;
  timestep = 0;
  constructor(gravity: any) { this.gravity = gravity; }
  step(_queue?: EventQueue): void {}
  createRigidBody(_desc: RigidBodyDesc): any {
    return {
      translation() { return { x: 0, y: 0, z: 0 }; },
      linvel() { return { x: 0, y: 0, z: 0 }; },
    } as any;
  }
  createCollider(_desc: ColliderDesc, _body: any): any {
    return {
      handle: Math.floor(Math.random() * 1000000),
      setActiveEvents(_ev: number) {},
    } as any;
  }
  removeRigidBody(_body: any): void {}
}

const DefaultExport = {
  async init(): Promise<any> { return DefaultExport; },
  World,
  RigidBodyDesc,
  ColliderDesc,
  EventQueue,
  ActiveEvents,
};

export default DefaultExport;
