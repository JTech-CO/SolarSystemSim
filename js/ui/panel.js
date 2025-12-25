import { setLanguage, getLanguage, onLanguageChange, t } from '../utils/i18n.js';
import { refreshDashboard } from './dashboard.js';
import { CONFIG } from '../config.js';

let rebuildUIFn = null;

export function setupPanel(resetView, setTopView, rebuildUI) {
    document.getElementById('btn-reset').onclick = resetView;
    document.getElementById('btn-top').onclick = setTopView;
    
    rebuildUIFn = rebuildUI;
    
    // Language toggle button
    const langBtn = document.getElementById('btn-lang');
    if (langBtn) {
        updateLangButton();
        langBtn.onclick = () => {
            const currentLang = getLanguage();
            const newLang = currentLang === 'ko' ? 'en' : 'ko';
            setLanguage(newLang);
            updateLangButton();
            updateSpeedLabels();
            refreshDashboard();
            if (rebuildUIFn) {
                rebuildUIFn();
            }
        };
    }
    
    // Speed control buttons
    setupSpeedControls();
    updateSpeedLabels();
}

function setupSpeedControls() {
    const speedButtons = document.querySelectorAll('.speed-btn');
    speedButtons.forEach(btn => {
        btn.onclick = () => {
            const speed = parseFloat(btn.dataset.speed);
            CONFIG.timeMultiplier = speed;
            
            // Update active state
            speedButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update speed value display
            updateSpeedValue();
        };
    });
}

function updateSpeedValue() {
    const speedValue = document.getElementById('speed-value');
    if (speedValue) {
        if (CONFIG.timeMultiplier === 0) {
            speedValue.textContent = getLanguage() === 'ko' ? '일시정지' : 'Paused';
        } else {
            speedValue.textContent = `${CONFIG.timeMultiplier}x`;
        }
    }
}

function updateSpeedLabels() {
    const speedLabel = document.getElementById('speed-label');
    if (speedLabel) {
        speedLabel.innerHTML = `${t('ui.speedLabel')}: <span id="speed-value">${CONFIG.timeMultiplier}x</span>`;
        updateSpeedValue();
    }
}

function updateLangButton() {
    const langBtn = document.getElementById('btn-lang');
    if (langBtn) {
        langBtn.textContent = getLanguage() === 'ko' ? '한/EN' : 'KO/영';
    }
}

