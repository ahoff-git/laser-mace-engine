import { System } from "ecsy";
import { Scene, PerspectiveCamera, WebGLRenderer } from "three";
import { Position } from "../components/Position";
import { MeshComponent } from "../components/Mesh";
export class RenderSystem extends System {
    init(attributes) {
        const canvas = attributes?.canvas;
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, 1, 0.1, 1000);
        this.camera.position.z = 5;
        this.renderer = new WebGLRenderer({ canvas });
        if (canvas) {
            this.renderer.setSize(canvas.width, canvas.height);
        }
    }
    execute() {
        this.queries.renderables.results.forEach((entity) => {
            const pos = entity.getComponent(Position);
            const meshComp = entity.getComponent(MeshComponent);
            meshComp.mesh.position.set(pos.x, pos.y, pos.z);
            if (!this.scene.children.includes(meshComp.mesh)) {
                this.scene.add(meshComp.mesh);
            }
        });
        this.renderer.render(this.scene, this.camera);
    }
}
RenderSystem.queries = {
    renderables: { components: [Position, MeshComponent] },
};
