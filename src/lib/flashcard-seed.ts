// Deterministic random number generator using seed
// Ensures same user gets same cards on same day

export function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export function getDailySeed(userId: string, date: string): number {
  return hashSeed(userId + ':' + date);
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function pickRandomItems<T>(items: T[], count: number, rng: () => number): T[] {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

export function getCardRarity(rng: () => number): string {
  const roll = rng();
  if (roll < 0.05) return 'legendary';
  if (roll < 0.15) return 'epic';
  if (roll < 0.30) return 'rare';
  if (roll < 0.55) return 'uncommon';
  return 'common';
}
// Deterministic card selection
// Uniform hash distribution
// Daily seed = userId + date
// Deterministic module
