// Mystery bag - unopened flashcard with cyberpunk DECRYPT style
'use client';

import { useState } from 'react';
import ParticleEffect from './ParticleEffect';

interface MysteryBagProps {
  index: number;
  gradient: string;
  onOpen: () => void;
  isOpened: boolean;
}

export default function MysteryBag({ index, onOpen, isOpened }: MysteryBagProps) {
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
    <div
      className={`mystery-bag ${isOpening ? 'bag-opening' : ''}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`Decrypt module ${index + 1}`}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      {showParticles && <ParticleEffect color="#00f0ff" count={16} />}
      <div className="bag-inner">
        <div className="bag-number">NODE_{String(index + 1).padStart(2, '0')}</div>
        <span className="bag-encrypted-label">ENCRYPTED</span>
        <div className="bag-icon">🔒</div>
        <div className="bag-label">DECRYPT</div>
      </div>
    </div>
  );
}
// 3D perspective hover
// Scale up then collapse
// Achievement: unlock on first bag open
