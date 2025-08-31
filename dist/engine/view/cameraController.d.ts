/**
 * Factory for camera utilities to keep engine free of view logic.
 */
export declare function createCameraController(renderSystem: any): {
    adjustZoom: (delta: number) => number | undefined;
    zoomIn: () => number | undefined;
    zoomOut: () => number | undefined;
    orbitCamera: () => void;
    stopOrbit: () => void;
};
