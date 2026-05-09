// src/game/powerups.ts
import type { PowerUp, PowerUpType, Player, GameState } from './types';
import {
    POWERUP_COUNT, POWERUP_RADIUS, WORLD_WIDTH, WORLD_HEIGHT,
    RAPID_FIRE_DURATION, INVINCIBILITY_DURATION, PLAYER_INVINCIBLE_DURATION,
    PLAYER_MAX_SHIELD
} from './constants';

function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

const POWERUP_TYPES: PowerUpType[] = ['shield_restore', 'rapid_fire', 'invincibility'];
let powerupIdCounter = 6000;

export function spawnPowerUps(): PowerUp[] {
    return Array.from({ length: POWERUP_COUNT }, (): PowerUp => ({
        id: powerupIdCounter++,
        type: POWERUP_TYPES[Math.floor(Math.random() * POWERUP_TYPES.length)],
        pos: { x: rand(100, WORLD_WIDTH - 100), y: rand(100, WORLD_HEIGHT - 100) },
        radius: POWERUP_RADIUS,
        pulsePhase: Math.random() * Math.PI * 2,
    }));
}


export function activatePowerUp(state: GameState): void {
    const { player, powerUps } = state;
    const ACTIVATION_RANGE = 120; // Player must be close to use it

    // Find closest power-up within range
    let closestDist = Infinity;
    let closestIdx = -1;

    for (let i = 0; i < powerUps.length; i++) {
        const p = powerUps[i];
        const dx = p.pos.x - player.pos.x;
        const dy = p.pos.y - player.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < ACTIVATION_RANGE && dist < closestDist) {
            closestDist = dist;
            closestIdx = i;
        }
    }

    if (closestIdx === -1) return; // Nothing in range

    const powerUp = powerUps[closestIdx];

    // Apply effect
    switch (powerUp.type) {
        case 'shield_restore':
            player.shield = PLAYER_MAX_SHIELD;
            break;
        case 'rapid_fire':
            state.rapidFireTimer = RAPID_FIRE_DURATION;
            break;
        case 'invincibility':
            player.invincibleTimer = INVINCIBILITY_DURATION;
            break;
    }

    // Remove the used power-up
    state.powerUps.splice(closestIdx, 1);

    // Respawn a new one elsewhere after a delay (handled elsewhere)
}

export function drawPowerUp(
    ctx: CanvasRenderingContext2D,
    p: PowerUp,
    screenX: number,
    screenY: number,
    time: number
): void {
    const pulse = 0.7 + Math.sin(time * 3 + p.pulsePhase) * 0.3;
    const r = p.radius * pulse;

    const colours: Record<PowerUpType, { fill: string; glow: string; label: string }> = {
        shield_restore: { fill: '#3b82f6', glow: 'rgba(59,130,246,0.5)', label: 'SH' },
        rapid_fire: { fill: '#fbbf24', glow: 'rgba(251,191,36,0.5)', label: 'RF' },
        invincibility: { fill: '#a78bfa', glow: 'rgba(167,139,250,0.5)', label: 'IN' },
    };

    const col = colours[p.type];

    ctx.save();
    ctx.translate(screenX, screenY);

    // Glow
    const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2.5);
    glow.addColorStop(0, col.glow);
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(0, 0, r * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // Diamond shape
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r, 0);
    ctx.lineTo(0, r);
    ctx.lineTo(-r, 0);
    ctx.closePath();
    ctx.fillStyle = col.fill;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Label
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${r * 0.8}px Courier New`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(col.label, 0, 0);

    ctx.restore();
}