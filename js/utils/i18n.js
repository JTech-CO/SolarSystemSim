// Translation data
const translations = {
    ko: {
        // Dashboard headers
        'dashboard.title': '행성 계기판',
        
        // Metric labels
        'metric.name': '행성명',
        'metric.distance': '현재 태양 거리',
        'metric.orbitalSpeed': '현재 공전 속도',
        'metric.mass': '질량',
        'metric.radius': '평균 반지름',
        'metric.surfaceGravity': '표면 중력가속도',
        'metric.solarGravity': '현재 태양 중력가속도',
        'metric.centrifugalAccel': '현재 원심가속도',
        'metric.orbitalPeriod': '공전 주기',
        'metric.rotationPeriod': '자전 주기',
        'metric.rotationAngularVel': '지전 각속도',
        'metric.rotationSpeed': '실시간 지전 속도',
        'metric.rotationAccel': '실시간 자전 가속도',
        
        // Units
        'unit.au': 'AU',
        'unit.ms': 'm/s',
        'unit.kg': 'kg',
        'unit.km': 'km',
        'unit.ms2': 'm/s²',
        'unit.rads': 'rad/s',
        'unit.rads2': 'rad/s²',
        
        // Planet list
        'list.planets': '행성',
        'list.dwarfPlanets': '왜소행성',
        'list.comets': '혜성',
        'list.viewAll': '전체 보기',
        
        // UI elements
        'ui.reset': 'Reset',
        'ui.topView': 'Top View',
        'ui.language': 'Language',
        'ui.korean': '한국어',
        'ui.english': 'English',
        'ui.speed': '속도',
        'ui.speedLabel': '속도'
    },
    en: {
        // Dashboard headers
        'dashboard.title': 'Planet Dashboard',
        
        // Metric labels
        'metric.name': 'Planet Name',
        'metric.distance': 'Current Distance to Sun',
        'metric.orbitalSpeed': 'Current Orbital Speed',
        'metric.mass': 'Mass',
        'metric.radius': 'Average Radius',
        'metric.surfaceGravity': 'Surface Gravity Acceleration',
        'metric.solarGravity': 'Current Solar Gravity Acceleration',
        'metric.centrifugalAccel': 'Current Centrifugal Acceleration',
        'metric.orbitalPeriod': 'Orbital Period',
        'metric.rotationPeriod': 'Rotation Period',
        'metric.rotationAngularVel': 'Rotational Angular Velocity',
        'metric.rotationSpeed': 'Real-time Rotational Speed',
        'metric.rotationAccel': 'Real-time Rotational Acceleration',
        
        // Units
        'unit.au': 'AU',
        'unit.ms': 'm/s',
        'unit.kg': 'kg',
        'unit.km': 'km',
        'unit.ms2': 'm/s²',
        'unit.rads': 'rad/s',
        'unit.rads2': 'rad/s²',
        
        // Planet list
        'list.planets': 'Planets',
        'list.dwarfPlanets': 'Dwarf Planets',
        'list.comets': 'Comets',
        'list.viewAll': 'View All',
        
        // UI elements
        'ui.reset': 'Reset',
        'ui.topView': 'Top View',
        'ui.language': 'Language',
        'ui.korean': '한국어',
        'ui.english': 'English',
        'ui.speed': 'Speed',
        'ui.speedLabel': 'Speed'
    }
};

let currentLanguage = 'ko';
const listeners = [];

/**
 * Get translation for a key
 * @param {string} key - Translation key
 * @returns {string} Translated text
 */
export function t(key) {
    return translations[currentLanguage][key] || key;
}

/**
 * Set current language
 * @param {string} lang - Language code ('ko' or 'en')
 */
export function setLanguage(lang) {
    if (lang === 'ko' || lang === 'en') {
        currentLanguage = lang;
        // Notify all listeners
        listeners.forEach(listener => listener());
    }
}

/**
 * Get current language
 * @returns {string} Current language code
 */
export function getLanguage() {
    return currentLanguage;
}

/**
 * Add language change listener
 * @param {Function} callback - Callback function to call on language change
 */
export function onLanguageChange(callback) {
    listeners.push(callback);
}

/**
 * Remove language change listener
 * @param {Function} callback - Callback function to remove
 */
export function offLanguageChange(callback) {
    const index = listeners.indexOf(callback);
    if (index > -1) {
        listeners.splice(index, 1);
    }
}

