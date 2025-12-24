import * as THREE from 'three';

export function createTrail(color) {
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.LineBasicMaterial({ color: color, transparent: true, opacity: 0.4 });
    return new THREE.Line(geometry, material);
}

