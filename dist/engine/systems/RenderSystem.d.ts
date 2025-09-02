import { System } from "ecsy";
export interface RenderSystemConfig {
    canvas?: HTMLCanvasElement;
}
export declare class RenderSystem extends System {
    private scene;
    private camera;
    private renderer;
    private lastPosAt;
    /** Current number of mesh objects in the scene. */
    objectCount(): number;
    init(attributes?: RenderSystemConfig): void;
    private handleRemovals;
    execute(): void;
    dispose(): void;
}
