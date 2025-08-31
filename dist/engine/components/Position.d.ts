import { Component } from "ecsy";
export declare class Position extends Component<Position> {
    x: number;
    y: number;
    z: number;
    /** Monotonic timestamp (ms) of last update */
    updatedAt: number;
    static schema: {
        x: {
            type: any;
            default: number;
        };
        y: {
            type: any;
            default: number;
        };
        z: {
            type: any;
            default: number;
        };
        updatedAt: {
            type: any;
            default: number;
        };
    };
}
