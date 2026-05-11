import { describe, expect, it } from 'vitest';

import { createPulseTimer } from './createPulseTimer';

describe('createPulseTimer', () => {
    function createClock(startMs = 0): { now: () => number; advance: (ms: number) => void } {
        let currentMs = startMs;

        return {
            now: () => currentMs,
            advance: (ms: number) => {
                currentMs += ms;
            },
        };
    }

    it('turns on when an interval is reached and stays on for the configured duration', () => {
        const clock = createClock();
        const pulse = createPulseTimer(100, 40, clock.now);

        clock.advance(50);
        expect(pulse.isOn()).toBe(false);

        clock.advance(50);
        expect(pulse.isOn()).toBe(true);

        clock.advance(20);
        expect(pulse.isOn()).toBe(true);

        clock.advance(20);
        expect(pulse.isOn()).toBe(false);
    });

    it('treats the first value as off duration before each pulse', () => {
        const clock = createClock();
        const pulse = createPulseTimer(200, 200, clock.now);

        clock.advance(199);
        expect(pulse.isOn()).toBe(false);

        clock.advance(1);
        expect(pulse.isOn()).toBe(true);

        clock.advance(199);
        expect(pulse.isOn()).toBe(true);

        clock.advance(1);
        expect(pulse.isOn()).toBe(false);
    });

    it('is not affected by repeated checks between frames', () => {
        const clock = createClock();
        const pulse = createPulseTimer(100, 40, clock.now);

        clock.advance(100);

        expect(pulse.isOn()).toBe(true);
        expect(pulse.isOn()).toBe(true);
        expect(pulse.isOn()).toBe(true);
    });

    it('can be forced off until a later interval turns it back on', () => {
        const clock = createClock();
        const pulse = createPulseTimer(100, 40, clock.now);

        clock.advance(100);
        expect(pulse.isOn()).toBe(true);

        pulse.forceOff(150);

        expect(pulse.isOn()).toBe(false);

        clock.advance(100);
        expect(pulse.isOn()).toBe(false);

        clock.advance(50);
        expect(pulse.isOn()).toBe(false);

        clock.advance(130);
        expect(pulse.isOn()).toBe(true);
    });

    it('returns the pulse state at the end of a long frame', () => {
        const clock = createClock();
        const pulse = createPulseTimer(100, 30, clock.now);

        clock.advance(510);
        expect(pulse.isOn()).toBe(true);

        clock.advance(20);
        expect(pulse.isOn()).toBe(false);
    });
});