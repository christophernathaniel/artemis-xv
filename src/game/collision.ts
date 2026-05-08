// src/game/collision.ts
// ─────────────────────────────────────────────────────────────────────────────
// All collision detection uses "circle vs circle" checks.
// This is the simplest and most performant approach for this type of game.
// 
// Two circles overlap if: distance between centres < sum of their radii
// distance = sqrt((x2-x1)² + (y2-y1)²)
// But sqrt is expensive — we use distance² < (r1+r2)² instead.
// ─────────────────────────────────────────────────────────────────────────────

import type { GameState, ScorePopup } from './types';
import { loseLife } from './player';
import { createCollectible } from './collectibles';
import {
    ANTIMATTER_DAMAGE, HELIUM3_POINTS, SOLAR_POINTS,
    PLAYER_MAX_HEALTH, PLAYER_MAX_SHIELD
} from './constants';

// Helper: are two circles overlapping?
function circlesOverlap(
    x1: number, y1: number, r1: number,
    x2: number, y2: number, r2: number
): boolean {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distSq = dx * dx + dy * dy;
    const radiiSum = r1 + r2;
    return distSq < radiiSum * radiiSum;
}

let popupIdCounter = 9000;

function createScorePopup(value: number, x: number, y: number): ScorePopup {
    return {
        id: popupIdCounter++,
        value,
        pos: { x, y },
        lifetime: 1.2,
        maxLifetime: 1.2,
    };
}

// ─────────────────────────────────────────────────────────────────────────────
// processCollisions
// Checks all player collisions in one pass and mutates state accordingly.
// ─────────────────────────────────────────────────────────────────────────────
export function processCollisions(state: GameState): void {
    const { player } = state;

    if (!player.isAlive || player.invincibleTimer > 0) return;

    // ── ANTIMATTER ────────────────────────────────────────────────────────────
    for (let i = state.antimatter.length - 1; i >= 0; i--) {
        const a = state.antimatter[i];
        if (circlesOverlap(player.pos.x, player.pos.y, player.radius, a.pos.x, a.pos.y, a.radius)) {
            // Damage shield first, then health
            if (player.shield > 0) {
                player.shield = Math.max(0, player.shield - ANTIMATTER_DAMAGE);
            } else {
                player.health = Math.max(0, player.health - ANTIMATTER_DAMAGE);
            }

            // Destroy the antimatter on impact
            state.antimatter.splice(i, 1);

            // If health hits 0, lose a life
            if (player.health <= 0) {
                loseLife(player);
                player.health = 60; // Partial restore on respawn
            }

            break; // Only one collision per frame
        }
    }

    // ── COLLECTIBLES ──────────────────────────────────────────────────────────
    for (let i = state.collectibles.length - 1; i >= 0; i--) {
        const c = state.collectibles[i];
        if (circlesOverlap(player.pos.x, player.pos.y, player.radius, c.pos.x, c.pos.y, c.radius)) {
            const points = c.type === 'helium3' ? HELIUM3_POINTS : SOLAR_POINTS;
            player.score += points;

            // Add floating score popup
            state.scorePopups.push(createScorePopup(points, c.pos.x, c.pos.y));

            // Remove collected item and spawn a replacement
            state.collectibles.splice(i, 1);
            state.collectibles.push(createCollectible(c.type));
        }
    }

    // ── PROJECTILES vs ANTIMATTER ─────────────────────────────────────────────
    for (let pi = state.projectiles.length - 1; pi >= 0; pi--) {
        const proj = state.projectiles[pi];
        for (let ai = state.antimatter.length - 1; ai >= 0; ai--) {
            const a = state.antimatter[ai];
            if (circlesOverlap(proj.pos.x, proj.pos.y, proj.radius, a.pos.x, a.pos.y, a.radius)) {
                // Projectile hits antimatter — destroy both, award points
                state.projectiles.splice(pi, 1);
                state.antimatter.splice(ai, 1);
                player.score += 5; // Small bonus for shooting antimatter
                state.scorePopups.push(createScorePopup(5, a.pos.x, a.pos.y));
                break;
            }
        }
    }
}