/**
 * Returns a monotonic-ish timestamp in milliseconds.
 * Uses performance.now() when available to avoid clock jumps.
 */
export declare const nowMs: () => number;
/**
 * Returns an effective collider radius from a Collider component-like object.
 * Falls back from explicit `radius` to half of `size`, otherwise 0.
 */
export declare const colliderRadius: (col: any) => number;
/**
 * Clamps a derived mass from a cube size to a sensible range.
 */
export declare const massFromSize: (size: number) => number;
