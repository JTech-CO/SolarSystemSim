import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { generateTexture } from '../utils/textureGenerator.js';

export function createPlanetsAndDwarfs(scene, objects, updateables, planets, dwarfs) {
    const allBodies = [...planets, ...dwarfs];
    
    allBodies.forEach(data => {
        const orbitRad = data.orbit * CONFIG.scale.orbit + CONFIG.scale.sun;
        
        const pivot = new THREE.Object3D();
        pivot.userData = { speed: data.speed, angle: Math.random() * Math.PI * 2 };
        scene.add(pivot);

        const geo = new THREE.SphereGeometry(data.size * CONFIG.scale.planet, 32, 32);
        const tex = generateTexture(data.color);
        const mat = new THREE.MeshStandardMaterial({
            map: tex,
            roughness: 0.6,
            metalness: 0.2,
            emissive: new THREE.Color(data.color[0]),
            emissiveIntensity: 0.15
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.x = orbitRad;
        mesh.userData = { ...data, isBody: true };
        pivot.add(mesh);
        objects.push(mesh);

        const orbitLine = new THREE.Mesh(
            new THREE.RingGeometry(orbitRad - 0.5, orbitRad + 0.5, 128),
            new THREE.MeshBasicMaterial({ color: 0x444444, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
        );
        orbitLine.rotation.x = Math.PI / 2;
        scene.add(orbitLine);

        if (data.hasRing) {
            const ring = new THREE.Mesh(
                new THREE.RingGeometry(data.size * CONFIG.scale.planet * 1.4, data.size * CONFIG.scale.planet * 2.5, 64),
                new THREE.MeshStandardMaterial({ color: 0xccba98, side: THREE.DoubleSide, transparent: true, opacity: 0.7 })
            );
            ring.rotation.x = -Math.PI / 2.2;
            mesh.add(ring);
        }

        if (data.moons) {
            data.moons.forEach(m => {
                const mPivot = new THREE.Object3D();
                mPivot.userData = { speed: m.speed, angle: Math.random() * Math.PI * 2 };
                mesh.add(mPivot);

                const mGeo = new THREE.SphereGeometry(m.size * CONFIG.scale.planet, 16, 16);
                const mMat = new THREE.MeshStandardMaterial({ color: m.color[0] });
                const mMesh = new THREE.Mesh(mGeo, mMat);
                
                const dist = (data.size * CONFIG.scale.planet) * 2 + (m.orbit * 4);
                mMesh.position.x = dist;
                mMesh.userData = { ...m, type: "Moon", isBody: true, parentName: data.name };
                mPivot.add(mMesh);
                objects.push(mMesh);
                
                const mOrbit = new THREE.Mesh(
                    new THREE.RingGeometry(dist - 0.1, dist + 0.1, 32),
                    new THREE.MeshBasicMaterial({ color: 0x666666, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
                );
                mOrbit.rotation.x = Math.PI / 2;
                mesh.add(mOrbit);

                updateables.push({ type: 'orbit', obj: mPivot });
                updateables.push({ type: 'rotate', obj: mMesh });
            });
        }

        updateables.push({ type: 'orbit', obj: pivot });
        updateables.push({ type: 'rotate', obj: mesh });
        
        data.meshRef = mesh;
        data.moons?.forEach((m) => {
            m.meshRef = mesh.children.find(c => c.children[0]?.userData.name === m.name)?.children[0];
        });
    });
}

