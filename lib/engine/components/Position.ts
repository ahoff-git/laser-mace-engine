import { Component, Types } from "ecsy";

export class Position extends Component<Position> {
  x!: number;
  y!: number;
  z!: number;

  static schema = {
    x: { type: Types.Number, default: 0 },
    y: { type: Types.Number, default: 0 },
    z: { type: Types.Number, default: 0 },
  };
}
