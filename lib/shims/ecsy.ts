export class Component<T = any> {
  static schema: any;
}

export class TagComponent {}

export const Types = {
  Number: 'number' as any,
  Ref: 'ref' as any,
};

export class System {
  world: any;
  static queries: any;
  queries: any;
  execute(_delta: number): void {}
}

export class World {
  registerComponent(_c: any): this { return this; }
  registerSystem(_s: any): this { return this; }
}

export type Entity = any;
