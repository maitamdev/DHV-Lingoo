// Shows all cards revealed today in a mini gallery
'use client';

import RarityBadge from './RarityBadge';

interface CardCollectionProps {
  cards: { word: string; meaning: string; rarity: string }[];
}

export default function CardCollection({ cards }: CardCollectionProps) {
  if (cards.length === 0) return null;

  return (
    <div style={{ maxWidth: 900, margin: '24px auto', padding: '0 20px' }}>
      <h3 style={{ fontSize: 14, fontWeight: 800, color: '#64748b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        Today&apos;s Collection
      </h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {cards.map((card, i) => (
          <div key={i} style={{
            padding: '8px 14px', background: 'white', borderRadius: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)', fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontWeight: 700 }}>{card.word}</span>
            <span style={{ color: '#94a3b8' }}>{card.meaning}</span>
            <RarityBadge rarity={card.rarity} />
          </div>
        ))}
      </div>
    </div>
  );
}
// Revealed cards gallery
