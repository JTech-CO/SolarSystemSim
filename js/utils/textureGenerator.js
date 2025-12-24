import * as THREE from 'three';

export function generateTexture(colors) {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, size, size);
    
    for (let i = 0; i < 300; i++) {
        const x = Math.random() * size, y = Math.random() * size, r = Math.random() * 25;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = colors[1];
        ctx.globalAlpha = 0.3;
        ctx.fill();
    }
    return new THREE.CanvasTexture(canvas);
}

export function generateGlowTexture() {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(64, 64, 10, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,200,100,0.4)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
}

