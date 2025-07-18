import { Component } from "ecsy";
export declare class Velocity extends Component<Velocity> {
    x: number;
    y: number;
    z: number;
    static schema: {
        x: {
            type: import("ecsy").NumberPropType;
            default: number;
        };
        y: {
            type: import("ecsy").NumberPropType;
            default: number;
        };
        z: {
            type: import("ecsy").NumberPropType;
            default: number;
        };
    };
}
