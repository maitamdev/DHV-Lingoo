interface Props {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
}

export default function CircularProgress({ value, max = 100, size = 60, strokeWidth = 5, color = '#3b82f6', showLabel = true }: Props) {
  const pct = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className='relative inline-flex items-center justify-center' style={{ width: size, height: size }}>
      <svg width={size} height={size} className='-rotate-90'>
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} stroke='#e5e7eb' fill='none' />
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} stroke={color} fill='none'
          strokeLinecap='round' strokeDasharray={circumference} strokeDashoffset={offset}
          className='transition-all duration-500' />
      </svg>
      {showLabel && (
        <span className='absolute text-xs font-bold text-gray-700'>{Math.round(pct)}%</span>
      )}
    </div>
  );
}