export function focusObject(mesh, controls, selectedTarget) {
    if (!mesh) return;
    selectedTarget.current = mesh;
    
    const dash = document.getElementById('dashboard');
    const d = mesh.userData;
    dash.classList.remove('hidden');
    document.getElementById('dash-name').textContent = d.name;
    document.getElementById('val-type').textContent = d.type;
    document.getElementById('val-rad').textContent = (d.size ? (d.size * 6000).toFixed(0) : 'Unknown') + " km";
    document.getElementById('val-desc').textContent = d.desc || '';

    const targetRadius = mesh.geometry ? mesh.geometry.parameters.radius : 2;
    controls.minDistance = targetRadius * 2.5;
}

export function closeDashboard(controls, selectedTarget) {
    document.getElementById('dashboard').classList.add('hidden');
    selectedTarget.current = null;
    document.querySelectorAll('#planet-list li').forEach(li => li.classList.remove('active'));
    controls.minDistance = 5;
}

export function updateDashboard(field, value) {
    if (field === 'distance') {
        document.getElementById('val-dist').textContent = value;
    }
}

