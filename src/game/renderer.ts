// src/game/renderer.ts
import type { Camera } from './types';
import { STAR_COUNT, WORLD_WIDTH, WORLD_HEIGHT, BOUNDARY_PADDING } from './constants';


// ─────────────────────────────────────────────────────────────────────────────
// Stars are pre-calculated once and stored.
// Drawing them every frame from this array is fast.
// ─────────────────────────────────────────────────────────────────────────────

interface Star {
    x: number;
    y: number;
    radius: number;
    brightness: number; // 0.1–1.0
    twinkleSpeed: number;
    twinkleOffset: number;
}

let stars: Star[] = [];

export function initStars(): void {
    stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * WORLD_WIDTH,
        y: Math.random() * WORLD_HEIGHT,
        radius: Math.random() * 1.5 + 0.3,
        brightness: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 2 + 0.5,
        twinkleOffset: Math.random() * Math.PI * 2,
    }));
}

export function drawBackground(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    screenWidth: number,
    screenHeight: number,
    time: number,
    zoom: number
): void {
    // Fill with deep space gradient
    const bg = ctx.createLinearGradient(0, 0, 0, screenHeight);
    bg.addColorStop(0, '#00020a');
    bg.addColorStop(1, '#010412');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, screenWidth, screenHeight);

    // Draw stars
    for (const star of stars) {
        // Screen position of the star
        const sx = (star.x - camera.x) * zoom;
        const sy = (star.y - camera.y) * zoom;

        // Skip if off screen
        if (sx < -5 || sx > screenWidth + 5 || sy < -5 || sy > screenHeight + 5) continue;

        const twinkle = star.brightness * (0.7 + Math.sin(time * star.twinkleSpeed + star.twinkleOffset) * 0.3);

        ctx.beginPath();
        ctx.arc(sx, sy, star.radius * zoom, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkle})`;
        ctx.fill();
    }
}

// Draw the world boundary as a warning edge
export function drawBoundary(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    screenWidth: number,
    screenHeight: number,
    time: number
): void {


    // Convert world boundary to screen coordinates
    const left = 0 - camera.x;
    const top = 0 - camera.y;
    const right = WORLD_WIDTH - camera.x;
    const bottom = WORLD_HEIGHT - camera.y;

    const pulse = 0.5 + Math.sin(time * 3) * 0.3;
    ctx.strokeStyle = `rgba(255, 60, 60, ${pulse})`;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 15]);
    ctx.strokeRect(
        left + BOUNDARY_PADDING,
        top + BOUNDARY_PADDING,
        (right - left) - BOUNDARY_PADDING * 2,
        (bottom - top) - BOUNDARY_PADDING * 2
    );
    ctx.setLineDash([]);
}