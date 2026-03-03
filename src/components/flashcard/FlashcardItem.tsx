// Individual flashcard with flip animation - front shows word, back shows meaning
'use client';

import { useState } from 'react';
import RarityBadge from './RarityBadge';

interface FlashcardItemProps {
  word: string;
  meaning: string;
  phonetic: string | null;
  example: string | null;
  rarity: string;
  isNew: boolean;
}

export default function FlashcardItem({ word, meaning, phonetic, example, rarity, isNew }: FlashcardItemProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`flashcard rarity-${rarity} ${flipped ? 'flipped' : ''} ${isNew ? 'card-revealing' : ''}`}
      onClick={() => setFlipped(!flipped)} role="button" tabIndex={0} aria-label={flipped ? `Meaning: ${meaning}` : `Word: ${word}. Tap to flip.`} onKeyDown={(e) => e.key === "Enter" && setFlipped(!flipped)}
    >
      <div className="flashcard-inner">
        {/* Front - English word */}
        <div className="flashcard-front">
          <RarityBadge rarity={rarity} />
          <div style={{ fontSize: 28, fontWeight: 900, marginTop: 16, letterSpacing: '-0.5px', color: '#0f172a' }}>
            {word}
          </div>
          {phonetic && (
            <div style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>
              {phonetic}
            </div>
          )}
          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 'auto', fontWeight: 600 }}>
            TAP TO FLIP
          </div>
        </div>

        {/* Back - Vietnamese meaning */}
        <div className="flashcard-back">
          <RarityBadge rarity={rarity} />
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 16, color: '#0f172a', textAlign: 'center' }}>
            {meaning}
          </div>
          {example && (
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 12, textAlign: 'center', fontStyle: 'italic', padding: '0 8px' }}>
              &ldquo;{example}&rdquo;
            </div>
          )}
          <div style={{ fontSize: 11, color: '#cbd5e1', marginTop: 'auto', fontWeight: 600 }}>
            TAP TO FLIP BACK
          </div>
        </div>
      </div>
    </div>
  );
}

