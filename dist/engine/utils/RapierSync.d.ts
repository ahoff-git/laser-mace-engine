import { Entity } from "ecsy";
/**
 * Interface for synchronizing ECSY component data with a Rapier body.
 */
export interface RapierSync {
    /** Copy component data from ECSY to the Rapier body. */
    toRapier(entity: Entity, body: any): void;
    /** Copy physics results from the Rapier body back into ECSY components. */
    fromRapier(entity: Entity, body: any): void;
}
/**
 * Default synchronisation behaviour which reads Position and Velocity
 * components to drive the Rapier body and writes back the resulting
 * translation after the physics step.
 */
export declare class DefaultRapierSync implements RapierSync {
    private lastPosToRapierAt;
    private lastVelToRapierAt;
    toRapier(entity: Entity, body: any): void;
    fromRapier(entity: Entity, body: any): void;
}
