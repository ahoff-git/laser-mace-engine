export declare class Component<T = any> {
    static schema: any;
}
export declare const Types: {
    Number: any;
    Ref: any;
};
export declare class System {
    world: any;
    static queries: any;
    queries: any;
    execute(_delta: number): void;
}
export declare class World {
    registerComponent(_c: any): this;
    registerSystem(_s: any): this;
}
export type Entity = any;
