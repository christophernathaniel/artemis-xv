// Add to src/game/collision.ts or create src/game/popups.ts

import type { ScorePopup } from './types';

export function updateScorePopups(popups: ScorePopup[], dt: number): ScorePopup[] {
    return popups
        .map(p => ({ ...p, lifetime: p.lifetime - dt, pos: { ...p.pos, y: p.pos.y - 30 * dt } }))
        .filter(p => p.lifetime > 0);
}

export function drawScorePopup(
    ctx: CanvasRenderingContext2D,
    popup: ScorePopup,
    screenX: number,
    screenY: number
): void {
    const alpha = popup.lifetime / popup.maxLifetime;
    const scale = 0.5 + (1 - popup.lifetime / popup.maxLifetime) * 0.5; // Grows as it fades

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.scale(scale, scale);
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = popup.value >= 25 ? '#fbbf24' : '#7dd3fc';
    ctx.fillText(`+${popup.value}`, 0, 0);
    ctx.restore();
}