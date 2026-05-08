// src/game/antimatter.ts
import type { Antimatter } from './types';
import {
    ANTIMATTER_COUNT, ANTIMATTER_MIN_RADIUS, ANTIMATTER_MAX_RADIUS,
    ANTIMATTER_MIN_SPEED, ANTIMATTER_MAX_SPEED, WORLD_WIDTH, WORLD_HEIGHT
} from './constants';

function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

let antimatterIdCounter = 2000;

export function spawnAntimatterField(): Antimatter[] {
    return Array.from({ length: ANTIMATTER_COUNT }, createAntimatter);
}

export function createAntimatter(): Antimatter {
    const angle = Math.random() * Math.PI * 2;
    const speed = rand(ANTIMATTER_MIN_SPEED, ANTIMATTER_MAX_SPEED);
    const radius = rand(ANTIMATTER_MIN_RADIUS, ANTIMATTER_MAX_RADIUS);
    const jaggedness: number[] = [];
    const points = 10; // Number of jagged points

    // Pre-calculate jagged offsets so shape is consistent across frames
    for (let i = 0; i < points; i++) {
        jaggedness.push(rand(0.5, 1.2)); // Multiplier for radius at each point
    }

    return {
        id: antimatterIdCounter++,
        pos: { x: rand(50, WORLD_WIDTH - 50), y: rand(50, WORLD_HEIGHT - 50) },
        vel: { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
        radius,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: rand(-0.8, 0.8),
        jaggedness,
    };
}

export function updateAntimatter(antimatter: Antimatter[], dt: number): void {
    for (const a of antimatter) {
        a.pos.x += a.vel.x * dt;
        a.pos.y += a.vel.y * dt;
        a.rotation += a.rotationSpeed * dt;

        // Wrap around world edges
        if (a.pos.x < -a.radius) a.pos.x = WORLD_WIDTH + a.radius;
        if (a.pos.x > WORLD_WIDTH + a.radius) a.pos.x = -a.radius;
        if (a.pos.y < -a.radius) a.pos.y = WORLD_HEIGHT + a.radius;
        if (a.pos.y > WORLD_HEIGHT + a.radius) a.pos.y = -a.radius;
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// drawAntimatter
// Antimatter is drawn as a jagged black rock with a purple energy glow.
// The "void" visual communicates danger.
// ─────────────────────────────────────────────────────────────────────────────
export function drawAntimatter(
    ctx: CanvasRenderingContext2D,
    a: Antimatter,
    screenX: number,
    screenY: number,
    time: number, // For pulsing glow animation
    zoom: number
): void {
    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(a.rotation);

    const points = a.jaggedness.length;

    // ── DANGER GLOW ──────────────────────────────────────────────────────────
    const glowPulse = 0.6 + Math.sin(time * 3) * 0.3; // Pulsing 0.3–0.9
    const glow = ctx.createRadialGradient(0, 0, a.radius * 0.3 * zoom, 0, 0, a.radius * 1.8 * zoom);
    glow.addColorStop(0, `rgba(180, 0, 255, ${glowPulse * 0.5})`);
    glow.addColorStop(0.5, `rgba(80, 0, 120, ${glowPulse * 0.3})`);
    glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.beginPath();
    ctx.arc(0, 0, a.radius * 1.8 * zoom, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();

    // ── JAGGED ROCK BODY ─────────────────────────────────────────────────────
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
        const angle = (i / points) * Math.PI * 2;
        const r = a.radius * a.jaggedness[i] * zoom;
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();

    // Fill with near-black + subtle purple tint
    ctx.fillStyle = '#0d0010';
    ctx.fill();
    ctx.strokeStyle = '#9333ea';
    ctx.lineWidth = 1.5 * zoom;
    ctx.stroke();

    ctx.restore();
}