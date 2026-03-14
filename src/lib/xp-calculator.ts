/**
 * XP and leveling system calculations
 */
export const XP_PER_LEVEL = 500;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
}

export function levelProgress(xp: number): number {
  return ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
}

export function xpForAction(action: 'quiz' | 'fillblank' | 'listening' | 'lesson' | 'streak'): number {
  const rewards: Record<string, number> = {
    quiz: 5,
    fillblank: 7,
    listening: 10,
    lesson: 25,
    streak: 15,
  };
  return rewards[action] || 0;
}