// Card shown when all daily flashcards are revealed - Cyberpunk theme
'use client';

interface CompletionCardProps {
  totalXP: number;
  rarities: Record<string, number>;
}

export default function CompletionCard({ totalXP, rarities }: CompletionCardProps) {
  return (
    <div className="cyber-completion">
      <div className="cyber-completion-icon">⚡</div>
      <h2>MISSION COMPLETE</h2>
      <p className="cyber-completion-sub">
        ALL MODULES SUCCESSFULLY DECRYPTED
      </p>

      <div className="cyber-completion-stats">
        <div className="cyber-completion-stat">
          +{totalXP} XP
        </div>
        {Object.entries(rarities).map(([rarity, count]) => (
          count > 0 && (
            <div key={rarity} className="cyber-completion-stat">
              {count}x {rarity.toUpperCase()}
            </div>
          )
        ))}
      </div>

      <p className="cyber-completion-bonus">
        DAILY_STREAK_BONUS: +5 XP — RETURN TOMORROW FOR NEW MODULES
      </p>
    </div>
  );
}
// Mission completion UX
