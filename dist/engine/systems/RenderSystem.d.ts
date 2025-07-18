import { System } from "ecsy";
export interface RenderSystemConfig {
    canvas?: HTMLCanvasElement;
}
export declare class RenderSystem extends System {
    private scene;
    private camera;
    private renderer;
    init(attributes?: RenderSystemConfig): void;
    execute(): void;
}
