export interface Sprite {
    draw: (
        ctx: CanvasRenderingContext2D,
        dx: number,
        dy: number,
        drawWidth?: number,
        drawHeight?: number,
    ) => void;
    getFrameIndex: () => number;
    reset: () => void;
}

export interface CreateSpriteOptions {
    image: CanvasImageSource;
    frameWidth: number;
    frameHeight: number;
    frameCount: number;
    frameDurationMs?: number;
    loop?: boolean;
    getNowMs?: () => number;
}

function getDefaultNowMs(): number {
    return typeof performance !== 'undefined' ? performance.now() : Date.now();
}

export function createSprite({
    image,
    frameWidth,
    frameHeight,
    frameCount,
    frameDurationMs = 100,
    loop = true,
    getNowMs = getDefaultNowMs,
}: CreateSpriteOptions): Sprite {
    let startTimeMs = getNowMs();

    function getFrameIndex(): number {
        if (frameCount <= 0 || frameWidth <= 0 || frameHeight <= 0 || frameDurationMs <= 0) {
            return 0;
        }

        const elapsedMs = Math.max(0, getNowMs() - startTimeMs);
        const advancedFrames = Math.floor(elapsedMs / frameDurationMs);

        if (!loop) {
            return Math.min(advancedFrames, frameCount - 1);
        }

        return advancedFrames % frameCount;
    }

    return {
        draw(
            ctx: CanvasRenderingContext2D,
            dx: number,
            dy: number,
            drawWidth = frameWidth,
            drawHeight = frameHeight,
        ): void {
            if (frameCount <= 0 || frameWidth <= 0 || frameHeight <= 0) {
                return;
            }

            const frameIndex = getFrameIndex();

            // Frames are read left-to-right from a single sprite-sheet row.
            ctx.drawImage(
                image,
                frameIndex * frameWidth,
                0,
                frameWidth,
                frameHeight,
                dx,
                dy,
                drawWidth,
                drawHeight,
            );
        },

        getFrameIndex,

        reset(): void {
            startTimeMs = getNowMs();
        },
    };
}