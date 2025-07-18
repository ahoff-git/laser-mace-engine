/** Represents a single queued command entry */
export interface CommandEntry<T = any> {
    command: T;
    timestamp: number;
    processed: boolean;
}
export interface CommandQueueOptions {
    retentionMs?: number;
}
/**
 * CommandQueueManager maintains a timestamped command queue
 * with automatic expiration and processed flags.
 *
 * Example:
 * const queue = new CommandQueueManager({ retentionMs: 1000 });
 * queue.enqueue({ type: 'move' });
 * const cmds = queue.flush(); // returns unprocessed, valid commands
 */
export declare class CommandQueueManager<T = any> {
    private queue;
    private retentionMs;
    constructor(commandQueueOptions: CommandQueueOptions);
    /** Adds a command to the queue */
    enqueue(command: T): void;
    /**
     * Returns all unprocessed, non-expired commands,
     * marks them as processed.
     */
    flush(): T[];
    /** Returns a copy of the entire queue (processed or not, unfiltered) */
    getAll(): Array<{
        command: T;
        timestamp: number;
        processed: boolean;
    }>;
    /** Removes expired commands from queue */
    private purgeExpired;
    /** Returns total number of unexpired commands (processed or not) */
    size(): number;
    /** Manually clear the entire queue */
    clear(): void;
    /** Mark a command as processed manually (if needed) */
    markProcessed(target: T): void;
}
