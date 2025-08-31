import { Component, Types } from "ecsy";
export class Velocity extends Component {
}
Velocity.schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 },
    updatedAt: { type: Types.Number, default: 0 },
};
