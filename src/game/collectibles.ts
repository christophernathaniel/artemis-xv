// src/game/collectibles.ts
import type { Collectible, CollectibleType } from './types';
import {
    HELIUM3_COUNT, SOLAR_COUNT, COLLECTIBLE_RADIUS,
    WORLD_WIDTH, WORLD_HEIGHT
} from './constants';

function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

let collectibleIdCounter = 4000;

export function spawnCollectibles(): Collectible[] {
    const items: Collectible[] = [];

    for (let i = 0; i < HELIUM3_COUNT; i++) {
        items.push(createCollectible('helium3'));
    }
    for (let i = 0; i < SOLAR_COUNT; i++) {
        items.push(createCollectible('solar'));
    }

    return items;
}

export function createCollectible(type: CollectibleType): Collectible {
    return {
        id: collectibleIdCounter++,
        type,
        pos: { x: rand(100, WORLD_WIDTH - 100), y: rand(100, WORLD_HEIGHT - 100) },
        radius: COLLECTIBLE_RADIUS,
        bobOffset: Math.random() * Math.PI * 2, // Different phase so they don't all bob together
        rotation: 0,
    };
}

export function updateCollectibles(collectibles: Collectible[], dt: number): void {
    for (const c of collectibles) {
        c.rotation += dt * (c.type === 'solar' ? 1.5 : 0.5);
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// drawCollectible
// Helium-3: glowing blue orb (helium is a noble gas, cryogenic blue)
// Solar Energy: golden rotating star/diamond (captures sunlight feel)
// ─────────────────────────────────────────────────────────────────────────────
export function drawCollectible(
    ctx: CanvasRenderingContext2D,
    c: Collectible,
    screenX: number,
    screenY: number,
    time: number
): void {
    // Bob up and down — creates a "floating" feel
    const bob = Math.sin(time * 2 + c.bobOffset) * 4;

    ctx.save();
    ctx.translate(screenX, screenY + bob);
    ctx.rotate(c.rotation);

    if (c.type === 'helium3') {
        // ── HELIUM-3: Blue orb ───────────────────────────────────────────────
        const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, c.radius * 2);
        glow.addColorStop(0, 'rgba(100, 200, 255, 0.6)');
        glow.addColorStop(1, 'rgba(0, 100, 255, 0)');
        ctx.beginPath();
        ctx.arc(0, 0, c.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        const sphere = ctx.createRadialGradient(-c.radius * 0.3, -c.radius * 0.3, 1, 0, 0, c.radius);
        sphere.addColorStop(0, '#e0f7ff');
        sphere.addColorStop(0.4, '#38bdf8');
        sphere.addColorStop(1, '#0c4a6e');
        ctx.beginPath();
        ctx.arc(0, 0, c.radius, 0, Math.PI * 2);
        ctx.fillStyle = sphere;
        ctx.fill();

        // Label
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.font = `bold ${c.radius * 0.8}px Courier New`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('He³', 0, 0);

    } else {
        // ── SOLAR ENERGY: Golden star ─────────────────────────────────────────
        const points = 6;
        const outerR = c.radius;
        const innerR = c.radius * 0.5;

        const starGlow = ctx.createRadialGradient(0, 0, 0, 0, 0, outerR * 2.5);
        starGlow.addColorStop(0, 'rgba(255, 220, 50, 0.5)');
        starGlow.addColorStop(1, 'rgba(255, 150, 0, 0)');
        ctx.beginPath();
        ctx.arc(0, 0, outerR * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = starGlow;
        ctx.fill();

        ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const r = i % 2 === 0 ? outerR : innerR;
            const x = Math.cos(angle) * r;
            const y = Math.sin(angle) * r;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.closePath();
        ctx.fillStyle = '#fbbf24';
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    ctx.restore();
}