import type { Debris } from './types';

import {
    DEBRIS_COUNT, DEBRIS_MIN_RADIUS, DEBRIS_MAX_RADIUS,
    DEBRIS_MIN_SPEED, DEBRIS_MAX_SPEED, WORLD_WIDTH, WORLD_HEIGHT
} from './constants';

// Random helper number generator (between two numbers)
function rand(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

let debrisIdCounter = 1000;

// creates the initial debrees
export function spawnDebrisField(): Debris[] {
    const field: Debris[] = [];

    for (let i = 0; i < DEBRIS_COUNT; i++) {
        field.push(createDebris());
    }

    return field;
}


// creates a single debris with random positions and velocity and sides
export function createDebris(): Debris {
    const angle = Math.random() * Math.PI * 2;
    const speed = rand(DEBRIS_MIN_SPEED, DEBRIS_MAX_SPEED);

    return {
        id: debrisIdCounter++,
        pos: {
            x: rand(50, WORLD_WIDTH - 50),
            y: rand(50, WORLD_HEIGHT - 50),
        },
        vel: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
        },
        radius: rand(DEBRIS_MIN_RADIUS, DEBRIS_MAX_RADIUS),
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: rand(-1.5, 1.5), // radians per second
        sides: Math.floor(rand(4, 8)), // 3 to 7 sides
    };
}


// moves the debris around the world
export function updateDebris(debris: Debris[], dt: number): void {
    for (const d of debris) {
        d.pos.x += d.vel.x * dt;
        d.pos.y += d.vel.y * dt;
        d.rotation += d.rotationSpeed * dt;

        // Wrap around world edges (so debris that goes off one side comes back on the other)
        if (d.pos.x < -d.radius) d.pos.x = WORLD_WIDTH + d.radius;
        if (d.pos.x > WORLD_WIDTH + d.radius) d.pos.x = -d.radius;
        if (d.pos.y < -d.radius) d.pos.y = WORLD_HEIGHT + d.radius;
        if (d.pos.y > WORLD_HEIGHT + d.radius) d.pos.y = -d.radius;
    }
}


// draw debris (draw the polygon)
export function drawDebris(
    ctx: CanvasRenderingContext2D,
    d: Debris,
    screenX: number,
    screenY: number): void {

    ctx.save();
    ctx.translate(screenX, screenY);
    ctx.rotate(d.rotation);

    // draw polygon with sides
    ctx.beginPath();
    for (let i = 0; i < d.sides; i++) {
        const angle = (i / d.sides) * Math.PI * 2;
        // Add slight irregularity to make it look natural, not perfect
        const r = d.radius * (0.8 + Math.random() * 0.4);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.closePath();

    ctx.fillStyle = '#5a5a5a';
    ctx.fill();
    ctx.strokeStyle = '#8a8a9a';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
}