import { System } from 'ecsy';
import type * as RAPIERType from '@dimforge/rapier3d-compat';
import { Bounds } from '../types';
export interface RapierSystemConfig {
    gravity?: {
        x: number;
        y: number;
        z: number;
    };
    /** Callback fired when two colliders start or stop colliding */
    onCollision?: (entityA: any, entityB: any, started: boolean) => void;
    /** Optional bounds to create static wall colliders */
    bounds?: Bounds;
    /** Fixed physics timestep in seconds (default 1/60) */
    fixedDelta?: number;
    /** Maximum substeps per execute to avoid spiral-of-death (default 5) */
    maxSubSteps?: number;
}
export declare class RapierSystem extends System<RapierSystemConfig> {
    rapier: typeof import('@dimforge/rapier3d-compat') | null;
    world: RAPIERType.World | null;
    private bodyMap;
    private colliderMap;
    private entityColliderMap;
    private eventQueue;
    private onCollision?;
    private pendingBounds?;
    private pendingAdds;
    private pendingRemoves;
    private accumulator;
    private fixedDelta;
    private maxSubSteps;
    /** Current number of physics bodies tracked by the system. */
    bodyCount(): number;
    init(attrs?: RapierSystemConfig): void;
    execute(delta: number): void;
    private addBody;
    private createBoundaryColliders;
    /** Remove the Rapier rigid body and collider for the given entity. */
    removeBody(entity: any): void;
    dispose(): void;
}
