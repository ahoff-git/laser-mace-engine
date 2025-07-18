export class Component {
}
export const Types = {
    Number: 'number',
    Ref: 'ref',
};
export class System {
    execute(_delta) { }
}
export class World {
    registerComponent(_c) { return this; }
    registerSystem(_s) { return this; }
}
