/**
 * CommandQueueManager maintains a timestamped command queue
 * with automatic expiration and processed flags.
 *
 * Example:
 * const queue = new CommandQueueManager({ retentionMs: 1000 });
 * queue.enqueue({ type: 'move' });
 * const cmds = queue.flush(); // returns unprocessed, valid commands
 */
export class CommandQueueManager {
    constructor(commandQueueOptions) {
        this.queue = [];
        const { retentionMs = 1000 } = commandQueueOptions;
        this.retentionMs = retentionMs;
    }
    /** Adds a command to the queue */
    enqueue(command) {
        this.queue.push({
            command,
            timestamp: Date.now(),
            processed: false,
        });
    }
    /**
     * Returns all unprocessed, non-expired commands,
     * marks them as processed.
     */
    flush() {
        const now = Date.now();
        const validCommands = [];
        for (const entry of this.queue) {
            if (!entry.processed && now - entry.timestamp <= this.retentionMs) {
                validCommands.push(entry.command);
                entry.processed = true;
            }
        }
        this.purgeExpired(now);
        return validCommands;
    }
    /** Returns a copy of the entire queue (processed or not, unfiltered) */
    getAll() {
        return [...this.queue];
    }
    /** Removes expired commands from queue */
    purgeExpired(now = Date.now()) {
        this.queue = this.queue.filter((entry) => now - entry.timestamp <= this.retentionMs);
    }
    /** Returns total number of unexpired commands (processed or not) */
    size() {
        return this.queue.length;
    }
    /** Manually clear the entire queue */
    clear() {
        this.queue = [];
    }
    /** Mark a command as processed manually (if needed) */
    markProcessed(target) {
        for (const entry of this.queue) {
            if (entry.command === target) {
                entry.processed = true;
            }
        }
    }
}
