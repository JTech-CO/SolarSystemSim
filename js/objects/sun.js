import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { generateGlowTexture } from '../utils/textureGenerator.js';

export function createSun(scene, objects) {
    const geo = new THREE.SphereGeometry(CONFIG.scale.sun, 64, 64);
    const mat = new THREE.MeshBasicMaterial({ color: 0xffaa00 });
    const sun = new THREE.Mesh(geo, mat);
    sun.userData = { name: "Sun", type: "Star", desc: "The center of the solar system." };
    scene.add(sun);
    objects.push(sun);

    const spriteMat = new THREE.SpriteMaterial({
        map: generateGlowTexture(),
        color: 0xffdd44,
        transparent: true,
        blending: THREE.AdditiveBlending
    });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(CONFIG.scale.sun * 6, CONFIG.scale.sun * 6, 1);
    sun.add(sprite);

    return sun;
}

