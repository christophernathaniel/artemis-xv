

export function HUDScore({ score }: { score: number }) {
    return (
        <div style={{
            position: 'absolute',
            top: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '24px',
            color: 'white'
        }}>
            Score : {score}
        </div>
    );
}