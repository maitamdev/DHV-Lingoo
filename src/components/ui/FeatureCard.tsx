interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  color?: string;
}

export default function FeatureCard({ icon, title, description, href, color = '#3b82f6' }: Props) {
  const Wrapper = href ? 'a' : 'div';
  return (
    <Wrapper
      href={href}
      className='block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer'
    >
      <div className='w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110'
        style={{ background: color + '15', color }}>
        {icon}
      </div>
      <h3 className='text-sm font-bold text-gray-900 mb-1'>{title}</h3>
      <p className='text-xs text-gray-500 leading-relaxed'>{description}</p>
    </Wrapper>
  );
}