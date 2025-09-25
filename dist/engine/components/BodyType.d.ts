import { Component } from 'ecsy';
export declare const BODY_TYPE_VALUES: readonly ["fixed", "kinematic", "dynamic"];
export type BodyTypeValue = (typeof BODY_TYPE_VALUES)[number];
export declare const DEFAULT_BODY_TYPE: BodyTypeValue;
export declare function normalizeBodyType(value: string | undefined): BodyTypeValue;
/**
 * Defines the Rapier rigid body type to create for an entity.
 */
export declare class BodyType extends Component<BodyType> {
    value: BodyTypeValue;
    static schema: {
        value: {
            type: any;
            default: "fixed" | "kinematic" | "dynamic";
        };
    };
    copy(src: BodyType): this;
    reset(): void;
}
