export class Scene {
    constructor() {
        this.children = [];
    }
    add(obj) {
        if (!this.children.includes(obj)) {
            this.children.push(obj);
        }
    }
}
export class PerspectiveCamera {
    constructor(fov, aspect, near, far) {
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.position = {
            x: 0,
            y: 0,
            z: 0,
            multiplyScalar: (s) => {
                this.position.x *= s;
                this.position.y *= s;
                this.position.z *= s;
            },
        };
    }
}
export class WebGLRenderer {
    constructor(options = {}) {
        this.options = options;
    }
    setSize(_w, _h) { }
    render(_scene, _camera) { }
}
export class Mesh {
    constructor(_geometry, _material) {
        this.position = {
            x: 0,
            y: 0,
            z: 0,
            set: (x, y, z) => {
                this.position.x = x;
                this.position.y = y;
                this.position.z = z;
            },
        };
    }
}
export class BoxGeometry {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
export class MeshBasicMaterial {
    constructor(options) {
        this.options = options;
    }
}
