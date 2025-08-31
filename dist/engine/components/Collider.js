import { Component, Types } from "ecsy";
export class Collider extends Component {
}
Collider.schema = {
    radius: { type: Types.Number, default: 1 },
    size: { type: Types.Number, default: 0 },
    friction: { type: Types.Number, default: 0 },
};
