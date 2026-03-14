import { Zap } from 'lucide-react';

interface Props {
  amount: number;
  showPlus?: boolean;
  size?: 'sm' | 'md';
}

export default function XpBadge({ amount, showPlus = true, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={'inline-flex items-center gap-1 rounded-full font-bold bg-blue-100 text-blue-700 ' + sizeClass}>
      <Zap className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {showPlus && '+'}{amount} XP
    </span>
  );
}