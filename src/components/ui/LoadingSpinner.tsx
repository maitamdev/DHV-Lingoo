'use client';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizes = { sm: 16, md: 24, lg: 40 };

export default function LoadingSpinner({ size = 'md', color = '#3b82f6' }: SpinnerProps) {
  const s = sizes[size];
  return (
    <div className='flex items-center justify-center'>
      <svg width={s} height={s} viewBox='0 0 24 24' fill='none' className='animate-spin'>
        <circle cx='12' cy='12' r='10' stroke={color} strokeWidth='3' strokeLinecap='round' opacity='0.25' />
        <path d='M12 2a10 10 0 0 1 10 10' stroke={color} strokeWidth='3' strokeLinecap='round' />
      </svg>
    </div>
  );
}