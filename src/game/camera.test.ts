import { describe, expect, it } from 'vitest';

import { isOnScreen, worldToScreen } from './camera';
import type { Camera } from './types';

describe('worldToScreen', () => {
    // These tests are based on the camera's position and zoom, 
    //  and how they affect the conversion of world coordinates to screen coordinates.

    it('returns the same coordinates at origin with unit zoom', () => {
        const camera: Camera = { x: 0, y: 0, z: 1 };

        expect(worldToScreen(120, 80, camera)).toEqual({ x: 120, y: 80 });
    });

    it('subtracts camera position before applying zoom', () => {
        const camera: Camera = { x: 100, y: 50, z: 2 };

        expect(worldToScreen(140, 70, camera)).toEqual({ x: 80, y: 40 });
    });

    it('handles negative world coordinates', () => {
        const camera: Camera = { x: -20, y: 10, z: 0.5 };

        expect(worldToScreen(-10, -30, camera)).toEqual({ x: 5, y: -20 });
    });
});

describe('isOnScreen', () => {
    it('keeps objects inside the buffered view visible', () => {
        const camera: Camera = { x: 100, y: 50, z: 2 };

        expect(isOnScreen(110, 60, 10, camera, 400, 200)).toBe(true);
    });

    it('excludes objects past the buffered view bounds', () => {
        const camera: Camera = { x: 100, y: 50, z: 2 };

        expect(isOnScreen(-20, 60, 10, camera, 400, 200)).toBe(false);
    });
});