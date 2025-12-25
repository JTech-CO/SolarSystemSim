import * as THREE from 'three';
import { CONFIG } from '../config.js';
import { generateTexture } from '../utils/textureGenerator.js';
import { AU, calculateTrueAnomaly, calculateEllipticalDistance } from '../utils/physics.js';

export function createPlanetsAndDwarfs(scene, objects, updateables, planets, dwarfs) {
    const allBodies = [...planets, ...dwarfs];
    
    allBodies.forEach(data => {
        const eccentricity = data.eccentricity !== undefined ? data.eccentricity : 0;
        const semiMajorAxisAU = data.orbit;
        const semiMajorAxisMeters = semiMajorAxisAU * AU;
        const semiMajorAxisSim = semiMajorAxisAU * CONFIG.scale.orbit;
        const initialMeanAnomaly = Math.random() * Math.PI * 2;
        
        const pivot = new THREE.Object3D();
        pivot.userData = {
            type: 'ellipticalOrbit',
            speed: data.speed,
            semiMajorAxisAU: semiMajorAxisAU,
            semiMajorAxisMeters: semiMajorAxisMeters,
            semiMajorAxisSim: semiMajorAxisSim,
            eccentricity: eccentricity,
            orbitalPeriod: data.orbitalPeriod,
            initialMeanAnomaly: initialMeanAnomaly,
            meanAnomaly: initialMeanAnomaly,
            trueAnomaly: 0,
            time: 0
        };
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
        
        const initialTrueAnomaly = calculateTrueAnomaly(initialMeanAnomaly, eccentricity);
        const initialDistanceSim = calculateEllipticalDistance(
            semiMajorAxisSim,
            eccentricity,
            initialTrueAnomaly
        );
        mesh.position.x = CONFIG.scale.sun + initialDistanceSim * Math.cos(initialTrueAnomaly);
        mesh.position.z = initialDistanceSim * Math.sin(initialTrueAnomaly);
        mesh.position.y = 0;
        pivot.userData.trueAnomaly = initialTrueAnomaly;
        
        mesh.userData = { ...data, isBody: true, pivot: pivot };
        pivot.add(mesh);
        objects.push(mesh);

        const avgOrbitRad = semiMajorAxisSim + CONFIG.scale.sun;
        const orbitLine = new THREE.Mesh(
            new THREE.RingGeometry(avgOrbitRad - 0.5, avgOrbitRad + 0.5, 128),
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
                const moonEccentricity = m.eccentricity !== undefined ? m.eccentricity : 0;
                const moonSemiMajorAxisSim = (data.size * CONFIG.scale.planet) * 2 + (m.orbit * 4);
                const moonInitialMeanAnomaly = Math.random() * Math.PI * 2;
                
                const mPivot = new THREE.Object3D();
                mPivot.userData = {
                    type: 'ellipticalOrbit',
                    speed: m.speed,
                    semiMajorAxisSim: moonSemiMajorAxisSim,
                    eccentricity: moonEccentricity,
                    orbitalPeriod: m.orbitalPeriod,
                    initialMeanAnomaly: moonInitialMeanAnomaly,
                    meanAnomaly: moonInitialMeanAnomaly,
                    trueAnomaly: 0,
                    time: 0,
                    isMoon: true
                };
                mesh.add(mPivot);

                const mGeo = new THREE.SphereGeometry(m.size * CONFIG.scale.planet, 16, 16);
                const mMat = new THREE.MeshStandardMaterial({ color: m.color[0] });
                const mMesh = new THREE.Mesh(mGeo, mMat);
                
                const moonInitialTrueAnomaly = calculateTrueAnomaly(moonInitialMeanAnomaly, moonEccentricity);
                const moonInitialDistanceSim = calculateEllipticalDistance(
                    moonSemiMajorAxisSim,
                    moonEccentricity,
                    moonInitialTrueAnomaly
                );
                mMesh.position.x = moonInitialDistanceSim * Math.cos(moonInitialTrueAnomaly);
                mMesh.position.z = moonInitialDistanceSim * Math.sin(moonInitialTrueAnomaly);
                mMesh.position.y = 0;
                mPivot.userData.trueAnomaly = moonInitialTrueAnomaly;
                
                mMesh.userData = { ...m, type: "Moon", isBody: true, parentName: data.name, pivot: mPivot };
                mPivot.add(mMesh);
                objects.push(mMesh);
                
                const mOrbit = new THREE.Mesh(
                    new THREE.RingGeometry(moonSemiMajorAxisSim - 0.1, moonSemiMajorAxisSim + 0.1, 32),
                    new THREE.MeshBasicMaterial({ color: 0x666666, side: THREE.DoubleSide, transparent: true, opacity: 0.3 })
                );
                mOrbit.rotation.x = Math.PI / 2;
                mesh.add(mOrbit);

                updateables.push({ type: 'ellipticalOrbit', obj: mPivot, mesh: mMesh });
                updateables.push({ type: 'rotate', obj: mMesh, rotationPeriod: m.rotationPeriod });
            });
        }

        updateables.push({ type: 'ellipticalOrbit', obj: pivot, mesh: mesh });
        updateables.push({ type: 'rotate', obj: mesh, rotationPeriod: data.rotationPeriod });
        
        data.meshRef = mesh;
        data.moons?.forEach((m) => {
            m.meshRef = mesh.children.find(c => c.children[0]?.userData.name === m.name)?.children[0];
        });
    });
}

