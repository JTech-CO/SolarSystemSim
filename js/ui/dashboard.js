import * as THREE from 'three';
import { CONFIG } from '../config.js';
import {
    calculateOrbitalVelocity,
    calculateOrbitalVelocityElliptical,
    calculateGravitationalAcceleration,
    calculateCentrifugalAcceleration,
    calculateRotationAngularVelocity,
    calculateEllipticalDistance,
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
let previousRotation = 0;
let previousAngularVelocity = 0;
let lastUpdateTime = 0;

export function focusObject(mesh, controls, selectedTarget) {
    if (!mesh) return;
    selectedTarget.current = mesh;
    currentMesh = mesh;
    
    // Reset rotation tracking
    previousRotation = mesh.rotation.y;
    previousAngularVelocity = 0;
    lastUpdateTime = 0;
    
    const dash = document.getElementById('dashboard');
    const d = mesh.userData;
    dash.classList.remove('hidden');
    
    // Update labels
    updateLabels();
    
    // Calculate and display all metrics (initial calculation, dt=0)
    calculateAllMetrics(mesh, sunPosition, 0);
    
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
export function calculateAllMetrics(mesh, sunPos, dt = 0) {
    if (!mesh || !mesh.userData) return;
    
    const data = mesh.userData;
    const lang = getLanguage();
    
    // Get world position
    const worldPos = new THREE.Vector3();
    mesh.getWorldPosition(worldPos);
    
    // Calculate distance to sun in simulation units
    const distanceSimUnits = worldPos.distanceTo(sunPos);
    
    // Use elliptical orbit data if available
    let realDistanceAU;
    let realDistanceMeters;
    let orbitalVel;
    
    if (data.pivot && data.pivot.userData.type === 'ellipticalOrbit') {
        // Elliptical orbit: use stored orbital parameters
        const orbitData = data.pivot.userData;
        if (orbitData.semiMajorAxisAU) {
            // Calculate distance from true anomaly
            const trueAnomaly = orbitData.trueAnomaly || 0;
            realDistanceMeters = calculateEllipticalDistance(
                orbitData.semiMajorAxisMeters,
                orbitData.eccentricity,
                trueAnomaly
            );
            realDistanceAU = realDistanceMeters / AU;
            
            // Calculate orbital velocity using vis-viva equation
            orbitalVel = calculateOrbitalVelocityElliptical(
                realDistanceMeters,
                orbitData.semiMajorAxisMeters
            );
        } else {
            // Fallback for moons
            realDistanceAU = Math.max(0.01, distanceSimUnits / CONFIG.scale.orbit);
            realDistanceMeters = realDistanceAU * AU;
            orbitalVel = calculateOrbitalVelocity(realDistanceMeters);
        }
    } else if (data.orbit !== undefined && data.orbit !== null) {
        // Planets and dwarfs: use the formula based on pivot structure
        realDistanceAU = Math.max(0.01, (distanceSimUnits - CONFIG.scale.sun) / CONFIG.scale.orbit);
        realDistanceMeters = realDistanceAU * AU;
        orbitalVel = calculateOrbitalVelocity(realDistanceMeters);
    } else {
        // Comets and other objects: direct distance conversion
        const simUnitsPerAU = CONFIG.scale.orbit || 80;
        realDistanceAU = Math.max(0.01, distanceSimUnits / simUnitsPerAU);
        realDistanceMeters = realDistanceAU * AU;
        orbitalVel = calculateOrbitalVelocity(realDistanceMeters);
    }
    
    // Planet name
    document.getElementById('val-name').textContent = data.name || '-';
    
    // Distance to sun (AU)
    document.getElementById('val-distance').textContent = 
        `${realDistanceAU.toFixed(3)} ${t('unit.au')}`;
    
    // Orbital velocity (m/s)
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
    
    // Real-time rotational speed (rad/s) - calculate from actual mesh rotation
    let realtimeAngularVel = 0;
    let realtimeAngularAccel = 0;
    
    if (dt > 0) {
        const currentRotation = mesh.rotation.y;
        const currentTime = Date.now() / 1000; // in seconds
        
        // Handle rotation wrap-around (0 to 2π)
        let deltaRotation = currentRotation - previousRotation;
        if (deltaRotation > Math.PI) deltaRotation -= 2 * Math.PI;
        if (deltaRotation < -Math.PI) deltaRotation += 2 * Math.PI;
        
        // Calculate angular velocity
        realtimeAngularVel = deltaRotation / dt;
        
        // Calculate angular acceleration
        if (lastUpdateTime > 0 && dt > 0) {
            const prevAngularVel = previousAngularVelocity;
            realtimeAngularAccel = (realtimeAngularVel - prevAngularVel) / dt;
        }
        
        // Update stored values
        previousRotation = currentRotation;
        previousAngularVelocity = realtimeAngularVel;
        lastUpdateTime = currentTime;
    } else {
        // First frame: use theoretical value
        if (data.rotationPeriod !== undefined && data.rotationPeriod !== 0) {
            const direction = data.rotationPeriod < 0 ? -1 : 1;
            realtimeAngularVel = calculateRotationAngularVelocity(data.rotationPeriod) * direction;
            previousRotation = mesh.rotation.y;
            previousAngularVelocity = realtimeAngularVel;
        }
    }
    
    document.getElementById('val-rotation-speed').textContent = 
        `${realtimeAngularVel.toFixed(3)} ${t('unit.rads')}`;
    
    // Real-time rotational acceleration (rad/s²)
    document.getElementById('val-rotation-accel').textContent = 
        `${realtimeAngularAccel.toFixed(6)} ${t('unit.rads2')}`;
}

/**
 * Update dashboard in real-time (called from animation loop)
 */
export function updateDashboardRealTime(mesh, sunPos, dt) {
    if (mesh && mesh === currentMesh) {
        calculateAllMetrics(mesh, sunPos, dt);
    }
}

/**
 * Update labels when language changes
 */
export function refreshDashboard() {
    updateLabels();
    if (currentMesh) {
        calculateAllMetrics(currentMesh, sunPosition, 0);
    }
}
