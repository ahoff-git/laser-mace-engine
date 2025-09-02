import { Entity } from "ecsy";
import type { EngineWorld } from "../World";
/** Command describing an entity creation action */
export interface AddCommand {
    type: "add";
    create: (world: EngineWorld) => void;
}
/** Command describing an entity removal request */
export interface RemoveCommand {
    type: "remove";
    entity: Entity;
}
export type EngineCommand = AddCommand | RemoveCommand;
/** Queue a function that creates an entity when the spawn system runs */
export declare function queueAdd(world: EngineWorld, create: (world: EngineWorld) => void): void;
/** Queue an entity to be removed at the end of the frame */
export declare function queueRemove(world: EngineWorld, entity: Entity): void;
