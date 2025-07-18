import { World as ECSYWorld } from "ecsy";
import { CommandQueueManager } from "./utils/CommandQueueManager";
export class EngineWorld extends ECSYWorld {
    constructor(commandQueueOptions) {
        super();
        this.commandQueue = new CommandQueueManager(commandQueueOptions);
    }
}
export function createWorld(worldConfig = {}) {
    const { components = [], systems = [], commandQueueOptions = {} } = worldConfig;
    const world = new EngineWorld(commandQueueOptions);
    components.forEach((c) => world.registerComponent(c));
    systems.forEach((s) => world.registerSystem(s));
    return world;
}
