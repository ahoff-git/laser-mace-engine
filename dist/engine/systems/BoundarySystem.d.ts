import { System } from "ecsy";
export interface Bounds {
    min: {
        x: number;
        y: number;
        z: number;
    };
    max: {
        x: number;
        y: number;
        z: number;
    };
}
export interface BoundarySystemConfig {
    bounds?: Bounds;
}
export declare class BoundarySystem extends System {
    private bounds;
    init(attributes?: BoundarySystemConfig): void;
    execute(): void;
}
