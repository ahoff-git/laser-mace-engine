import { Component } from "ecsy";
export declare class Collider extends Component<Collider> {
    /** Radius of the collider used for simple sphere collisions */
    radius: number;
    static schema: {
        radius: {
            type: import("ecsy").NumberPropType;
            default: number;
        };
    };
}
