import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 20000;
    return controls;
}

export function resetView(controls, camera) {
    controls.target.set(0, 0, 0);
    camera.position.set(0, 600, 1200);
    controls.minDistance = 5;
}

export function setTopView(controls, camera) {
    controls.target.set(0, 0, 0);
    camera.position.set(0, 2000, 0);
}

