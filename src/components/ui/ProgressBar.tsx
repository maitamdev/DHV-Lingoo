interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  height?: number;
}

export default function ProgressBar({
  value, max = 100, color = '#3b82f6', showLabel = false, height = 8,
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className='w-full'>
      {showLabel && (
        <div className='flex justify-between text-xs text-gray-500 mb-1'>
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className='w-full bg-gray-200 rounded-full overflow-hidden' style={{ height }}>
        <div
          className='h-full rounded-full transition-all duration-500 ease-out'
          style={{ width: pct + '%', backgroundColor: color }}
        />
      </div>
    </div>
  );
}