// Individual flashcard with flip animation - Cyberpunk theme
'use client';

import { useState } from 'react';
import RarityBadge from './RarityBadge';

const CARD_ICONS: Record<string, string> = {
  common: '⬡',
  uncommon: '◈',
  rare: '⬢',
  epic: '◇',
  legendary: '✦',
};

interface FlashcardItemProps {
  word: string;
  meaning: string;
  phonetic: string | null;
  example: string | null;
  rarity: string;
  isNew: boolean;
  index?: number;
}

export default function FlashcardItem({ word, meaning, phonetic, example, rarity, isNew, index = 0 }: FlashcardItemProps) {
  const [flipped, setFlipped] = useState(false);

  const cardNumber = `CARD_${String(index + 1).padStart(2, '0')}`;
  const icon = CARD_ICONS[rarity] || CARD_ICONS.common;

  return (
    <div
      className={`flashcard rarity-${rarity} ${flipped ? 'flipped' : ''} ${isNew ? 'card-revealing' : ''}`}
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      aria-label={flipped ? `Meaning: ${meaning}` : `Word: ${word}. Tap to flip.`}
      onKeyDown={(e) => e.key === "Enter" && setFlipped(!flipped)}
    >
      <div className="flashcard-inner">
        {/* Front - English word */}
        <div className="flashcard-front">
          <RarityBadge rarity={rarity} />
          <div className="cyber-card-icon">{icon}</div>
          <div className="cyber-card-number">{cardNumber}</div>
          <div className="cyber-card-word">{word}</div>
          {phonetic && (
            <div className="cyber-card-phonetic">{phonetic}</div>
          )}
          <div className="cyber-flip-btn">FLIP CARD</div>
        </div>

        {/* Back - Vietnamese meaning */}
        <div className="flashcard-back">
          <RarityBadge rarity={rarity} />
          <div className="cyber-card-number">{cardNumber}</div>
          <div className="cyber-card-meaning">{meaning}</div>
          {example && (
            <div className="cyber-card-example">
              &ldquo;{example}&rdquo;
            </div>
          )}
          <div className="cyber-flip-btn">FLIP BACK</div>
        </div>
      </div>
    </div>
  );
}
// Backface-visibility flip
// Absolute badge position
// Difficulty badge for AI cards
// Practiced indicator on flashcard items
