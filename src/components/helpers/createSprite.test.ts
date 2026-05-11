import { describe, expect, it, vi } from 'vitest';

import { createSprite } from './createSprite';

describe('createSprite', () => {
    function createClock(startMs = 0): { now: () => number; advance: (ms: number) => void } {
        let currentMs = startMs;

        return {
            now: () => currentMs,
            advance: (ms: number) => {
                currentMs += ms;
            },
        };
    }

    it('advances frames based on frame duration', () => {
        const clock = createClock();
        const sprite = createSprite({
            image: {} as CanvasImageSource,
            frameWidth: 16,
            frameHeight: 16,
            frameCount: 4,
            frameDurationMs: 100,
            getNowMs: clock.now,
        });

        expect(sprite.getFrameIndex()).toBe(0);

        clock.advance(100);
        expect(sprite.getFrameIndex()).toBe(1);

        clock.advance(200);
        expect(sprite.getFrameIndex()).toBe(3);
    });

    it('loops back to the first frame by default', () => {
        const clock = createClock();
        const sprite = createSprite({
            image: {} as CanvasImageSource,
            frameWidth: 16,
            frameHeight: 16,
            frameCount: 4,
            frameDurationMs: 100,
            getNowMs: clock.now,
        });

        clock.advance(450);

        expect(sprite.getFrameIndex()).toBe(0);
    });

    it('can clamp to the last frame when looping is disabled', () => {
        const clock = createClock();
        const sprite = createSprite({
            image: {} as CanvasImageSource,
            frameWidth: 16,
            frameHeight: 16,
            frameCount: 4,
            frameDurationMs: 100,
            loop: false,
            getNowMs: clock.now,
        });

        clock.advance(450);

        expect(sprite.getFrameIndex()).toBe(3);
    });

    it('draws the correct source frame from the sprite sheet', () => {
        const clock = createClock();
        const image = {} as CanvasImageSource;
        const ctx = {
            drawImage: vi.fn(),
        } as unknown as CanvasRenderingContext2D;

        const sprite = createSprite({
            image,
            frameWidth: 16,
            frameHeight: 24,
            frameCount: 4,
            frameDurationMs: 100,
            getNowMs: clock.now,
        });

        clock.advance(200);
        sprite.draw(ctx, 10, 20, 32, 48);

        expect(ctx.drawImage).toHaveBeenCalledWith(
            image,
            32,
            0,
            16,
            24,
            10,
            20,
            32,
            48,
        );
    });

    it('resets back to the first frame', () => {
        const clock = createClock();
        const sprite = createSprite({
            image: {} as CanvasImageSource,
            frameWidth: 16,
            frameHeight: 16,
            frameCount: 4,
            frameDurationMs: 100,
            getNowMs: clock.now,
        });

        clock.advance(250);
        expect(sprite.getFrameIndex()).toBe(2);

        sprite.reset();
        expect(sprite.getFrameIndex()).toBe(0);
    });
});