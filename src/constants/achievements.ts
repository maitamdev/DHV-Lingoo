export const RARITY_COLORS = {
  common: { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' },
  uncommon: { bg: '#d1fae5', text: '#059669', border: '#a7f3d0' },
  rare: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  epic: { bg: '#ede9fe', text: '#7c3aed', border: '#c4b5fd' },
  legendary: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
} as const;

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'streak', label: 'Streak', icon: 'ðŸ”¥' },
  { id: 'lesson', label: 'Bai hoc', icon: 'ðŸ“š' },
  { id: 'vocabulary', label: 'Tu vung', icon: 'ðŸ“' },
  { id: 'xp', label: 'Diem XP', icon: 'âš¡' },
  { id: 'perfect', label: 'Hoan hao', icon: 'â­' },
  { id: 'social', label: 'Cong dong', icon: 'ðŸ¤' },
] as const;