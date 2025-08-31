import { System } from 'ecsy';
export interface WrapSystemConfig {
    width: number;
    height: number;
    depth?: number;
}
export declare class WrapSystem extends System {
    private width;
    private height;
    private depth;
    init(attrs?: WrapSystemConfig): void;
    execute(): void;
}
