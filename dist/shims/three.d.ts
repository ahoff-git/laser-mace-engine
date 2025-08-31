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
        x: number;
        y: number;
        z: number;
        multiplyScalar: (s: number) => void;
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
    constructor(_geometry?: any, _material?: any);
    position: {
        x: number;
        y: number;
        z: number;
        set: (x: number, y: number, z: number) => void;
    };
}
export declare class BoxGeometry {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
}
export declare class MeshBasicMaterial {
    options: any;
    constructor(options: any);
}
