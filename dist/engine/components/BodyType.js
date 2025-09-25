import { Component, Types } from 'ecsy';
export const BODY_TYPE_VALUES = ['fixed', 'kinematic', 'dynamic'];
export const DEFAULT_BODY_TYPE = 'dynamic';
function resolveStringType() {
    return Types.String ?? Types.Ref;
}
export function normalizeBodyType(value) {
    return BODY_TYPE_VALUES.includes(value ?? '')
        ? value
        : DEFAULT_BODY_TYPE;
}
/**
 * Defines the Rapier rigid body type to create for an entity.
 */
export class BodyType extends Component {
    copy(src) {
        this.value = normalizeBodyType(src.value);
        return this;
    }
    reset() {
        this.value = DEFAULT_BODY_TYPE;
    }
}
BodyType.schema = {
    value: { type: resolveStringType(), default: DEFAULT_BODY_TYPE },
};
