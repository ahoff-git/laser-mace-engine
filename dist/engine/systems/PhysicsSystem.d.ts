import { System } from "ecsy";
import { RapierSync } from "../utils/RapierSync";
export interface PhysicsSystemConfig {
    gravity?: {
        x: number;
        y: number;
        z: number;
    };
    syncer?: RapierSync;
}
export declare class PhysicsSystem extends System {
    private rapier;
    private physicsWorld;
    private bodies;
    private syncer;
    init(attributes?: PhysicsSystemConfig): Promise<void>;
    execute(_delta: number): void;
    stop(): void;
}
