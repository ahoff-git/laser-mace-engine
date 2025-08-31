import { Position } from "../components/Position";
import { Velocity } from "../components/Velocity";
import { nowMs } from "./common";
/**
 * Default synchronisation behaviour which reads Position and Velocity
 * components to drive the Rapier body and writes back the resulting
 * translation after the physics step.
 */
export class DefaultRapierSync {
    constructor() {
        this.lastPosToRapierAt = new Map();
        this.lastVelToRapierAt = new Map();
    }
    toRapier(entity, body) {
        const eid = entity.id;
        const pos = entity.getComponent(Position);
        if (pos && body.setTranslation) {
            const last = this.lastPosToRapierAt.get(eid) ?? -1;
            if (last < (pos.updatedAt ?? 0)) {
                body.setTranslation({ x: pos.x, y: pos.y, z: pos.z }, false);
                this.lastPosToRapierAt.set(eid, pos.updatedAt ?? 0);
            }
        }
        const vel = entity.getComponent(Velocity);
        if (vel && body.setLinvel) {
            const last = this.lastVelToRapierAt.get(eid) ?? -1;
            if (last < (vel.updatedAt ?? 0)) {
                body.setLinvel({ x: vel.x, y: vel.y, z: vel.z }, true);
                this.lastVelToRapierAt.set(eid, vel.updatedAt ?? 0);
            }
        }
    }
    fromRapier(entity, body) {
        if (body.translation) {
            const t = body.translation();
            const pos = entity.getMutableComponent(Position);
            if (pos && (pos.x !== t.x || pos.y !== t.y || pos.z !== t.z)) {
                pos.x = t.x;
                pos.y = t.y;
                pos.z = t.z;
                pos.updatedAt = nowMs();
            }
        }
    }
}
