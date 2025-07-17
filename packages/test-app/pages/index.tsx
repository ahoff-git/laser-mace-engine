import { createWorld, Position } from 'laser-mace-engine'

export default function Home() {
  const world = createWorld({ components: [Position] })
  return <div>World created with engine: {Boolean(world).toString()}</div>
}
