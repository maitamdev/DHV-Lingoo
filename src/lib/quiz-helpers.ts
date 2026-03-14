/**
 * Quiz generation and scoring helpers
 */
export function generateOptions<T>(correct: T, pool: T[], count: number = 3): T[] {
  const wrong = pool.filter((item) => item !== correct);
  const shuffled = [...wrong].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  const options = [...selected, correct];
  return options.sort(() => Math.random() - 0.5);
}

export function calculateGrade(score: number): { grade: string; label: string; color: string } {
  if (score >= 90) return { grade: 'A+', label: 'Xuat sac', color: '#10b981' };
  if (score >= 80) return { grade: 'A', label: 'Gioi', color: '#3b82f6' };
  if (score >= 70) return { grade: 'B', label: 'Kha', color: '#8b5cf6' };
  if (score >= 60) return { grade: 'C', label: 'Trung binh', color: '#f59e0b' };
  return { grade: 'D', label: 'Can cai thien', color: '#ef4444' };
}

export function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}