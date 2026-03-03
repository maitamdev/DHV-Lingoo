// Rarity badge with color coding
import { CARD_RARITIES } from '@/lib/flashcard-config';

interface RarityBadgeProps {
  rarity: string;
}

export default function RarityBadge({ rarity }: RarityBadgeProps) {
  const config = CARD_RARITIES.find(r => r.rarity === rarity) || CARD_RARITIES[0];

  const bgColors: Record<string, string> = {
    common: 'bg-slate-100 text-slate-600',
    uncommon: 'bg-emerald-100 text-emerald-700',
    rare: 'bg-blue-100 text-blue-700',
    epic: 'bg-purple-100 text-purple-700',
    legendary: 'bg-amber-100 text-amber-700',
  };

  return (
    <span className={`rarity-badge ${rarity} ${bgColors[rarity] || bgColors.common}`}>
      {config.icon} {config.label}
    </span>
  );
}
