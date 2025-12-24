import * as THREE from 'three';

export function createStarField(scene) {
    const geo = new THREE.BufferGeometry();
    const pos = [], col = [];
    for (let i = 0; i < 5000; i++) {
        const r = 5000 + Math.random() * 10000;
        const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
        pos.push(r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph));
        const c = new THREE.Color().setHSL(Math.random(), 0.5, Math.random() * 0.5 + 0.5);
        col.push(c.r, c.g, c.b);
    }
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 3, vertexColors: true });
    scene.add(new THREE.Points(geo, mat));
}

