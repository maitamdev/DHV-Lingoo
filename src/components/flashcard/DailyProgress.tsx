// Daily flashcard progress with cyberpunk stat cards
'use client';

import { CARDS_PER_DAY } from '@/lib/flashcard-config';

interface DailyProgressProps {
  opened: number;
  streakDays?: number;
  wordsLearned?: number;
  accuracy?: number;
}

export default function DailyProgress({ opened, streakDays = 0, wordsLearned = 0, accuracy = 0 }: DailyProgressProps) {
  const percentage = (opened / CARDS_PER_DAY) * 100;

  const stats = [
    { label: 'STREAK', value: `${streakDays}`, icon: '🌙' },
    { label: 'WORDS LEARNED', value: wordsLearned.toLocaleString(), icon: '📡' },
    { label: 'ACCURACY', value: `${accuracy}%`, icon: '◈' },
  ];

  return (
    <>
      {/* Stats Grid */}
      <div className="cyber-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="cyber-stat-card">
            <div className="cyber-stat-label">{stat.label}</div>
            <div className="cyber-stat-value">{stat.value}</div>
            <div className="cyber-stat-icon">{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Progress Section Title */}
      <div className="cyber-section-title">
        <h2>DAILY VOCABULARY MODULES</h2>
        <span className="cyber-section-subtitle">
          {opened === CARDS_PER_DAY
            ? 'ALL_MODULES_DECRYPTED'
            : `ENCRYPTED_FILES_AWAITING_DECODING`}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="flashcard-progress" role="progressbar" aria-valuenow={opened} aria-valuemin={0} aria-valuemax={CARDS_PER_DAY} aria-label={`${opened} of ${CARDS_PER_DAY} cards opened`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 11, fontWeight: 700, letterSpacing: '1px', fontFamily: 'var(--fc-font-mono)' }}>
          <span style={{ color: 'var(--fc-text-dim)' }}>
            {opened}/{CARDS_PER_DAY} MODULES DECODED
          </span>
          <span style={{ color: opened === CARDS_PER_DAY ? 'var(--fc-success)' : 'var(--fc-accent)' }}>
            {opened === CARDS_PER_DAY ? 'COMPLETE ✓' : `${CARDS_PER_DAY - opened} REMAINING`}
          </span>
        </div>
        <div className="flashcard-progress-bar">
          <div className="flashcard-progress-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </>
  );
}
// Decoded remaining count
