export function createTimeout(callback: () => void, delayMs: number): (dt: number) => void {
    // This tracks how much frame time has built up since the timeout was created.

    let elapsedMs = 0;
    // Once the timeout fires, this prevents the callback from running again.

    let hasFired = false;

    return (dt: number): void => {
        // Stop immediately if the timeout already fired or the delay is invalid.
        if (hasFired || delayMs <= 0) {
            return;
        }

        // dt comes in as seconds per frame, so convert it to milliseconds.
        elapsedMs += dt * 1000;

        // Fire once when the accumulated frame time reaches the requested delay.
        if (elapsedMs >= delayMs) {
            hasFired = true;
            callback();
        }
    };
}