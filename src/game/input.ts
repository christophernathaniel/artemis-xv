

// define input states
export interface InputState {
    up: boolean; // W
    down: boolean; // S
    left: boolean; // A
    right: boolean; // D
    fire: boolean; // spacebar
    dodge: boolean; //  shift
    powerup: boolean; // R
    zoomIn: boolean; // E
    zoomOut: boolean; // Q
    pause: boolean; // ESC
}

// Create fresh input state
// set all inputs to false (not pressed)
export function createInputState(): InputState {
    return {
        up: false,
        down: false,
        left: false,
        right: false,
        fire: false,
        dodge: false,
        powerup: false,
        zoomIn: false,
        zoomOut: false,
        pause: false,
    }
}

export function setupInputListeners(input: InputState): () => void {
    const handleKeyDown = (e: KeyboardEvent) => {
        // Prevent Browser Scroll
        if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
            e.preventDefault();
        }

        switch (e.code) {
            case 'KeyW': case 'ArrowUp': input.up = true; break;
            case 'KeyS': case 'ArrowDown': input.down = true; break;
            case 'KeyA': case 'ArrowLeft': input.left = true; break;
            case 'KeyD': case 'ArrowRight': input.right = true; break;
            case 'Space': input.fire = true; break;
            case 'ShiftLeft': case 'ShiftRight': input.dodge = true; break;
            case 'KeyR': input.powerup = true; break;
            case 'KeyE': input.zoomIn = true; break;
            case 'KeyQ': input.zoomOut = true; break;
            case 'Escape': input.pause = !input.pause; break;
        }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
        switch (e.code) {
            case 'KeyW': case 'ArrowUp': input.up = false; break;
            case 'KeyS': case 'ArrowDown': input.down = false; break;
            case 'KeyA': case 'ArrowLeft': input.left = false; break;
            case 'KeyD': case 'ArrowRight': input.right = false; break;
            case 'Space': input.fire = false; break;
            case 'ShiftLeft': case 'ShiftRight': input.dodge = false; break;
            case 'KeyR': input.powerup = false; break;
            case 'KeyE': input.zoomIn = false; break;
            case 'KeyQ': input.zoomOut = false; break;
            // case 'Escape': input.pause = false; break;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
    }
}