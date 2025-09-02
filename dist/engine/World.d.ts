import { World as ECSYWorld } from "ecsy";
import { CommandQueueManager, CommandQueueOptions } from "./utils/CommandQueueManager";
import type { EngineCommand } from "./utils/commands";
export interface WorldConfig {
    components?: any[];
    systems?: any[];
    commandQueueOptions?: CommandQueueOptions;
}
export declare class EngineWorld extends ECSYWorld {
    commandQueue: CommandQueueManager<EngineCommand>;
    constructor(commandQueueOptions: CommandQueueOptions);
}
export declare function createWorld(worldConfig?: WorldConfig): EngineWorld;
