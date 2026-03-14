import { Flame } from 'lucide-react';

interface Props {
  days: number;
  size?: 'sm' | 'md';
}

export default function StreakBadge({ days, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  const color = days >= 30 ? 'bg-red-100 text-red-700' : days >= 7 ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700';
  return (
    <span className={'inline-flex items-center gap-1 rounded-full font-bold ' + color + ' ' + sizeClass}>
      <Flame className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {days} ngay
    </span>
  );
}