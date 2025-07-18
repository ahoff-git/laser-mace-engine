export declare class Scene {
    children: any[];
    add(obj: any): void;
}
export declare class PerspectiveCamera {
    fov: number;
    aspect: number;
    near: number;
    far: number;
    position: {
        z: number;
    };
    constructor(fov: number, aspect: number, near: number, far: number);
}
export declare class WebGLRenderer {
    options: any;
    constructor(options?: any);
    setSize(_w: number, _h: number): void;
    render(_scene: any, _camera: any): void;
}
export declare class Mesh {
    position: {
        x: number;
        y: number;
        z: number;
        set: (x: number, y: number, z: number) => void;
    };
}
