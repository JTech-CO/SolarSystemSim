import { setLanguage, getLanguage, onLanguageChange } from '../utils/i18n.js';
import { refreshDashboard } from './dashboard.js';

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
            refreshDashboard();
            if (rebuildUIFn) {
                rebuildUIFn();
            }
        };
    }
}

function updateLangButton() {
    const langBtn = document.getElementById('btn-lang');
    if (langBtn) {
        langBtn.textContent = getLanguage() === 'ko' ? '한/EN' : 'KO/영';
    }
}

