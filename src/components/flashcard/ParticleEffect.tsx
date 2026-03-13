// Particle explosion effect when opening a mystery bag
'use client';

import { useMemo } from 'react';

interface ParticleEffectProps {
  color: string;
  count?: number;
}

export default function ParticleEffect({ color, count = 12 }: ParticleEffectProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * 360;
      const distance = 60 + Math.random() * 40;
      const px = Math.cos((angle * Math.PI) / 180) * distance;
      const py = Math.sin((angle * Math.PI) / 180) * distance;
      return { px, py, delay: Math.random() * 0.2, size: 4 + Math.random() * 6 };
    });
  }, [count]);

  return (
    <div className="particles">
      {particles.map((p, i) => (
        <div
          key={i}
          className="particle"
          style={{
            '--px': `${p.px}px`,
            '--py': `${p.py}px`,
            width: p.size,
            height: p.size,
            backgroundColor: color,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

// CSS vars for direction
// Achievement unlock particles
