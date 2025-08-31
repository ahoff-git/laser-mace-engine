export declare class Component<T = any> {
    static schema: any;
}
export declare class TagComponent {
}
export declare const Types: {
    Number: any;
    Ref: any;
};
export declare class System<T = any> {
    world: any;
    static queries: any;
    queries: any;
    init?(attributes?: T): void | Promise<void>;
    execute(_delta: number): void;
    stop?(): void;
}
export declare class World {
    registerComponent(_c: any): this;
    registerSystem(_s: any, _attrs?: any): this;
}
export type Entity = any;
