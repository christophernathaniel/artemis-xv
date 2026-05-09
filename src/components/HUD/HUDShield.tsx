import { useEffect, useState, useRef } from 'react';

const SHIELD_ALERT_THRESHOLD = 33;

type ShieldSoundState = 'none' | 'low' | 'critical' | 'regenerating';

export function HUDShield({ shield }: { shield: number }) {
    const [displayShield, setDisplayShield] = useState(shield);

    const previousShieldRef = useRef(shield);
    const soundStateRef = useRef<ShieldSoundState>('none');
    const isPlayingRef = useRef(false);

    if (shield !== displayShield) {
        setDisplayShield(shield);
    }


    useEffect(() => {

        let nextSoundState: ShieldSoundState = 'none';


        if (shield > previousShieldRef.current) {
            console.log('Shield is regenerating');
        }


        // if (shield > previousShieldRef.current) {
        //     if (!isPlayingRef.current) console.log('Shield is regenerating');
        //     nextSoundState = 'regenerating';
        //     isPlayingRef.current = true;

        // } else if (shield <= 1) {
        //     if (nextSoundState !== soundStateRef.current) {
        //         isPlayingRef.current = false;
        //     }

        //     if (!isPlayingRef.current) console.log('Shield is critical');
        //     nextSoundState = 'critical';
        //     isPlayingRef.current = true;

        // } else if (shield < SHIELD_ALERT_THRESHOLD) {
        //     if (nextSoundState !== soundStateRef.current) {
        //         isPlayingRef.current = false;
        //     }

        //     if (!isPlayingRef.current) console.log('Shield is low');
        //     nextSoundState = 'low';
        //     isPlayingRef.current = true;
        // }

        // if (nextSoundState !== soundStateRef.current) {
        //     soundStateRef.current = nextSoundState;
        // }

        previousShieldRef.current = shield; // continiousl update prevous shield

    }, [shield]);


    return (
        <>
            <div>{soundStateRef.current}</div>
            <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '24px',
                color: 'white'
            }}>
                <div style={{
                    display: 'flex',
                    width: '300px',
                    height: '14px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                }}>
                    {displayShield < SHIELD_ALERT_THRESHOLD && (
                        <div style={{
                            width: `${displayShield}%`,
                            display: 'flex',
                            height: '14px',
                            background: '#ffffff',
                            transition: 'width 0.3s ease',
                            animation: 'pulse 1.5s infinite',
                        }}
                        ></div>
                    )}

                    {displayShield >= SHIELD_ALERT_THRESHOLD && (
                        <div style={{
                            width: `${displayShield}%`,
                            display: 'flex',
                            height: '14px',
                            background: '#ffffff',
                            transition: 'width 0.3s ease',


                        }}
                        ></div>
                    )}
                </div>
            </div>
        </>
    );
}