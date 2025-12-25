import * as THREE from 'three';
import { CONFIG } from '../config.js';
import {
    calculateMeanAnomaly,
    calculateTrueAnomaly,
    calculateEllipticalDistance,
    calculateRotationAngularVelocity
} from '../utils/physics.js';

export function createAnimationLoop(scene, camera, renderer, controls, updateables, cometSystems, sun, selectedTarget, updateDashboardRealTime) {
    const clock = new THREE.Clock();
    let time = 0;
    const sunPosition = new THREE.Vector3(0, 0, 0);

    function animate() {
        requestAnimationFrame(animate);
        const dt = clock.getDelta();
        const realDt = dt * CONFIG.speed;
        time += realDt;

        // Debug: Log updateables status (first frame only)
        if (time < 0.1 && updateables.length > 0) {
            console.log('[Debug] updateables count:', updateables.length);
            const ellipticalOrbits = updateables.filter(item => item.type === 'ellipticalOrbit');
            const rotations = updateables.filter(item => item.type === 'rotate');
            console.log('[Debug] ellipticalOrbit:', ellipticalOrbits.length, 'rotate:', rotations.length);
            if (ellipticalOrbits.length > 0) {
                const first = ellipticalOrbits[0];
                console.log('[Debug] First orbit:', {
                    hasMesh: !!first.mesh,
                    hasObj: !!first.obj,
                    orbitalPeriod: first.obj?.userData?.orbitalPeriod,
                    time: first.obj?.userData?.time,
                    meanAnomaly: first.obj?.userData?.meanAnomaly
                });
            }
        }

        updateables.forEach(item => {
            if (item.type === 'ellipticalOrbit') {
                const orbitData = item.obj.userData;
                const mesh = item.mesh;
                
                if (!orbitData || !mesh) {
                    console.warn('[Debug] Invalid ellipticalOrbit item:', item);
                    return;
                }
                
                orbitData.time += dt;
                
                if (orbitData.orbitalPeriod) {
                    orbitData.meanAnomaly = calculateMeanAnomaly(
                        orbitData.time,
                        orbitData.orbitalPeriod,
                        orbitData.initialMeanAnomaly
                    );
                } else {
                    const angularVel = orbitData.speed * 0.05;
                    orbitData.meanAnomaly = orbitData.initialMeanAnomaly + angularVel * orbitData.time;
                    while (orbitData.meanAnomaly < 0) orbitData.meanAnomaly += 2 * Math.PI;
                    while (orbitData.meanAnomaly >= 2 * Math.PI) orbitData.meanAnomaly -= 2 * Math.PI;
                }
                
                orbitData.trueAnomaly = calculateTrueAnomaly(orbitData.meanAnomaly, orbitData.eccentricity);
                const distanceSim = calculateEllipticalDistance(
                    orbitData.semiMajorAxisSim,
                    orbitData.eccentricity,
                    orbitData.trueAnomaly
                );
                
                const baseDistance = orbitData.isMoon ? 0 : CONFIG.scale.sun;
                const newX = baseDistance + distanceSim * Math.cos(orbitData.trueAnomaly);
                const newZ = distanceSim * Math.sin(orbitData.trueAnomaly);
                
                // Debug: Log position changes for first planet (first few frames)
                if (time < 1.0 && mesh.userData?.name === 'Mercury') {
                    console.log('[Debug] Mercury position update:', {
                        time: orbitData.time.toFixed(3),
                        meanAnomaly: orbitData.meanAnomaly.toFixed(6),
                        trueAnomaly: orbitData.trueAnomaly.toFixed(6),
                        distanceSim: distanceSim.toFixed(2),
                        oldX: mesh.position.x.toFixed(2),
                        newX: newX.toFixed(2),
                        oldZ: mesh.position.z.toFixed(2),
                        newZ: newZ.toFixed(2)
                    });
                }
                
                mesh.position.x = newX;
                mesh.position.z = newZ;
                mesh.position.y = 0;
                
            } else if (item.type === 'rotate') {
                if (item.rotationPeriod !== undefined && item.rotationPeriod !== 0) {
                    const angularVel = calculateRotationAngularVelocity(item.rotationPeriod);
                    const direction = item.rotationPeriod < 0 ? -1 : 1;
                    item.obj.rotation.y += angularVel * direction * dt;
                } else {
                    item.obj.rotation.y += 0.2 * dt;
                }
            }
        });

        cometSystems.forEach(sys => sys.update(dt));

        if (sun) {
            sun.children[0].material.opacity = 0.8 + Math.sin(time * 3) * 0.1;
        }

        controls.update();
        if (selectedTarget.current) {
            const targetPos = new THREE.Vector3();
            selectedTarget.current.getWorldPosition(targetPos);
            
            if (updateDashboardRealTime) {
                updateDashboardRealTime(selectedTarget.current, sunPosition, dt);
            }

            controls.target.lerp(targetPos, 0.1);
        }

        renderer.render(scene, camera);
    }

    return animate;
}

