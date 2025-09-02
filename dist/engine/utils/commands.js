/** Queue a function that creates an entity when the spawn system runs */
export function queueAdd(world, create) {
    world.commandQueue.enqueue({ type: "add", create });
}
/** Queue an entity to be removed at the end of the frame */
export function queueRemove(world, entity) {
    world.commandQueue.enqueue({ type: "remove", entity });
}
