interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const roundedMap = { sm: '4px', md: '8px', lg: '16px', full: '9999px' };

export default function Skeleton({ width = '100%', height = 20, rounded = 'md', className = '' }: SkeletonProps) {
  return (
    <div
      className={'animate-pulse bg-gray-200 ' + className}
      style={{ width, height, borderRadius: roundedMap[rounded] }}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className='space-y-2'>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}