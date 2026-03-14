export const PRACTICE_MODES = [
  { id: 'vocab', label: 'Tu vung', icon: 'ðŸ“', xpPerQuestion: 5, description: 'Chon nghia dung' },
  { id: 'fillblank', label: 'Dien tu', icon: 'âœï¸', xpPerQuestion: 7, description: 'Dien tu vao cho trong' },
  { id: 'listening', label: 'Nghe', icon: 'ðŸŽ§', xpPerQuestion: 10, description: 'Nghe va viet lai' },
] as const;

export const GRADE_TIERS = [
  { min: 90, grade: 'A+', label: 'Xuat sac', emoji: 'ðŸ†', color: '#10b981' },
  { min: 80, grade: 'A', label: 'Gioi', emoji: 'ðŸŒŸ', color: '#3b82f6' },
  { min: 70, grade: 'B', label: 'Kha', emoji: 'ðŸ‘', color: '#8b5cf6' },
  { min: 60, grade: 'C', label: 'Trung binh', emoji: 'ðŸ“š', color: '#f59e0b' },
  { min: 0, grade: 'D', label: 'Can co gang', emoji: 'ðŸ’ª', color: '#ef4444' },
] as const;

export function getGrade(score: number) {
  return GRADE_TIERS.find(t => score >= t.min) || GRADE_TIERS[GRADE_TIERS.length - 1];
}