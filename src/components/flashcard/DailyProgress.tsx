// Daily flashcard opening progress bar
'use client';

import { CARDS_PER_DAY } from '@/lib/flashcard-config';

interface DailyProgressProps {
  opened: number;
}

export default function DailyProgress({ opened }: DailyProgressProps) {
  const percentage = (opened / CARDS_PER_DAY) * 100;

  return (
    <div className="flashcard-progress">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 700 }}>
        <span style={{ color: '#64748b' }}>
          {opened}/{CARDS_PER_DAY} cards opened
        </span>
        <span style={{ color: opened === CARDS_PER_DAY ? '#10b981' : '#6366f1' }}>
          {opened === CARDS_PER_DAY ? 'All done! ✨' : `${CARDS_PER_DAY - opened} remaining`}
        </span>
      </div>
      <div className="flashcard-progress-bar">
        <div className="flashcard-progress-fill" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
