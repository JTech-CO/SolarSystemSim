import * as THREE from 'three';
import { CONFIG } from '../config.js';
import {
    calculateOrbitalVelocity,
    calculateGravitationalAcceleration,
    calculateCentrifugalAcceleration,
    calculateRotationAngularVelocity,
    formatPeriod,
    formatPeriodEnglish,
    formatRotationPeriod,
    formatRotationPeriodEnglish,
    metersToAU,
    AU
} from '../utils/physics.js';
import { t, getLanguage } from '../utils/i18n.js';

let currentMesh = null;
let sunPosition = new THREE.Vector3(0, 0, 0);

/**
 * Set sun position for calculations
 * @param {THREE.Vector3} pos - Sun position
 */
export function setSunPosition(pos) {
    sunPosition.copy(pos);
}

export function focusObject(mesh, controls, selectedTarget) {
    if (!mesh) return;
    selectedTarget.current = mesh;
    currentMesh = mesh;
    
    const dash = document.getElementById('dashboard');
    const d = mesh.userData;
    dash.classList.remove('hidden');
    
    // Update labels
    updateLabels();
    
    // Calculate and display all metrics
    calculateAllMetrics(mesh, sunPosition);
    
    // Update description
    document.getElementById('val-desc').textContent = d.desc || '';
    
    const targetRadius = mesh.geometry ? mesh.geometry.parameters.radius : 2;
    controls.minDistance = targetRadius * 2.5;
}

export function closeDashboard(controls, selectedTarget) {
    document.getElementById('dashboard').classList.add('hidden');
    selectedTarget.current = null;
    currentMesh = null;
    document.querySelectorAll('#planet-list li').forEach(li => li.classList.remove('active'));
    controls.minDistance = 5;
}

/**
 * Update all metric labels based on current language
 */
function updateLabels() {
    document.getElementById('dash-title').textContent = t('dashboard.title');
    document.getElementById('label-name').textContent = t('metric.name');
    document.getElementById('label-distance').textContent = t('metric.distance');
    document.getElementById('label-orbital-speed').textContent = t('metric.orbitalSpeed');
    document.getElementById('label-mass').textContent = t('metric.mass');
    document.getElementById('label-radius').textContent = t('metric.radius');
    document.getElementById('label-surface-gravity').textContent = t('metric.surfaceGravity');
    document.getElementById('label-solar-gravity').textContent = t('metric.solarGravity');
    document.getElementById('label-centrifugal-accel').textContent = t('metric.centrifugalAccel');
    document.getElementById('label-orbital-period').textContent = t('metric.orbitalPeriod');
    document.getElementById('label-rotation-period').textContent = t('metric.rotationPeriod');
    document.getElementById('label-rotation-angular-vel').textContent = t('metric.rotationAngularVel');
    document.getElementById('label-rotation-speed').textContent = t('metric.rotationSpeed');
    document.getElementById('label-rotation-accel').textContent = t('metric.rotationAccel');
}

/**
 * Calculate and display all metrics for the selected object
 */
