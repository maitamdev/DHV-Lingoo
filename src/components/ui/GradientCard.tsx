interface Props {
  gradient?: string;
  children: React.ReactNode;
  className?: string;
}

const GRADIENTS: Record<string, string> = {
  blue: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  purple: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  emerald: 'linear-gradient(135deg, #10b981, #059669)',
  amber: 'linear-gradient(135deg, #f59e0b, #d97706)',
  rose: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  cyan: 'linear-gradient(135deg, #06b6d4, #0891b2)',
};

export default function GradientCard({ gradient = 'blue', children, className = '' }: Props) {
  const bg = GRADIENTS[gradient] || GRADIENTS.blue;
  return (
    <div className={'rounded-2xl p-6 text-white relative overflow-hidden ' + className} style={{ background: bg }}>
      <div className='absolute top-[-30%] right-[-15%] w-[200px] h-[200px] rounded-full' style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className='relative z-10'>{children}</div>
    </div>
  );
}