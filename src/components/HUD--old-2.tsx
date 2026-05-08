// src/components/HUD.tsx
import type { HUDData } from '../game/types';
import { PLAYER_DODGE_RECHARGE } from '../game/constants';

// ─────────────────────────────────────────────────────────────────────────────
// HUD (Heads-Up Display)
// This is a React component that sits on top of the canvas.
// It reads from HUDData — a snapshot of game state — and renders the UI.
// It does NOT contain any game logic. It only displays.
// ─────────────────────────────────────────────────────────────────────────────

interface HUDProps {
    data: HUDData;
}

// Helper to format seconds as MM:SS
function formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function HUD({ data }: HUDProps) {
    return (
        <div style={{
            position: 'absolute',
            inset: 0,               // Shorthand for top/right/bottom/left: 0
            pointerEvents: 'none',  // Critical: lets clicks/keys pass through to game
            fontFamily: "'Courier New', monospace",
            color: 'white',
            userSelect: 'none',     // Prevent text selection
        }}>

            HUD UI HERE

            Health: {data.health}
            Shield: {data.shield}
            Lives: {data.lives}
            Score: {data.score}
            Time: {formatTime(data.elapsedTime)}
            Dodge: {data.dodgeCharges} / {PLAYER_DODGE_RECHARGE}

        </div>
    );
}