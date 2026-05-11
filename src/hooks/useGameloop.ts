import { useRef, useEffect, useCallback } from 'react';
import type { GameState, HUDData, HUDState } from '../game/types';
import { createPlayer, updatePlayer, drawPlayer, checkBoundary } from '../game/player';
import { updateCamera, worldToScreen } from '../game/camera';
import { createInputState, setupInputListeners } from '../game/input';
import { initStars, drawBackground, drawBoundary } from '../game/renderer';
import { spawnAntimatterField, drawAntimatter, updateAntimatter } from '../game/antimatter';
import { drawBlackHole, spawnBlackHoles, updateBlackHoles } from '../game/blackhole';
import { processCollisions } from '../game/collision';

// the hook to take the canvas element and update it
interface UseGameLoopOptions {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    onHUDUpdate: (data: HUDData) => void; // callback to update the HUD
    onStateUpdate: (state: HUDState) => void;
    onGameOver: () => void; // callback for game over
}

export function useGameLoop({ canvasRef, onHUDUpdate, onStateUpdate, onGameOver }: UseGameLoopOptions) {
    // JS's Canvas: requestAnimatonFrame ID 
    const animFrameRef = useRef<number>(0);

    // Timestamp of the last frame
    const lastTimeRef = useRef<number>(0);

    // throttle HUD update
    const hudThrottleRef = useRef<number>(0);

    // The entire game state lives in this single ref
    const stateRef = useRef<GameState>({
        player: createPlayer(),
        projectiles: [],
        debris: [],
        antimatter: spawnAntimatterField(),
        blackHoles: spawnBlackHoles(),
        collectibles: [],
        powerUps: [],
        scorePopups: [],
        camera: { x: 0, y: 0, z: 1.5 },
        elapsedTime: 0,
        isGameOver: false,
        isPaused: false,
        nextId: 1,
        rapidFireTimer: 0,
        invincibilityTimer: 0,
        shootCooldown: 0,
    });

    // Input state also lives in a ref — no re-renders
    const inputRef = useRef(createInputState());


    useEffect(() => {
        // Initialise stars once
        initStars();

        // Wire up keyboard input, store cleanup function
        const cleanupInput = setupInputListeners(inputRef.current);

        return cleanupInput;
    }, []);


    // dt = the number of seconds since the last frame (typically ~0.016 at 60fps).
    // Instead of moving objects by a fixed number of pixels per frame,
    // multiply by dt: position += speed * dt

    const loop = useCallback(function frame(timestamp: number) {

        // Calculate delta time (in seconds)
        if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
        // Math.min caps dt at 50ms — if the browser tab is hidden and you
        // come back, you don't want a 5-second dt sending everything flying
        const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);

        lastTimeRef.current = timestamp;


        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const state = stateRef.current;
        const input = inputRef.current;
        const W = canvas.clientWidth;
        const H = canvas.clientHeight




        if (state.isGameOver) { onGameOver(); return; }
        state.elapsedTime += dt;


        checkBoundary(state.player);

        if (!state.player.isAlive) {
            state.isGameOver = true;
        }

        drawBackground(ctx, state.camera, W, H, state.elapsedTime, state.camera.z);
        drawBoundary(ctx, state.camera, state.elapsedTime, state.camera.z);

        updatePlayer(state.player, input, dt);
        updateAntimatter(state.antimatter, dt);

        for (const antimatter of state.antimatter) {
            const antimatterScreenPos = worldToScreen(
                antimatter.pos.x,
                antimatter.pos.y,
                state.camera
            );

            drawAntimatter(
                ctx,
                antimatter,
                antimatterScreenPos.x,
                antimatterScreenPos.y,
                state.elapsedTime,
                state.camera.z
            );
        }


        updateBlackHoles(state.blackHoles, state.player, dt);

        for (const bh of state.blackHoles) {
            const bhScreenPos = worldToScreen(
                bh.pos.x,
                bh.pos.y,
                state.camera
            );

            drawBlackHole(
                ctx,
                bh,
                bhScreenPos.x,
                bhScreenPos.y,
                state.camera.z
            );
        }

        updateCamera(state.camera, state.player, W, H, state, input);

        const pScreen = worldToScreen(state.player.pos.x, state.player.pos.y, state.camera);
        drawPlayer(ctx, state.player, pScreen.x, pScreen.y, state.camera.z, input, dt);

        hudThrottleRef.current += dt;
        if (hudThrottleRef.current >= 0.1) {
            hudThrottleRef.current = 0;
            onHUDUpdate({
                health: state.player.health,
                shield: state.player.shield,
                lives: state.player.lives,
                score: state.player.score,
                dodgeCharges: state.player.dodgeCharges,
                dodgeCooldown: state.player.dodgeCooldown,
                elapsedTime: state.elapsedTime,
                isGameOver: state.isGameOver,
                rapidFireActive: state.rapidFireTimer > 0,
                invincibilityActive: state.player.invincibleTimer > 0,
            });

            onStateUpdate({
                elapsedTime: state.elapsedTime,
                isPaused: state.isPaused,
            });
        }


        processCollisions(state);

        // Schedule next frame
        animFrameRef.current = requestAnimationFrame(frame);
    }, [canvasRef, onHUDUpdate, onStateUpdate, onGameOver]);

    useEffect(() => {
        // Start the loop
        animFrameRef.current = requestAnimationFrame(loop);

        return () => {
            // when the component unmounts, cancel the animation frame to stop the loop
            cancelAnimationFrame(animFrameRef.current);
        };
    }, [loop]);

}