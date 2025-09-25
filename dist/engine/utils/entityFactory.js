import { Position } from '../components/Position';
import { Velocity } from '../components/Velocity';
import { MeshComponent } from '../components/Mesh';
import { Collider } from '../components/Collider';
import { BodyType } from '../components/BodyType';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';
export function createCubeEntity(opts) {
    const { world, position = { x: 0, y: 0, z: 0 }, velocity = { x: 0, y: 0, z: 0 }, color = 0x00ff00, size = 4, friction = 0, bodyType = 'dynamic', stationary = false, } = opts;
    const geometry = new BoxGeometry(size, size, size);
    const material = new MeshBasicMaterial({ color });
    const cube = new Mesh(geometry, material);
    const entity = world
        .createEntity()
        .addComponent(Position, position)
        .addComponent(Velocity, velocity)
        .addComponent(Collider, { size, friction })
        .addComponent(MeshComponent, { mesh: cube });
    entity.addComponent(BodyType, { value: bodyType });
    if (stationary)
        entity.stationary = true;
    return entity;
}
