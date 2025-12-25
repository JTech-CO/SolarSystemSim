// Physics constants
export const G = 6.67430e-11; // Gravitational constant (m³/kg/s²)
export const SUN_MASS = 1.9891e30; // kg
export const AU = 1.496e11; // meters (1 Astronomical Unit)

/**
 * Calculate orbital velocity using v = sqrt(GM/r)
 * @param {number} distance - Distance from sun in meters
 * @returns {number} Orbital velocity in m/s
 */
export function calculateOrbitalVelocity(distance) {
    if (distance <= 0) return 0;
    return Math.sqrt(G * SUN_MASS / distance);
}

/**
 * Calculate gravitational acceleration due to Sun
 * @param {number} distance - Distance from sun in meters
 * @returns {number} Gravitational acceleration in m/s²
 */
export function calculateGravitationalAcceleration(distance) {
    if (distance <= 0) return 0;
    return G * SUN_MASS / (distance * distance);
}

/**
 * Calculate centrifugal acceleration
 * @param {number} orbitalVelocity - Orbital velocity in m/s
 * @param {number} distance - Distance from sun in meters
 * @returns {number} Centrifugal acceleration in m/s²
 */
export function calculateCentrifugalAcceleration(orbitalVelocity, distance) {
    if (distance <= 0) return 0;
    return (orbitalVelocity * orbitalVelocity) / distance;
}

/**
 * Calculate rotational angular velocity
 * @param {number} rotationPeriod - Rotation period in hours
 * @returns {number} Angular velocity in rad/s
 */
export function calculateRotationAngularVelocity(rotationPeriod) {
    if (rotationPeriod === 0) return 0;
    const periodSeconds = Math.abs(rotationPeriod) * 3600; // Convert hours to seconds
    return (2 * Math.PI) / periodSeconds;
}

/**
 * Format period from days to years, days, hours format
 * @param {number} days - Period in days
 * @returns {string} Formatted string like "0년 365일 5시간"
 */
export function formatPeriod(days) {
    const years = Math.floor(days / 365.25);
    const remainingDays = days - (years * 365.25);
    const daysPart = Math.floor(remainingDays);
    const hoursPart = Math.floor((remainingDays - daysPart) * 24);
    
    return `${years}년 ${daysPart}일 ${hoursPart}시간`;
}

/**
 * Format period from days to English format
 * @param {number} days - Period in days
 * @returns {string} Formatted string like "0yr 365d 5h"
 */
export function formatPeriodEnglish(days) {
    const years = Math.floor(days / 365.25);
    const remainingDays = days - (years * 365.25);
    const daysPart = Math.floor(remainingDays);
    const hoursPart = Math.floor((remainingDays - daysPart) * 24);
    
    return `${years}yr ${daysPart}d ${hoursPart}h`;
}

/**
 * Format rotation period from hours
 * @param {number} hours - Rotation period in hours
 * @returns {string} Formatted string like "23시간 56분"
 */
export function formatRotationPeriod(hours) {
    const absHours = Math.abs(hours);
    const hoursPart = Math.floor(absHours);
    const minutesPart = Math.floor((absHours - hoursPart) * 60);
    
    return `${hoursPart}시간 ${minutesPart}분`;
}

/**
 * Format rotation period from hours (English)
 * @param {number} hours - Rotation period in hours
 * @returns {string} Formatted string like "23h 56m"
 */
export function formatRotationPeriodEnglish(hours) {
    const absHours = Math.abs(hours);
    const hoursPart = Math.floor(absHours);
    const minutesPart = Math.floor((absHours - hoursPart) * 60);
    
    return `${hoursPart}h ${minutesPart}m`;
}

/**
 * Convert distance in simulation units to meters
 * @param {number} simDistance - Distance in simulation units
 * @returns {number} Distance in meters
 */
export function simDistanceToMeters(simDistance) {
    // CONFIG.scale.orbit represents AU scale
    // We need to approximate: orbit value * AU scale factor
    // For simplicity, we'll use a conversion factor
    // This should be adjusted based on actual CONFIG values
    return simDistance * 1e9; // Approximate conversion
}

/**
 * Convert meters to AU (Astronomical Units)
 * @param {number} meters - Distance in meters
 * @returns {number} Distance in AU
 */
export function metersToAU(meters) {
    return meters / AU;
}

