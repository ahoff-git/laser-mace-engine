import { System } from "ecsy";
import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { Collider } from "../components/Collider";
import { Bounds } from "../types";

export interface BoundarySystemConfig {
  bounds?: Bounds;
}

export class BoundarySystem extends System {
  private bounds: Bounds = {
    min: { x: -10, y: -10, z: -10 },
    max: { x: 10, y: 10, z: 10 },
  };

  init(attributes?: BoundarySystemConfig): void {
    if (attributes?.bounds) {
      this.bounds = attributes.bounds;
    }
  }

  execute(): void {
    const entities = this.queries.movers.results;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const pos = entity.getMutableComponent(Position)!;
      const vel = entity.getMutableComponent(Velocity)!;
      const col = entity.getComponent(Collider);
      const r = col ? (typeof (col as any).radius === 'number' && (col as any).radius > 0 ? (col as any).radius : ((col as any).size ? (col as any).size / 2 : 0)) : 0;
      if (pos.x - r < this.bounds.min.x) {
        pos.x = this.bounds.min.x + r;
        vel.x *= -1;
      } else if (pos.x + r > this.bounds.max.x) {
        pos.x = this.bounds.max.x - r;
        vel.x *= -1;
      }
      if (pos.y - r < this.bounds.min.y) {
        pos.y = this.bounds.min.y + r;
        vel.y *= -1;
      } else if (pos.y + r > this.bounds.max.y) {
        pos.y = this.bounds.max.y - r;
        vel.y *= -1;
      }
      if (pos.z - r < this.bounds.min.z) {
        pos.z = this.bounds.min.z + r;
        vel.z *= -1;
      } else if (pos.z + r > this.bounds.max.z) {
        pos.z = this.bounds.max.z - r;
        vel.z *= -1;
      }
    }

    // handle simple elastic collisions between movers
    for (let i = 0; i < entities.length; i++) {
      for (let j = i + 1; j < entities.length; j++) {
        const a = entities[i];
        const b = entities[j];
        const posA = a.getMutableComponent(Position)!;
        const posB = b.getMutableComponent(Position)!;
        const velA = a.getMutableComponent(Velocity)!;
        const velB = b.getMutableComponent(Velocity)!;
        const colA = a.getComponent(Collider);
        const colB = b.getComponent(Collider);
        const rA = colA ? (typeof (colA as any).radius === 'number' && (colA as any).radius > 0 ? (colA as any).radius : ((colA as any).size ? (colA as any).size / 2 : 0)) : 0;
        const rB = colB ? (typeof (colB as any).radius === 'number' && (colB as any).radius > 0 ? (colB as any).radius : ((colB as any).size ? (colB as any).size / 2 : 0)) : 0;
        const dx = posB.x - posA.x;
        const dy = posB.y - posA.y;
        const dz = posB.z - posA.z;
        const distSq = dx * dx + dy * dy + dz * dz;
        const rad = rA + rB;
        if (distSq <= rad * rad && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;
          const dvx = velA.x - velB.x;
          const dvy = velA.y - velB.y;
          const dvz = velA.z - velB.z;
          const relVel = dvx * nx + dvy * ny + dvz * nz;
          if (relVel < 0) {
            const impulse = -2 * relVel / 2; // assume equal mass
            velA.x += impulse * nx;
            velA.y += impulse * ny;
            velA.z += impulse * nz;
            velB.x -= impulse * nx;
            velB.y -= impulse * ny;
            velB.z -= impulse * nz;
          }
          const overlap = rad - dist;
          const adjust = overlap / 2;
          posA.x -= nx * adjust;
          posA.y -= ny * adjust;
          posA.z -= nz * adjust;
          posB.x += nx * adjust;
          posB.y += ny * adjust;
          posB.z += nz * adjust;
        }
      }
    }
  }
}

BoundarySystem.queries = {
  movers: { components: [Position, Velocity] },
};
