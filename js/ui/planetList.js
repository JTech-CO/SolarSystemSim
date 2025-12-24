import { t } from '../utils/i18n.js';

export function buildUI(planets, dwarfs, comets, focusObject, highlightList) {
    const list = document.getElementById('planet-list');
    
    // Clear existing content
    list.innerHTML = '';
    
    addCategory(list, t('list.planets'), planets, false, focusObject, highlightList);
    addCategory(list, t('list.dwarfPlanets'), dwarfs, false, focusObject, highlightList);
    addCategory(list, t('list.comets'), comets, true, focusObject, highlightList);
}

function addCategory(parent, title, items, isComet, focusObject, highlightList) {
    const h = document.createElement('div');
    h.className = 'category-header';
    h.textContent = title;
    parent.appendChild(h);

    const ul = document.createElement('ul');
    items.forEach(item => {
        const li = document.createElement('li');
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = item.name;
        li.appendChild(nameSpan);

        if (isComet && item.controllerRef) {
            const badge = document.createElement('span');
            badge.className = 'comet-status comet-active';
            badge.textContent = 'ACTIVE';
            item.controllerRef.uiElement = badge;
            li.appendChild(badge);
        }

        li.onclick = (e) => {
            e.stopPropagation();
            const target = isComet ? item.controllerRef.mesh : item.meshRef;
            focusObject(target);
            highlightList(li);
        };
        ul.appendChild(li);

        if (item.moons && item.moons.length > 0) {
            item.moons.forEach(moon => {
                const mLi = document.createElement('li');
                mLi.className = 'moon-item';
                mLi.textContent = moon.name;
                mLi.onclick = (e) => {
                    e.stopPropagation();
                    focusObject(moon.meshRef);
                    highlightList(mLi);
                };
                ul.appendChild(mLi);
            });
        }
    });
    parent.appendChild(ul);
}

export function highlightList(activeLi) {
    document.querySelectorAll('#planet-list li').forEach(li => li.classList.remove('active'));
    activeLi.classList.add('active');
}

