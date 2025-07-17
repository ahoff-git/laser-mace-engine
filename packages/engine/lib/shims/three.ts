export class Scene {
  children: any[] = [];
  add(obj: any): void {
    if (!this.children.includes(obj)) {
      this.children.push(obj);
    }
  }
}

export class PerspectiveCamera {
  position = { z: 0 };
  constructor(public fov: number, public aspect: number, public near: number, public far: number) {}
}

export class WebGLRenderer {
  constructor(public options: any = {}) {}
  setSize(_w: number, _h: number): void {}
  render(_scene: any, _camera: any): void {}
}

export class Mesh {
  position = {
    x: 0,
    y: 0,
    z: 0,
    set: (x: number, y: number, z: number) => {
      this.position.x = x;
      this.position.y = y;
      this.position.z = z;
    },
  };
}
