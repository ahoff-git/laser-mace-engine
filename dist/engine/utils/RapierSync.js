import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
/**
 * Default synchronisation behaviour which reads Position and Velocity
 * components to drive the Rapier body and writes back the resulting
 * translation after the physics step.
 */
export class DefaultRapierSync {
    toRapier(entity, body) {
        const pos = entity.getComponent(Position);
        if (pos && body.setTranslation) {
            body.setTranslation({ x: pos.x, y: pos.y, z: pos.z }, false);
        }
        const vel = entity.getComponent(Velocity);
        if (vel && body.setLinvel) {
            body.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);
        }
    }
    fromRapier(entity, body) {
        if (body.translation) {
            const t = body.translation();
            const pos = entity.getMutableComponent(Position);
            if (pos) {
                pos.x = t.x;
                pos.y = t.y;
                pos.z = t.z;
            }
        }
    }
}
