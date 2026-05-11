import { describe, expect, it, vi } from 'vitest';

import { createInterval } from './createInterval';

describe('createInterval', () => {
    it('does not call the callback before the interval is reached', () => {
        const callback = vi.fn();
        const tick = createInterval(callback, 100);

        tick(0.05);

        expect(callback).not.toHaveBeenCalled();
    });

    it('calls the callback when accumulated frame time reaches the interval', () => {
        const callback = vi.fn();
        const tick = createInterval(callback, 100);

        tick(0.04);
        tick(0.06);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('keeps leftover frame time for the next interval', () => {
        const callback = vi.fn();
        const tick = createInterval(callback, 100);

        tick(0.25);
        tick(0.04);
        tick(0.01);

        expect(callback).toHaveBeenCalledTimes(2);
    });

    it('ignores invalid intervals', () => {
        const callback = vi.fn();
        const tick = createInterval(callback, 0);

        tick(1);

        expect(callback).not.toHaveBeenCalled();
    });
});