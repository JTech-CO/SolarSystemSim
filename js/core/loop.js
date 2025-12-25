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

        updateables.forEach(item => {
            if (item.type === 'ellipticalOrbit') {
                const orbitData = item.obj.userData;
                const mesh = item.mesh;
                
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
                mesh.position.x = baseDistance + distanceSim * Math.cos(orbitData.trueAnomaly);
                mesh.position.z = distanceSim * Math.sin(orbitData.trueAnomaly);
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

