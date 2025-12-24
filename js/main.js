// App initialization and main loop (Entry Point)

// Error handling and loader removal functions (defined before imports)
function removeLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = 0;
        setTimeout(() => {
            if (loader.parentNode) {
                loader.remove();
            }
        }, 500);
    }
}

function showError(message) {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.innerHTML = `
            <div style="color: #ff4444; text-align: center;">
                <h2>Loading Error</h2>
                <p>${message}</p>
                <p style="font-size: 12px; margin-top: 20px; color: #aaa;">
                    A local server may be required when running from the local file system.<br>
                    Python: python -m http.server 8000<br>
                    Node.js: npx http-server
                </p>
            </div>
        `;
        setTimeout(removeLoader, 3000);
    }
}

// Module loading error handling
window.addEventListener('error', (event) => {
    if (event.target && event.target.tagName === 'SCRIPT' && event.target.type === 'module') {
        console.error('Module loading error:', event.error);
        showError(`Failed to load module: ${event.error?.message || 'Unknown error'}`);
    }
});

// Promise rejection handling (module loading failure)
window.addEventListener('unhandledrejection', (event) => {
    console.error('Promise rejection:', event.reason);
    if (event.reason && event.reason.message) {
        showError(`Module loading failed: ${event.reason.message}`);
    }
    event.preventDefault();
});

import * as THREE from 'three';
import { CONFIG } from './config.js';
import { PLANETS } from './data/planets.js';
import { DWARFS } from './data/dwarfs.js';
import { COMETS } from './data/comets.js';
import { createScene, createCamera, createRenderer, setupLighting, onResize } from './core/scene.js';
import { createControls, resetView, setTopView } from './core/controls.js';
import { createAnimationLoop } from './core/loop.js';
import { createStarField } from './objects/starField.js';
import { createSun } from './objects/sun.js';
import { createPlanetsAndDwarfs } from './objects/planetFactory.js';
import { createComets } from './objects/cometSystem.js';
import { setupPanel } from './ui/panel.js';
import { buildUI, highlightList } from './ui/planetList.js';
import { focusObject, closeDashboard, updateDashboardRealTime } from './ui/dashboard.js';

// ================= GLOBALS =================
let scene, camera, renderer, controls;
let sun;
const objects = [];
const updateables = [];
const cometSystems = [];
const selectedTarget = { current: null };

// ================= INIT =================
function init() {
    // 1. Scene
    scene = createScene();

    // 2. Camera
    camera = createCamera();

    // 3. Renderer
    renderer = createRenderer();

    // 4. Controls
    controls = createControls(camera, renderer);

    // 5. Lighting
    setupLighting(scene);

    // 6. Build World
    createStarField(scene);
    sun = createSun(scene, objects);
    createPlanetsAndDwarfs(scene, objects, updateables, PLANETS, DWARFS);
    createComets(scene, objects, cometSystems, COMETS);
    
    // Function to rebuild UI (for language changes)
    const rebuildUI = () => {
        buildUI(PLANETS, DWARFS, COMETS, (mesh) => {
            focusObject(mesh, controls, selectedTarget);
        }, highlightList);
    };
    
    buildUI(PLANETS, DWARFS, COMETS, (mesh) => {
        focusObject(mesh, controls, selectedTarget);
    }, highlightList);

    // 7. Event Listeners
    window.addEventListener('resize', () => onResize(camera, renderer));
    renderer.domElement.addEventListener('pointerdown', onMouseDown);
    
    const resetViewHandler = () => {
        closeDashboard(controls, selectedTarget);
        resetView(controls, camera);
    };
    const setTopViewHandler = () => {
        setTopView(controls, camera);
    };
    setupPanel(resetViewHandler, setTopViewHandler, rebuildUI);
    document.getElementById('dash-close').onclick = () => closeDashboard(controls, selectedTarget);

    // 8. Remove Loader
    setTimeout(() => {
        removeLoader();
    }, 800);

    // 9. Start Animation
    const animate = createAnimationLoop(scene, camera, renderer, controls, updateables, cometSystems, sun, selectedTarget, updateDashboardRealTime);
    animate();
}

function onMouseDown(e) {
    const mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
    );
    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
    const hits = ray.intersectObjects(objects);
    if (hits.length > 0) {
        focusObject(hits[0].object, controls, selectedTarget);
    } else {
        closeDashboard(controls, selectedTarget);
    }
}

// Start with error handling
try {
    init();
} catch (error) {
    console.error('Initialization error:', error);
    showError(`Error during initialization: ${error.message}`);
}

