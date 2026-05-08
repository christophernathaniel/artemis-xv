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

            {/* ── TOP LEFT: Health, Shield, Lives ─────────────────────────────── */}
            <div style={{ position: 'absolute', top: 20, left: 20, width: 200 }}>

                {/* Health Bar */}
                <div style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 3, letterSpacing: 1 }}>
                        HULL INTEGRITY
                    </div>
                    <div style={{
                        width: '100%', height: 8,
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{
                            width: `${data.health}%`,
                            height: '100%',
                            background: data.health > 50
                                ? '#22c55e'                          // Green when healthy
                                : data.health > 25
                                    ? '#eab308'                        // Yellow when damaged
                                    : '#ef4444',                       // Red when critical
                            borderRadius: 4,
                            transition: 'width 0.1s ease',
                        }} />
                    </div>
                </div>

                {/* Shield Bar */}
                <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 3, letterSpacing: 1 }}>
                        SHIELD
                    </div>
                    <div style={{
                        width: '100%', height: 8,
                        background: 'rgba(255,255,255,0.15)',
                        borderRadius: 4,
                        overflow: 'hidden',
                        border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                        <div style={{
                            width: `${data.shield}%`,
                            height: '100%',
                            background: '#3b82f6',
                            borderRadius: 4,
                            transition: 'width 0.1s ease',
                            boxShadow: '0 0 8px rgba(59,130,246,0.7)',
                        }} />
                    </div>
                </div>

                {/* Lives */}
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{ fontSize: 11, opacity: 0.7, letterSpacing: 1, marginRight: 4 }}>
                        LIVES
                    </span>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} style={{
                            width: 10, height: 10,
                            borderRadius: '50%',
                            background: i < data.lives ? '#60a5fa' : 'rgba(255,255,255,0.1)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            boxShadow: i < data.lives ? '0 0 6px #60a5fa' : 'none',
                        }} />
                    ))}
                </div>
            </div>

            {/* ── BOTTOM LEFT: Dodge Charges ───────────────────────────────────── */}
            <div style={{ position: 'absolute', bottom: 24, left: 20 }}>
                <div style={{ fontSize: 11, opacity: 0.7, marginBottom: 6, letterSpacing: 1 }}>
                    DODGE  [{data.dodgeCharges}/3]
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {Array.from({ length: 3 }).map((_, i) => {
                        const charged = i < data.dodgeCharges;
                        // Show recharge progress on the next-to-recharge dot
                        const isRecharging = i === data.dodgeCharges && data.dodgeCharges < 3;
                        const progress = isRecharging
                            ? 1 - (data.dodgeCooldown / PLAYER_DODGE_RECHARGE)
                            : 0;

                        return (
                            <div key={i} style={{ position: 'relative', width: 18, height: 18 }}>
                                {/* Background dot */}
                                <div style={{
                                    width: 18, height: 18, borderRadius: '50%',
                                    background: charged ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.3)',
                                    boxShadow: charged ? '0 0 8px #fbbf24' : 'none',
                                }} />
                                {/* Recharge arc overlay — could be enhanced with SVG */}
                                {isRecharging && (
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        borderRadius: '50%',
                                        background: `conic-gradient(#fbbf24 ${progress * 360}deg, transparent 0deg)`,
                                        opacity: 0.5,
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── TOP RIGHT: Timer ─────────────────────────────────────────────── */}
            <div style={{
                position: 'absolute', top: 20, right: 20,
                textAlign: 'right',
            }}>
                <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2, marginBottom: 4 }}>
                    ELAPSED
                </div>
                <div style={{ fontSize: 22, fontWeight: 'bold', letterSpacing: 2, opacity: 0.9 }}>
                    {formatTime(data.elapsedTime)}
                </div>
            </div>

            {/* ── CENTRE: Score ────────────────────────────────────────────────── */}
            <div style={{
                position: 'absolute', top: 20,
                left: '50%', transform: 'translateX(-50%)',
                textAlign: 'center',
            }}>
                <div style={{ fontSize: 11, opacity: 0.5, letterSpacing: 2 }}>SCORE</div>
                <div style={{
                    fontSize: 28, fontWeight: 'bold',
                    background: 'linear-gradient(180deg, #fff 0%, #7dd3fc 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: 3,
                }}>
                    {data.score.toString().padStart(6, '0')}
                </div>
            </div>

            {/* ── ACTIVE POWER-UPS ─────────────────────────────────────────────── */}
            <div style={{ position: 'absolute', top: 20, left: '50%', marginTop: 70, transform: 'translateX(-50%)' }}>
                {data.rapidFireActive && (
                    <div style={{
                        fontSize: 10, letterSpacing: 2, color: '#fbbf24',
                        background: 'rgba(251,191,36,0.15)', padding: '2px 8px',
                        borderRadius: 4, border: '1px solid rgba(251,191,36,0.4)',
                        marginBottom: 4, textAlign: 'center',
                    }}>
                        ⚡ RAPID FIRE
                    </div>
                )}
                {data.invincibilityActive && (
                    <div style={{
                        fontSize: 10, letterSpacing: 2, color: '#a78bfa',
                        background: 'rgba(167,139,250,0.15)', padding: '2px 8px',
                        borderRadius: 4, border: '1px solid rgba(167,139,250,0.4)',
                        textAlign: 'center',
                    }}>
                        ✦ INVINCIBLE
                    </div>
                )}
            </div>

            {/* ── CONTROL HINT (small, bottom right) ──────────────────────────── */}
            <div style={{
                position: 'absolute', bottom: 20, right: 20,
                fontSize: 10, opacity: 0.3, letterSpacing: 1, textAlign: 'right',
                lineHeight: 1.8,
            }}>
                <div>WASD — MOVE</div>
                <div>SPACE — FIRE</div>
                <div>SHIFT — DODGE</div>
                <div>R — POWER-UP</div>
            </div>

        </div>
    );
}