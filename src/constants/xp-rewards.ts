export const XP_REWARDS = {
  LESSON_COMPLETE: 25,
  QUIZ_CORRECT: 5,
  FILLBLANK_CORRECT: 7,
  LISTENING_CORRECT: 10,
  STREAK_BONUS: 15,
  DAILY_LOGIN: 5,
  FLASHCARD_REVEAL: 2,
  PERFECT_SCORE: 50,
  ACHIEVEMENT_UNLOCK: 20,
  FIRST_LESSON: 100,
} as const;

export const STREAK_BONUSES = [
  { days: 3, multiplier: 1.1, label: '3 ngay +10%' },
  { days: 7, multiplier: 1.25, label: '7 ngay +25%' },
  { days: 14, multiplier: 1.5, label: '14 ngay +50%' },
  { days: 30, multiplier: 2.0, label: '30 ngay x2' },
  { days: 100, multiplier: 3.0, label: '100 ngay x3' },
] as const;

export function getStreakMultiplier(streak: number): number {
  const bonus = [...STREAK_BONUSES].reverse().find(b => streak >= b.days);
  return bonus?.multiplier || 1.0;
}