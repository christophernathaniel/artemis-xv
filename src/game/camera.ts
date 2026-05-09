import type { Camera, GameState, Player } from './types';
import {
    WORLD_WIDTH,
    WORLD_HEIGHT,
    ZOOM_SPEED,
    ZOOM_MIN,
    ZOOM_MAX
} from './constants';
import type { InputState } from './input';


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



// Convert 'world' coordinates to 'screen' coordinates based on camera position and zoom

export function worldToScreen(worldX: number, worldY: number, camera: Camera): { x: number; y: number, z: number } {
    return {
        x: (worldX - camera.x) * camera.z,
        y: (worldY - camera.y) * camera.z
    };
}

// Drop off objects that are outside the screen bounds (with some buffer so they don't pop in/out)
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