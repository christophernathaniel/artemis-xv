export function createInterval(callback: () => void, intervalMs: number): (dt: number) => void {
    // This value lives inside the closure, so it keeps accumulating across frames.
    let elapsedMs = 0;

    return (dt: number): void => {
        // Ignore invalid intervals so the caller can safely pass dynamic values.
        if (intervalMs <= 0) {
            return;
        }

        // dt is in seconds from the game loop; convert it to milliseconds for the interval check.
        elapsedMs += dt * 1000;

        // Not enough time has passed yet, so keep waiting.
        if (elapsedMs < intervalMs) {
            return;
        }

        // Keep leftover time so long frames do not permanently drift the interval.
        elapsedMs %= intervalMs;
        callback();
    };
}