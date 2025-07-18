import { Component, Types } from "ecsy";

export class Collider extends Component<Collider> {
  /** Radius of the collider used for simple sphere collisions */
  radius!: number;

  static schema = {
    radius: { type: Types.Number, default: 1 },
  };
}
