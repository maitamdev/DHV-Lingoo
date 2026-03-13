// Rarity badge with cyberpunk color coding
import { CARD_RARITIES } from '@/lib/flashcard-config';

interface RarityBadgeProps {
  rarity: string;
}

export default function RarityBadge({ rarity }: RarityBadgeProps) {
  const config = CARD_RARITIES.find(r => r.rarity === rarity) || CARD_RARITIES[0];

  return (
    <span className={`rarity-badge ${rarity}`}>
      {config.icon} {config.label}
    </span>
  );
}
// Semantic rarity colors
// New AI rarity tier
