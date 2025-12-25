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
                
                // Update time
                orbitData.time += realDt;
                
                // Calculate mean anomaly
                if (orbitData.orbitalPeriod) {
                    orbitData.meanAnomaly = calculateMeanAnomaly(
                        orbitData.time,
                        orbitData.orbitalPeriod,
                        orbitData.initialMeanAnomaly
                    );
                } else {
                    // Fallback: use speed for circular approximation (for moons without orbitalPeriod)
                    // speed is relative, so we use a simple angular velocity approximation
                    const angularVel = orbitData.speed * 0.05; // Convert speed to angular velocity
                    orbitData.meanAnomaly = orbitData.initialMeanAnomaly + angularVel * orbitData.time;
                    // Normalize
                    while (orbitData.meanAnomaly < 0) orbitData.meanAnomaly += 2 * Math.PI;
                    while (orbitData.meanAnomaly >= 2 * Math.PI) orbitData.meanAnomaly -= 2 * Math.PI;
                }
                
                // Calculate true anomaly
                orbitData.trueAnomaly = calculateTrueAnomaly(orbitData.meanAnomaly, orbitData.eccentricity);
                
                // Calculate distance in simulation units
                const distanceSim = calculateEllipticalDistance(
                    orbitData.semiMajorAxisSim,
                    orbitData.eccentricity,
                    orbitData.trueAnomaly
                );
                
                // Calculate position (in orbital plane, z=0 initially)
                // Position relative to parent (sun or planet)
                const baseDistance = orbitData.isMoon ? 0 : CONFIG.scale.sun;
                mesh.position.x = baseDistance + distanceSim * Math.cos(orbitData.trueAnomaly);
                mesh.position.z = distanceSim * Math.sin(orbitData.trueAnomaly);
                mesh.position.y = 0;
                
            } else if (item.type === 'rotate') {
                // Apply planet-specific rotation speed
                if (item.rotationPeriod !== undefined && item.rotationPeriod !== 0) {
                    const angularVel = calculateRotationAngularVelocity(item.rotationPeriod);
                    // Determine rotation direction (negative for retrograde)
                    const direction = item.rotationPeriod < 0 ? -1 : 1;
                    item.obj.rotation.y += angularVel * direction * realDt;
                } else {
                    // Fallback: default rotation speed
                    item.obj.rotation.y += 0.2 * realDt;
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
            
            // Update dashboard with real-time metrics
            if (updateDashboardRealTime) {
                updateDashboardRealTime(selectedTarget.current, sunPosition, realDt);
            }

            controls.target.lerp(targetPos, 0.1);
        }

        renderer.render(scene, camera);
    }

    return animate;
}

