import { System } from "ecsy";
import { Destroy } from "../components/Destroy";
/** Processes queued add/remove commands at the start of the frame */
export class SpawnSystem extends System {
    execute() {
        const world = this.world;
        const commands = world.commandQueue.flush();
        for (const cmd of commands) {
            if (cmd.type === "add") {
                cmd.create(world);
            }
            else if (cmd.type === "remove") {
                cmd.entity.addComponent(Destroy);
            }
        }
    }
}
