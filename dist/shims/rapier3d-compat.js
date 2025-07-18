export default {
    async init() {
        return {
            World: class {
                constructor(_gravity) { }
                step() { }
            },
            RigidBodyDesc: class {
                static newDynamic() { return {}; }
                setTranslation(_x, _y, _z) { return this; }
            },
            RigidBodyType: {},
        };
    },
};
