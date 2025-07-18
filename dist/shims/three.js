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
        this.position = { z: 0 };
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
    constructor() {
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
