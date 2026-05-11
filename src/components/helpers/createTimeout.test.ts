import { describe, expect, it, vi } from 'vitest';

import { createTimeout } from './createTimeout';

describe('createTimeout', () => {
    it('does not call the callback before the delay is reached', () => {
        const callback = vi.fn();
        const tick = createTimeout(callback, 100);

        tick(0.05);

        expect(callback).not.toHaveBeenCalled();
    });

    it('calls the callback once when accumulated frame time reaches the delay', () => {
        const callback = vi.fn();
        const tick = createTimeout(callback, 100);

        tick(0.04);
        tick(0.06);
        tick(0.5);

        expect(callback).toHaveBeenCalledTimes(1);
    });

    it('ignores invalid delays', () => {
        const callback = vi.fn();
        const tick = createTimeout(callback, 0);

        tick(1);

        expect(callback).not.toHaveBeenCalled();
    });
});