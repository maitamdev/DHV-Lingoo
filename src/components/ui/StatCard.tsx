interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isUp: boolean };
  bgColor?: string;
}

export default function StatCard({ icon, label, value, trend, bgColor = '#eff6ff' }: StatCardProps) {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: bgColor }}>
          {icon}
        </div>
        {trend && (
          <span className={'text-xs font-bold ' + (trend.isUp ? 'text-green-500' : 'text-red-500')}>
            {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className='text-2xl font-extrabold text-gray-900'>{value}</div>
      <div className='text-xs text-gray-500 mt-1'>{label}</div>
    </div>
  );
}