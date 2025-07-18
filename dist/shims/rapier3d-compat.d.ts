export interface RapierWorld {
    step(): void;
}
declare const _default: {
    init(): Promise<{
        World: new (gravity: any) => RapierWorld;
        RigidBodyDesc: any;
        RigidBodyType: any;
    }>;
};
export default _default;
