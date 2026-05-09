import type { BlackHole, Player } from './types';

import {
    BLACK_HOLE_COUNT, BLACK_HOLE_RADIUS, BLACK_HOLE_PULL_RADIUS,
    BLACK_HOLE_PULL_STRENGTH, WORLD_WIDTH, WORLD_HEIGHT
} from './constants';

import { loseLife } from './player';

function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

let bhIdCounter = 3000;

export function spawnBlackHoles(): BlackHole[] {
    const holes: BlackHole[] = [];

    for (let i = 0; i < BLACK_HOLE_COUNT; i++) {
        holes.push({
            id: bhIdCounter++,
            pos: {
                x: rand(WORLD_WIDTH * 0.1, WORLD_WIDTH * 0.9),
                y: rand(WORLD_HEIGHT * 0.1, WORLD_HEIGHT * 0.9),
            },
            radius: BLACK_HOLE_RADIUS,
            pullRadius: BLACK_HOLE_PULL_RADIUS,
            pullStrength: BLACK_HOLE_PULL_STRENGTH,
            spinAngle: 0,
        })
    }

    return holes;
}



export function updateBlackHoles(blackHoles: BlackHole[], player: Player, dt: number): void {
    for (const bh of blackHoles) {
        bh.spinAngle += dt * 0.8;

        // Calculate distance from the player
        const dx = bh.pos.x - player.pos.x;
        const dy = bh.pos.y - player.pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);


        // only pull if in radius
        if (distance < bh.pullRadius && distance > 1) {
            const falloff = 1 - (distance / bh.pullRadius); // Pull is stronger when closer
            const force = bh.pullStrength * falloff * falloff; // Quadratic falloff for stronger pull when closer


            // Normalise direction and apply force
            const nx = dx / distance;
            const ny = dy / distance;

            player.pos.x += nx * force * dt;
            player.pos.y += ny * force * dt;
        }

        // If player is inside the black hole, player dies
        if (distance < bh.radius + player.radius) {
            if (player.invincibleTimer <= 0) {
                player.health = 60;
                player.shield = 100;
                loseLife(player);
            }
        }
    }
}


export function drawBlackHole(
    ctx: CanvasRenderingContext2D,
    bh: BlackHole,
    screenX: number,
    screenY: number,
    zoom: number
): void {
    ctx.save();
    ctx.translate(screenX, screenY);

    // ── GRAVITY WELL INDICATOR ────────────────────────────────────────────────
    // Faint circle showing the pull radius
    ctx.beginPath();
    ctx.arc(0, 0, bh.pullRadius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 200, 50, 0.2)';
    ctx.lineWidth = 1;
    ctx.setLineDash([8, 12]);
    ctx.stroke();
    ctx.setLineDash([]);

    // ── ACCRETION DISC (spinning rings) ──────────────────────────────────────
    for (let ring = 4; ring > 0; ring--) {
        ctx.save();
        ctx.rotate(bh.spinAngle * (ring % 2 === 0 ? 1 : 2));

        const ringRadius = bh.radius * (1.2 + ring * 0.5);
        const ringAlpha = 0.6 / ring;

        ctx.beginPath();
        ctx.arc(0, 0, ringRadius * zoom, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(255, ${200 - ring * 40}, 0, ${ringAlpha})`;
        ctx.lineWidth = ring === 1 ? 2 * zoom : 2 * zoom;
        ctx.stroke();

        // Add hot spots on the ring
        for (let j = 0; j < 8; j++) {
            const spotAngle = (j / 8) * Math.PI * 2 + bh.spinAngle;
            ctx.beginPath();
            ctx.arc(
                Math.cos(spotAngle) * ringRadius * zoom,
                Math.sin(spotAngle) * ringRadius * zoom,
                2 * zoom, 0, Math.PI * 2
            );
            ctx.fillStyle = `rgba(255, 255, 150, ${ringAlpha * 1.5})`;
            ctx.fill();
        }

        ctx.restore();
    }

    // ── EVENT HORIZON (the dark centre) ──────────────────────────────────────
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, bh.radius * 1.3);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.7, '#050008');
    gradient.addColorStop(1, 'rgba(10, 0, 20, 0)');

    ctx.beginPath();
    ctx.arc(0, 0, bh.radius * 1.3, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.restore();
}