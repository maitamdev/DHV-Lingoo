import { XP_PER_CARD, CARD_RARITIES } from './flashcard-config';
export function calculateTotalXP(rarities: string[]) { return rarities.reduce((s, r) => s + (XP_PER_CARD[r] || 2), 0); }
export function getRarityConfig(rarity: string) { return CARD_RARITIES.find(r => r.rarity === rarity) || CARD_RARITIES[0]; }
export function formatXP(xp: number) { return xp >= 1000 ? (xp/1000).toFixed(1)+'k' : String(xp); }
export function getStreakEmoji(s: number) { if (s>=30) return 'trophy'; if (s>=14) return 'diamond'; if (s>=7) return 'fire'; return 'star'; }
// Data transform utilities
