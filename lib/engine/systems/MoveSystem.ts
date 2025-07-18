import { System } from "ecsy";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";

export class MoveSystem extends System {
  execute(delta: number): void {
    this.queries.movers.results.forEach((entity: any) => {
      const pos = entity.getMutableComponent(Position)!;
      const vel = entity.getComponent(Velocity)!;
      pos.x += vel.x * delta;
      pos.y += vel.y * delta;
      pos.z += vel.z * delta;
    });
  }
}

MoveSystem.queries = {
  movers: { components: [Position, Velocity] },
};
