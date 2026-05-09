import { useRef, useState } from 'react';


export function HUDHealth({ health }: { health: number }) {
    const [displayHealth, setDisplayHealth] = useState(health);
    const [totalHealth, setTotalHealth] = useState(health);


    if (health !== displayHealth) {
        setDisplayHealth(health);
    }

    return (
        <div style={{
            position: 'absolute',
            top: '38px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            color: 'white',

        }}>
            <div style={{
                display: 'flex',
                width: '200px',
                height: '5px',
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '3px',
                overflow: 'hidden',
            }}>
                {Array.from({ length: displayHealth }, (_, i) => (
                    <span key={i} style={{
                        width: 100 / totalHealth + '%',
                        display: 'flex',
                        height: '10px',
                        background: displayHealth < (totalHealth / 3) ? 'rgba(255, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                    }}></span>
                ))}
            </div>
        </div>
    );
}