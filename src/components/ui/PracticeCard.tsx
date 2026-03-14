import { Brain, PenLine, Headphones, ChevronRight } from 'lucide-react';

interface Props {
  mode: 'vocab' | 'fillblank' | 'listening';
  title: string;
  description: string;
  xpPerQuestion: number;
  totalQuestions: number;
  onClick: () => void;
}

const icons = { vocab: Brain, fillblank: PenLine, listening: Headphones };
const colors = { vocab: '#3b82f6', fillblank: '#8b5cf6', listening: '#06b6d4' };

export default function PracticeCard({ mode, title, description, xpPerQuestion, totalQuestions, onClick }: Props) {
  const Icon = icons[mode];
  const color = colors[mode];

  return (
    <button onClick={onClick}
      className='w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all group'>
      <div className='flex items-start gap-4'>
        <div className='w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0'
          style={{ background: color + '15' }}>
          <Icon className='w-5 h-5' style={{ color }} />
        </div>
        <div className='flex-1'>
          <h3 className='text-sm font-bold text-gray-900 mb-0.5'>{title}</h3>
          <p className='text-xs text-gray-500'>{description}</p>
          <div className='flex items-center gap-3 mt-2 text-[11px] text-gray-400'>
            <span>+{xpPerQuestion} XP/cau</span>
            <span>{totalQuestions} cau</span>
          </div>
        </div>
        <ChevronRight className='w-5 h-5 text-gray-300 group-hover:text-blue-500 transition mt-1' />
      </div>
    </button>
  );
}