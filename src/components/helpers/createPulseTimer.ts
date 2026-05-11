export interface PulseTimer {
    isOn: () => boolean;
    forceOff: (durationMs: number) => void;
    reset: () => void;
}

function getDefaultNowMs(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export function createPulseTimer(
    offDurationMs: number,
    onDurationMs: number,
    getNowMs: () => number = getDefaultNowMs,
): PulseTimer {
    let elapsedMs = 0;
    let forcedOffUntilMs = 0;
    let lastNowMs = getNowMs();

    function sync(): void {
        const nowMs = getNowMs();
        const deltaMs = Math.max(0, nowMs - lastNowMs);

        lastNowMs = nowMs;
        elapsedMs += deltaMs;
    }

    function computeIsOn(): boolean {
        if (offDurationMs <= 0 || onDurationMs <= 0) {
            return false;
        }

        if (elapsedMs < offDurationMs || elapsedMs < forcedOffUntilMs) {
            return false;
        }

        const cycleDurationMs = offDurationMs + onDurationMs;
        const pulsePhaseMs = (elapsedMs - offDurationMs) % cycleDurationMs;
        return pulsePhaseMs < onDurationMs;
    }

    function getNextPulseStartMs(targetElapsedMs: number): number {
        if (targetElapsedMs <= offDurationMs) {
            return offDurationMs;
        }

        const cycleDurationMs = offDurationMs + onDurationMs;
        const cyclesSinceFirstPulse = Math.ceil((targetElapsedMs - offDurationMs) / cycleDurationMs);

        return offDurationMs + cyclesSinceFirstPulse * cycleDurationMs;
    }

    return {
        isOn(): boolean {
            sync();
            return computeIsOn();
        },

        forceOff(durationMs: number): void {
            sync();
            forcedOffUntilMs = getNextPulseStartMs(elapsedMs + Math.max(0, durationMs));
        },

        reset(): void {
            elapsedMs = 0;
            forcedOffUntilMs = 0;
            lastNowMs = getNowMs();
        },
    };
}