import * as THREE from 'three';
import { CONFIG } from '../config.js';

export function createComets(scene, objects, cometSystems, comets) {
    comets.forEach(data => {
        const geo = new THREE.SphereGeometry(data.size * CONFIG.scale.planet, 16, 16);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geo, mat);
        
        const tailGeo = new THREE.ConeGeometry(0.5, 10, 8);
        const tailMat = new THREE.MeshBasicMaterial({ color: 0x88ccff, transparent: true, opacity: 0.5 });
        const tail = new THREE.Mesh(tailGeo, tailMat);
        tail.rotation.x = Math.PI / 2;
        tail.position.z = -5;
        mesh.add(tail);
        
        scene.add(mesh);
        objects.push(mesh);

        mesh.userData = { ...data, isBody: true };

        const controller = {
            mesh: mesh,
            data: data,
            active: true,
            timer: 0,
            tParam: -50,
            uiElement: null,
            
            update: function(dt) {
                if (!this.active) {
                    this.timer += dt;
                    if (this.uiElement) this.uiElement.textContent = `Respawning in ${(30 - this.timer).toFixed(0)}s`;
                    if (this.timer >= 30) {
                        this.active = true;
                        this.tParam = -80; // 시작점 리셋
                        this.mesh.visible = true;
                        if (this.uiElement) {
                            this.uiElement.textContent = "ACTIVE";
                            this.uiElement.className = "comet-status comet-active";
                        }
                    }
                    return;
                }

                this.tParam += dt * data.speed * 5;
                
                const scale = 10;
                const x = this.tParam * scale;
                const z = (Math.pow(this.tParam, 2) / (15 * data.eccentricity)) * scale - data.perihelion * 5;
                
                this.mesh.position.set(x, 0, z);
                this.mesh.lookAt(0, 0, 0);

                if (this.tParam > 80) {
                    this.active = false;
                    this.timer = 0;
                    this.mesh.visible = false;
                    if (this.uiElement) {
                        this.uiElement.textContent = "WAIT (30s)";
                        this.uiElement.className = "comet-status comet-wait";
                    }
                }
            }
        };
        cometSystems.push(controller);
        data.controllerRef = controller;
    });
}

