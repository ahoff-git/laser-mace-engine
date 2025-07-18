import { Component } from "ecsy";
import { Mesh } from "three";
export declare class MeshComponent extends Component<MeshComponent> {
    mesh: Mesh;
    static schema: {
        mesh: {
            type: any;
        };
    };
}
