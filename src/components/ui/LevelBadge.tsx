interface Props {
  level: string;
  size?: 'sm' | 'md';
}

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-gray-100 text-gray-700', A2: 'bg-green-100 text-green-700',
  B1: 'bg-blue-100 text-blue-700', B2: 'bg-purple-100 text-purple-700',
  C1: 'bg-amber-100 text-amber-700', C2: 'bg-red-100 text-red-700',
};

export default function LevelBadge({ level, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  const color = LEVEL_COLORS[level] || 'bg-gray-100 text-gray-700';
  return (
    <span className={'inline-flex items-center rounded-full font-bold ' + color + ' ' + sizeClass}>
      {level}
    </span>
  );
}