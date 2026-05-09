import { useRef, useState } from 'react';

import heart from './assets/heart.svg';

export function HUDLives({ lives }: { lives: number }) {
    const [displayLives, setDisplayLives] = useState(lives);
    const HEART_SIZE = 20;

    if (lives !== displayLives) {
        setDisplayLives(lives);
    }

    return (
        <div style={{
            position: 'absolute',
            top: '60px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            color: 'white'
        }}>
            <div style={{
                display: 'flex',
                height: `${HEART_SIZE}px`,
                overflow: 'hidden',
                gap: '4px',
            }}>
                {Array.from({ length: displayLives }, (_, i) => (
                    <span key={i} style={{
                        width: `${HEART_SIZE}px`,
                        display: 'flex',
                        height: `${HEART_SIZE}px`,
                        // background: 'rgba(255, 255, 255, 0.8)',
                        borderRadius: '5px',
                        overflow: 'hidden',
                    }}>
                        <img src={heart} alt="heart" style={{ width: `${HEART_SIZE}px`, height: `${HEART_SIZE}px` }} />
                    </span>
                ))}
            </div>
        </div>
    );
}