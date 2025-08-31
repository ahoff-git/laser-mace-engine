export interface CubeOptions {
    world: any;
    position?: {
        x: number;
        y: number;
        z: number;
    };
    velocity?: {
        x: number;
        y: number;
        z: number;
    };
    color?: number;
    size?: number;
    friction?: number;
    immovable?: boolean;
    /** If true, mark the entity so UI can treat it as stationary */
    stationary?: boolean;
}
export declare function createCubeEntity(opts: CubeOptions): any;
