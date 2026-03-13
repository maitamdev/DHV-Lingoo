// Shows statistics about opened flashcards
'use client';

interface FlashcardStatsProps {
  totalOpened: number;
  totalXP: number;
  streakDays: number;
}

export default function FlashcardStats({ totalOpened, totalXP, streakDays }: FlashcardStatsProps) {
  const stats = [
    { label: 'Cards Today', value: totalOpened, icon: '🃏' },
    { label: 'XP Earned', value: `+${totalXP}`, icon: '⚡' },
    { label: 'Day Streak', value: streakDays, icon: '🔥' },
  ];

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '16px 0' }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', background: 'white', borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)', fontSize: 13, fontWeight: 700,
        }}>
          <span>{s.icon}</span>
          <span>{s.value}</span>
          <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: 11 }}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}
// Daily learning metrics
