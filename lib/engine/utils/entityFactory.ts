import { Position } from '../components/Position';
import { Velocity } from '../components/Velocity';
import { MeshComponent } from '../components/Mesh';
import { Collider } from '../components/Collider';
import { Immovable } from '../components/Immovable';
import { BoxGeometry, MeshBasicMaterial, Mesh } from 'three';

export interface CubeOptions {
  world: any;
  position?: { x: number; y: number; z: number };
  velocity?: { x: number; y: number; z: number };
  color?: number;
  size?: number;
  friction?: number;
  immovable?: boolean;
  /** If true, mark the entity so UI can treat it as stationary */
  stationary?: boolean;
}

export function createCubeEntity(opts: CubeOptions) {
  const {
    world,
    position = { x: 0, y: 0, z: 0 },
    velocity = { x: 0, y: 0, z: 0 },
    color = 0x00ff00,
    size = 4,
    friction = 0,
    immovable = false,
    stationary = false,
  } = opts;

  const geometry = new BoxGeometry(size, size, size);
  const material = new MeshBasicMaterial({ color });
  const cube = new Mesh(geometry, material);

  const entity = world
    .createEntity()
    .addComponent(Position, position)
    .addComponent(Velocity, velocity)
    .addComponent(Collider, { size, friction })
    .addComponent(MeshComponent, { mesh: cube });

  if (immovable) entity.addComponent(Immovable);
  if (stationary) (entity as any).stationary = true;

  return entity;
}