export function calculateAllMetrics(mesh, sunPos) {
    if (!mesh || !mesh.userData) return;
    
    const data = mesh.userData;
    const lang = getLanguage();
    
    // Get world position
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);
    
    // Calculate distance to sun in simulation units
    const distanceSimUnits = worldPos.distanceTo(sunPos);
    
    // Convert simulation units to real AU
    // For planets: orbitRad = data.orbit * CONFIG.scale.orbit + CONFIG.scale.sun
    // So: realDistanceAU = (distanceSimUnits - CONFIG.scale.sun) / CONFIG.scale.orbit
    // For comets: they use direct position, so we use a different conversion
    let realDistanceAU;
    if (data.orbit !== undefined && data.orbit !== null) {
        // Planets and dwarfs: use the formula based on pivot structure
        realDistanceAU = Math.max(0.01, (distanceSimUnits - CONFIG.scale.sun) / CONFIG.scale.orbit);
    } else {
        // Comets and other objects: direct distance conversion (approx scale 10 per AU based on comet code)
        // Comets use scale = 10, and perihelion * 5 for distance
        // Approximate conversion: 1 sim unit ≈ 0.1 AU (rough estimate)
        const simUnitsPerAU = CONFIG.scale.orbit || 80;
        realDistanceAU = Math.max(0.01, distanceSimUnits / simUnitsPerAU);
    }
    const realDistanceMeters = realDistanceAU * AU;
    
    // Planet name
    document.getElementById('val-name').textContent = data.name || '-';
    
    // Distance to sun (AU)
    document.getElementById('val-distance').textContent = 
        `${realDistanceAU.toFixed(3)} ${t('unit.au')}`;
    
    // Orbital velocity (m/s)
    const orbitalVel = calculateOrbitalVelocity(realDistanceMeters);
    document.getElementById('val-orbital-speed').textContent = 
        `${orbitalVel.toFixed(1)} ${t('unit.ms')}`;
    
    // Mass (kg)
    if (data.mass) {
        document.getElementById('val-mass').textContent = 
            `${data.mass.toExponential(3)} ${t('unit.kg')}`;
    } else {
        document.getElementById('val-mass').textContent = '-';
    }
    
    // Radius (km)
    if (data.radius) {
        document.getElementById('val-radius').textContent = 
            `${data.radius.toFixed(1)} ${t('unit.km')}`;
    } else {
        document.getElementById('val-radius').textContent = '-';
    }
    
    // Surface gravity (m/s²)
    if (data.surfaceGravity !== undefined) {
        document.getElementById('val-surface-gravity').textContent = 
            `${data.surfaceGravity.toFixed(2)} ${t('unit.ms2')}`;
    } else {
        document.getElementById('val-surface-gravity').textContent = '-';
    }
    
    // Solar gravitational acceleration (m/s²)
    const solarGravity = calculateGravitationalAcceleration(realDistanceMeters);
    document.getElementById('val-solar-gravity').textContent = 
        `${solarGravity.toExponential(2)} ${t('unit.ms2')}`;
    
    // Centrifugal acceleration (m/s²)
    const centrifugalAccel = calculateCentrifugalAcceleration(orbitalVel, realDistanceMeters);
    document.getElementById('val-centrifugal-accel').textContent = 
        `${centrifugalAccel.toExponential(2)} ${t('unit.ms2')}`;
    
    // Orbital period
    if (data.orbitalPeriod) {
        const periodStr = lang === 'ko' 
            ? formatPeriod(data.orbitalPeriod)
            : formatPeriodEnglish(data.orbitalPeriod);
        document.getElementById('val-orbital-period').textContent = periodStr;
    } else {
        document.getElementById('val-orbital-period').textContent = '-';
    }
    
    // Rotation period
    if (data.rotationPeriod !== undefined) {
        const rotPeriodStr = lang === 'ko'
            ? formatRotationPeriod(data.rotationPeriod)
            : formatRotationPeriodEnglish(data.rotationPeriod);
        document.getElementById('val-rotation-period').textContent = rotPeriodStr;
    } else {
        document.getElementById('val-rotation-period').textContent = '-';
    }
    
    // Rotational angular velocity (rad/s)
    if (data.rotationPeriod !== undefined && data.rotationPeriod !== 0) {
        const angularVel = calculateRotationAngularVelocity(data.rotationPeriod);
        document.getElementById('val-rotation-angular-vel').textContent = 
            `${angularVel.toExponential(3)} ${t('unit.rads')}`;
    } else {
        document.getElementById('val-rotation-angular-vel').textContent = '-';
    }
    
    // Real-time rotational speed (rad/s) - same as angular velocity for now
    if (data.rotationPeriod !== undefined && data.rotationPeriod !== 0) {
        const angularVel = calculateRotationAngularVelocity(data.rotationPeriod);
        document.getElementById('val-rotation-speed').textContent = 
            `${angularVel.toFixed(3)} ${t('unit.rads')}`;
    } else {
        document.getElementById('val-rotation-speed').textContent = '-';
    }
    
    // Real-time rotational acceleration (rad/s²) - simplified to 0 for constant rotation
    // In reality, this would be calculated based on angular velocity changes
    document.getElementById('val-rotation-accel').textContent = 
        `0.000 ${t('unit.rads2')}`;
}

/**
 * Update dashboard in real-time (called from animation loop)
 */
export function updateDashboardRealTime(mesh, sunPos) {
    if (mesh && mesh === currentMesh) {
        calculateAllMetrics(mesh, sunPos);
    }
}

/**
 * Update labels when language changes
 */
export function refreshDashboard() {
    updateLabels();
    if (currentMesh) {
        calculateAllMetrics(currentMesh, sunPosition);
    }
}
