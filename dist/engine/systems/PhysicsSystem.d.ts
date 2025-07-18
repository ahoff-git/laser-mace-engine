import { System } from "ecsy";
export interface PhysicsSystemConfig {
    gravity?: {
        x: number;
        y: number;
        z: number;
    };
}
export declare class PhysicsSystem extends System {
    private rapier;
    private physicsWorld;
    private bodies;
    init(attributes?: PhysicsSystemConfig): Promise<void>;
    execute(_delta: number): void;
    stop(): void;
}
