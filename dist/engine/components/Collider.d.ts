import { Component } from "ecsy";
export declare class Collider extends Component<Collider> {
    /** Radius of the collider used for simple sphere collisions */
    radius: number;
    /** Side length of a cube collider used by RapierSystem */
    size: number;
    /** Friction coefficient for Rapier colliders (0 = no drag) */
    friction: number;
    static schema: {
        radius: {
            type: any;
            default: number;
        };
        size: {
            type: any;
            default: number;
        };
        friction: {
            type: any;
            default: number;
        };
    };
}
