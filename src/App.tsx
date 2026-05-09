import './App.css'
import { useRef, useState, useEffect, useCallback } from 'react';
import type { GameState, HUDData, HUDState } from './game/types';
import { useGameLoop } from './hooks/useGameloop';
import { HUD } from './components/HUD';

function App() {
  // get the canvas element reference
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // HUD
  const [hudData, setHudData] = useState<HUDData>({
    health: 100,
    shield: 100,
    lives: 5,
    score: 0,
    dodgeCharges: 3,
    dodgeCooldown: 0,
    elapsedTime: 0,
    isGameOver: false,
    rapidFireActive: false,
    invincibilityActive: false,
  });

  const [hudState, setHudState] = useState<HUDState>({
    elapsedTime: 0,
  });

  const [showGameOver, setShowGameOver] = useState(false);

  const handleGameOver = useCallback(() => {
    setShowGameOver(true);
  }, []);

  const handleHUDUpdate = useCallback((data: HUDData) => {
    setHudData(data);
  }, []);

  const handleStateUpdate = useCallback((state: HUDState) => {
    setHudState(state);
  }, []);

  useGameLoop({
    canvasRef,
    onHUDUpdate: handleHUDUpdate,
    onStateUpdate: handleStateUpdate,
    onGameOver: handleGameOver,
  });



  // set internal resolution of canvas
  // This makes sure the game looks crisp on all screens and sizes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
    }

    resize();
    canvas.focus();

    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);

  }, []);
  // End set internal resolution of canvas

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* The canvas fills the screen. The game renders here. */}
      <canvas
        ref={canvasRef}
        tabIndex={0}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
      <HUD data={hudData} state={hudState} />
      {showGameOver && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            color: 'white',
            background: 'rgba(0, 0, 0, 0.45)',
            fontFamily: "'Courier New', monospace",
            letterSpacing: 4,
          }}
        >
          <div>GAME OVER</div>
        </div>
      )}
    </div>
  )
}

export default App
