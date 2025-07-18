export interface RapierWorld {
  step(): void;
}

export default {
  async init(): Promise<{ World: new (gravity: any) => RapierWorld; RigidBodyDesc: any; RigidBodyType: any; }> {
    return {
      World: class { constructor(_gravity: any) {} step() {} },
      RigidBodyDesc: class { static newDynamic(): any { return {}; } setTranslation(_x: number, _y: number, _z: number) { return this; } },
      RigidBodyType: {},
    } as any;
  },
};
