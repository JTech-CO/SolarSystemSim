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

