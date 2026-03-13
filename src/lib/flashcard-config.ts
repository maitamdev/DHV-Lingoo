// Flashcard rarity and visual configuration

export const CARDS_PER_DAY = 5;

export const CARD_RARITIES = [
  { rarity: 'common', chance: 0.45, color: '#94a3b8', gradient: 'from-slate-400 to-slate-500', glow: 'shadow-slate-300', icon: '📘', label: 'Common' },
  { rarity: 'uncommon', chance: 0.25, color: '#22c55e', gradient: 'from-emerald-400 to-emerald-600', glow: 'shadow-emerald-300', icon: '📗', label: 'Uncommon' },
  { rarity: 'rare', chance: 0.15, color: '#3b82f6', gradient: 'from-blue-400 to-blue-600', glow: 'shadow-blue-300', icon: '📙', label: 'Rare' },
  { rarity: 'epic', chance: 0.10, color: '#a855f7', gradient: 'from-purple-400 to-purple-600', glow: 'shadow-purple-300', icon: '💎', label: 'Epic' },
  { rarity: 'legendary', chance: 0.05, color: '#f59e0b', gradient: 'from-amber-400 to-yellow-500', glow: 'shadow-amber-300', icon: '🌟', label: 'Legendary' },
] as const;

export const XP_PER_CARD: Record<string, number> = {
  common: 2,
  uncommon: 3,
  rare: 5,
  epic: 8,
  legendary: 15,
};

export const BAG_COLORS = [
  'from-indigo-500 to-purple-600',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-cyan-500 to-blue-600',
];
// Rarity gamification system
// XP scales with rarity
// Bag colors for variety
// Used by client and hook
// Achievement XP integration
