import type { Camera, GameState, Player } from './types';
import { WORLD_WIDTH, WORLD_HEIGHT, ZOOM_SPEED, ZOOM_MIN, ZOOM_MAX } from './constants';
import type { InputState } from './input';

// ─────────────────────────────────────────────────────────────────────────────
// updateCamera
// 
// The camera x,y is the top-left corner of the visible area in world space.
// We want the player to always be in the centre of the screen.
// So: camera.x = player.pos.x - screenWidth / 2
// 
// We clamp so the camera never shows outside the world boundaries.
// ─────────────────────────────────────────────────────────────────────────────
export function updateCamera(
    camera: Camera,
    player: Player,
    screenWidth: number,
    screenHeight: number,
    state: GameState,
    input: InputState,
): void {

    const viewWidth = screenWidth / camera.z;
    const viewHeight = screenHeight / camera.z;

    if (input.zoomIn) {
        state.camera.z += 0.01 * ZOOM_SPEED;
    }

    if (input.zoomOut) {
        state.camera.z -= 0.01 * ZOOM_SPEED;
    }

    state.camera.z = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, state.camera.z));

    // Centre camera on player
    camera.x = player.pos.x - viewWidth / 2;
    camera.y = player.pos.y - viewHeight / 2;

    // Clamp - don't scroll past world edges
    camera.x = Math.max(0, Math.min(camera.x, WORLD_WIDTH - viewWidth));
    camera.y = Math.max(0, Math.min(camera.y, WORLD_HEIGHT - viewHeight));
}



// ─────────────────────────────────────────────────────────────────────────────
// worldToScreen
// Convert world coordinates to screen coordinates by subtracting camera position
// ─────────────────────────────────────────────────────────────────────────────

export function worldToScreen(worldX: number, worldY: number, camera: Camera): { x: number; y: number, z: number } {
    return {
        x: (worldX - camera.x) * camera.z,
        y: (worldY - camera.y) * camera.z
    };
}

export function isOnScreen(worldX: number, worldY: number, radius: number, camera: Camera, screenWidth: number, screenHeight: number): boolean {
    const buffer = radius + 50; // Extra buffer so objects don't pop in/out

    const viewWidth = screenWidth / camera.z;
    const viewHeight = screenHeight / camera.z;

    return (
        worldX + buffer > camera.x &&
        worldX - buffer < camera.x + viewWidth &&
        worldY + buffer > camera.y &&
        worldY - buffer < camera.y + viewHeight
    );
}