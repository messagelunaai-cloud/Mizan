import React, { useMemo } from 'react';

interface Piece {
  left: number;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
  color: string;
}

export default function ConfettiBurst() {
  const pieces = useMemo<Piece[]>(() => {
    const palette = ['#3dd98f', '#4cc9f0', '#f72585', '#fee440', '#e36414'];
    return Array.from({ length: 120 }, () => ({
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      duration: 2.5 + Math.random() * 1.8,
      rotation: Math.random() * 360,
      size: 6 + Math.random() * 8,
      color: palette[Math.floor(Math.random() * palette.length)]
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      <style>{`
        @keyframes confettiFall {
          0% { transform: translate3d(0, -10%, 0) rotate(0deg); opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translate3d(0, 110vh, 0) rotate(360deg); opacity: 0; }
        }
      `}</style>
      {pieces.map((piece, idx) => (
        <span
          key={idx}
          style={{
            position: 'absolute',
            top: '-20px',
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 0.35}px`,
            backgroundColor: piece.color,
            animation: `confettiFall ${piece.duration}s ease-out ${piece.delay}s forwards`,
            transform: `rotate(${piece.rotation}deg)`
          }}
        />
      ))}
    </div>
  );
}
