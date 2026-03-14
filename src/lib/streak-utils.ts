/**
 * Streak tracking and calculation utilities
 */
export function isStreakActive(lastActivity: string | null): boolean {
  if (!lastActivity) return false;
  const last = new Date(lastActivity);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours < 48;
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 365) return 'ðŸ’Ž';
  if (streak >= 100) return 'ðŸ”¥';
  if (streak >= 30) return 'âš¡';
  if (streak >= 7) return 'ðŸŒŸ';
  if (streak >= 3) return 'âœ¨';
  return 'ðŸŒ±';
}

export function getStreakMessage(streak: number): string {
  if (streak >= 100) return 'Huyen thoai! ' + streak + ' ngay lien tuc!';
  if (streak >= 30) return 'Tuyet voi! ' + streak + ' ngay streak!';
  if (streak >= 7) return 'Gioi lam! ' + streak + ' ngay lien tiep!';
  return 'Tiep tuc co gang! ' + streak + ' ngay';
}