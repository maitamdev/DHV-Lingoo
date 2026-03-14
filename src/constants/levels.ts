export const LEVELS = [
  { value: 'A1', label: 'A1 - Vo long', description: 'Moi bat dau hoc', color: '#94a3b8', xpRange: [0, 500] },
  { value: 'A2', label: 'A2 - So cap', description: 'Giao tiep co ban', color: '#10b981', xpRange: [501, 2000] },
  { value: 'B1', label: 'B1 - Trung cap', description: 'Giao tiep kha', color: '#3b82f6', xpRange: [2001, 5000] },
  { value: 'B2', label: 'B2 - Tren trung cap', description: 'Thanh thao', color: '#8b5cf6', xpRange: [5001, 10000] },
  { value: 'C1', label: 'C1 - Cao cap', description: 'Gan ban ngu', color: '#f59e0b', xpRange: [10001, 20000] },
  { value: 'C2', label: 'C2 - Thanh thao', description: 'Nhu ban ngu', color: '#ef4444', xpRange: [20001, Infinity] },
] as const;

export type LevelCode = typeof LEVELS[number]['value'];

export function getLevelByXp(xp: number): typeof LEVELS[number] {
  return LEVELS.find(l => xp >= l.xpRange[0] && xp <= l.xpRange[1]) || LEVELS[0];
}

export function getLevelColor(level: string): string {
  return LEVELS.find(l => l.value === level)?.color || '#94a3b8';
}