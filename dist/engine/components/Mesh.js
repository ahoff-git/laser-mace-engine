import { Component, Types } from "ecsy";
export class MeshComponent extends Component {
}
MeshComponent.schema = {
    mesh: { type: Types.Ref },
};
