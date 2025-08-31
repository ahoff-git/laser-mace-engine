import { System } from "ecsy";
import { Bounds } from "../types";
export interface BoundarySystemConfig {
    bounds?: Bounds;
}
export declare class BoundarySystem extends System {
    private bounds;
    init(attributes?: BoundarySystemConfig): void;
    execute(): void;
}