/**
 * Calculate distance in elliptical orbit using true anomaly
 * @param {number} semiMajorAxis - Semi-major axis in meters
 * @param {number} eccentricity - Orbital eccentricity (0-1)
 * @param {number} trueAnomaly - True anomaly in radians
 * @returns {number} Distance from focus in meters
 */
export function calculateEllipticalDistance(semiMajorAxis, eccentricity, trueAnomaly) {
    if (eccentricity === 0) {
        // Circular orbit
        return semiMajorAxis;
    }
    return semiMajorAxis * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(trueAnomaly));
}

/**
 * Calculate orbital velocity in elliptical orbit using vis-viva equation
 * @param {number} distance - Current distance from focus in meters
 * @param {number} semiMajorAxis - Semi-major axis in meters
 * @param {number} centralMass - Mass of central body in kg (default: SUN_MASS)
 * @returns {number} Orbital velocity in m/s
 */
export function calculateOrbitalVelocityElliptical(distance, semiMajorAxis, centralMass = SUN_MASS) {
    if (distance <= 0 || semiMajorAxis <= 0) return 0;
    if (semiMajorAxis === distance && semiMajorAxis > 0) {
        // Circular orbit case
        return Math.sqrt(G * centralMass / distance);
    }
    // Vis-viva equation: v = sqrt(GM(2/r - 1/a))
    return Math.sqrt(G * centralMass * (2 / distance - 1 / semiMajorAxis));
}

/**
 * Solve Kepler's equation to find eccentric anomaly from mean anomaly
 * Uses Newton's method for iterative solution
 * @param {number} meanAnomaly - Mean anomaly in radians
 * @param {number} eccentricity - Orbital eccentricity (0-1)
 * @param {number} tolerance - Convergence tolerance (default: 1e-10)
 * @param {number} maxIterations - Maximum iterations (default: 50)
 * @returns {number} Eccentric anomaly in radians
 */
export function solveKeplerEquation(meanAnomaly, eccentricity, tolerance = 1e-10, maxIterations = 50) {
    if (eccentricity === 0) {
        // Circular orbit
        return meanAnomaly;
    }
    
    // Initial guess: E = M for small e, or M + e*sin(M) for larger e
    let E = meanAnomaly;
    if (eccentricity > 0.8) {
        E = Math.PI;
    } else {
        E = meanAnomaly + eccentricity * Math.sin(meanAnomaly);
    }
    
    for (let i = 0; i < maxIterations; i++) {
        const f = E - eccentricity * Math.sin(E) - meanAnomaly;
        const fPrime = 1 - eccentricity * Math.cos(E);
        
        if (Math.abs(fPrime) < tolerance) break;
        
        const deltaE = f / fPrime;
        E -= deltaE;
        
        if (Math.abs(deltaE) < tolerance) break;
    }
    
    return E;
}

/**
 * Calculate true anomaly from mean anomaly
 * @param {number} meanAnomaly - Mean anomaly in radians
 * @param {number} eccentricity - Orbital eccentricity (0-1)
 * @returns {number} True anomaly in radians
 */
export function calculateTrueAnomaly(meanAnomaly, eccentricity) {
    if (eccentricity === 0) {
        // Circular orbit
        return meanAnomaly;
    }
    
    const E = solveKeplerEquation(meanAnomaly, eccentricity);
    
    // Convert eccentric anomaly to true anomaly
    // tan(ν/2) = sqrt((1+e)/(1-e)) * tan(E/2)
    const tanNu2 = Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(E / 2);
    let trueAnomaly = 2 * Math.atan(tanNu2);
    
    // Ensure true anomaly is in [0, 2π]
    if (trueAnomaly < 0) trueAnomaly += 2 * Math.PI;
    if (trueAnomaly >= 2 * Math.PI) trueAnomaly -= 2 * Math.PI;
    
    return trueAnomaly;
}

/**
 * Calculate mean anomaly from time
 * @param {number} time - Time in seconds since periapsis
 * @param {number} orbitalPeriod - Orbital period in days
 * @param {number} initialMeanAnomaly - Initial mean anomaly in radians (default: 0)
 * @returns {number} Mean anomaly in radians
 */
export function calculateMeanAnomaly(time, orbitalPeriod, initialMeanAnomaly = 0) {
    const periodSeconds = orbitalPeriod * 24 * 3600; // Convert days to seconds
    const meanMotion = (2 * Math.PI) / periodSeconds; // radians per second
    const meanAnomaly = initialMeanAnomaly + meanMotion * time;
    
    // Normalize to [0, 2π]
    return meanAnomaly % (2 * Math.PI);
}

