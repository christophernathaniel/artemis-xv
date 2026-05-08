// src/game/projectiles.ts
import type { Projectile, Player } from './types';
import { PROJECTILE_SPEED, PROJECTILE_RADIUS, PROJECTILE_LIFETIME } from './constants';

let projIdCounter = 5000;

// ─────────────────────────────────────────────────────────────────────────────
// fireProjectile
// Creates a new projectile travelling in the player's current facing direction.
// ─────────────────────────────────────────────────────────────────────────────
export function fireProjectile(player: Player): Projectile {
    return {
        id: projIdCounter++,
        pos: {
            // Spawn at the nose of the ship, not the centre
            x: player.pos.x + Math.cos(player.angle) * player.radius,
            y: player.pos.y + Math.sin(player.angle) * player.radius,
        },
        vel: {
            x: Math.cos(player.angle) * PROJECTILE_SPEED,
            y: Math.sin(player.angle) * PROJECTILE_SPEED,
        },
        radius: PROJECTILE_RADIUS,
        lifetime: PROJECTILE_LIFETIME,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// updateProjectiles
// Moves projectiles and removes expired ones.
// Returns the updated array (with expired ones filtered out).
// ─────────────────────────────────────────────────────────────────────────────
export function updateProjectiles(projectiles: Projectile[], dt: number): Projectile[] {
    return projectiles
        .map(p => ({
            ...p,
            pos: { x: p.pos.x + p.vel.x * dt, y: p.pos.y + p.vel.y * dt },
            lifetime: p.lifetime - dt,
        }))
        .filter(p => p.lifetime > 0); // Remove expired projectiles
}

export function drawProjectile(
    ctx: CanvasRenderingContext2D,
    p: Projectile,
    screenX: number,
    screenY: number
): void {
    // Bright blue energy bolt
    ctx.beginPath();
    ctx.arc(screenX, screenY, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#7dd3fc';
    ctx.fill();

    // Glow
    ctx.beginPath();
    ctx.arc(screenX, screenY, p.radius * 2, 0, Math.PI * 2);
    const glow = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, p.radius * 2);
    glow.addColorStop(0, 'rgba(125, 211, 252, 0.4)');
    glow.addColorStop(1, 'rgba(125, 211, 252, 0)');
    ctx.fillStyle = glow;
    ctx.fill();
}