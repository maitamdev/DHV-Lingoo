// Mystery bag - unopened flashcard with tap to reveal
'use client';

import { useState } from 'react';
import ParticleEffect from './ParticleEffect';

interface MysteryBagProps {
  index: number;
  gradient: string;
  onOpen: () => void;
  isOpened: boolean;
}

export default function MysteryBag({ index, gradient, onOpen, isOpened }: MysteryBagProps) {
  const [isOpening, setIsOpening] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  if (isOpened) return null;

  const handleClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    setShowParticles(true);

    setTimeout(() => {
      onOpen();
    }, 700);
  };

  return (
    <div className={`mystery-bag ${isOpening ? 'bag-opening' : ''}`} onClick={handleClick} role="button" tabIndex={0} aria-label={`Open mystery bag ${index + 1}`} onKeyDown={(e) => e.key === "Enter" && handleClick()}>
      {showParticles && <ParticleEffect color="#fff" count={16} />}
      <div className={`bag-inner bg-gradient-to-br ${gradient}`}>
        <div className="bag-number">{index + 1}</div>
        <div className="bag-icon">🎁</div>
        <div className="bag-label">Tap to open</div>
      </div>
    </div>
  );
}

