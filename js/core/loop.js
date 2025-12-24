import * as THREE from 'three';
import { CONFIG } from '../config.js';

export function createAnimationLoop(scene, camera, renderer, controls, updateables, cometSystems, sun, selectedTarget, updateDashboard) {
    const clock = new THREE.Clock();
    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        const dt = clock.getDelta();
        time += dt * CONFIG.speed;

        updateables.forEach(item => {
            if (item.type === 'orbit') {
                item.obj.rotation.y += item.obj.userData.speed * 0.05 * dt;
            } else if (item.type === 'rotate') {
                item.obj.rotation.y += 0.2 * dt;
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
            
            const dist = targetPos.distanceTo(new THREE.Vector3(0, 0, 0));
            updateDashboard('distance', (dist * 100000).toLocaleString() + " km");

            controls.target.lerp(targetPos, 0.1);
        }

        renderer.render(scene, camera);
    }

    return animate;
}

