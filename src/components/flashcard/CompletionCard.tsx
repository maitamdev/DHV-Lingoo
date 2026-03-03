// Card shown when all daily flashcards are revealed
'use client';

interface CompletionCardProps {
  totalXP: number;
  rarities: Record<string, number>;
}

export default function CompletionCard({ totalXP, rarities }: CompletionCardProps) {
  return (
    <div style={{
      maxWidth: 400,
      margin: '32px auto',
      padding: 32,
      background: 'linear-gradient(135deg, #6366f1, #a855f7)',
      borderRadius: 20,
      textAlign: 'center',
      color: 'white',
      boxShadow: '0 20px 60px rgba(99, 102, 241, 0.3)',
    }}>
      <div style={{ fontSize: 48 }}>🎉</div>
      <h2 style={{ fontSize: 24, fontWeight: 900, marginTop: 12 }}>
        All Cards Revealed!
      </h2>
      <p style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
        Come back tomorrow for new cards
      </p>

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 16,
        marginTop: 24,
        fontSize: 13,
        fontWeight: 700,
      }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 10 }}>
          +{totalXP} XP
        </div>
        {Object.entries(rarities).map(([rarity, count]) => (
          count > 0 && (
            <div key={rarity} style={{ background: 'rgba(255,255,255,0.2)', padding: '8px 16px', borderRadius: 10 }}>
              {count}x {rarity}
            </div>
          )
        ))}
      </div>

      <p style={{ fontSize: 12, opacity: 0.6, marginTop: 20 }}>
        Daily streak bonus: +5 XP
      </p>
    </div>
  );
}
