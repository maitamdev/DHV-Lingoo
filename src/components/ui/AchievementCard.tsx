import { Trophy, Lock, Check } from 'lucide-react';

interface Props {
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  xpReward: number;
}

const rarityColors: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: '#f1f5f9', border: '#e2e8f0', text: '#64748b' },
  uncommon: { bg: '#d1fae5', border: '#a7f3d0', text: '#059669' },
  rare: { bg: '#dbeafe', border: '#93c5fd', text: '#2563eb' },
  epic: { bg: '#ede9fe', border: '#c4b5fd', text: '#7c3aed' },
  legendary: { bg: '#fef3c7', border: '#fcd34d', text: '#d97706' },
};

export default function AchievementCard({ name, description, icon, rarity, unlocked, xpReward }: Props) {
  const colors = rarityColors[rarity] || rarityColors.common;
  return (
    <div className={'relative border rounded-2xl p-4 transition ' + (unlocked ? 'hover:shadow-md' : 'opacity-60')}
      style={{ background: unlocked ? colors.bg : '#f8fafc', borderColor: colors.border }}>
      <div className='flex items-start gap-3'>
        <div className='text-2xl'>{icon}</div>
        <div className='flex-1'>
          <h4 className='text-sm font-bold' style={{ color: colors.text }}>{name}</h4>
          <p className='text-xs text-gray-500 mt-0.5'>{description}</p>
          <div className='flex items-center gap-2 mt-2'>
            <span className='text-[10px] font-bold uppercase tracking-wider' style={{ color: colors.text }}>{rarity}</span>
            <span className='text-[10px] text-gray-400'>+{xpReward} XP</span>
          </div>
        </div>
        <div className='w-6 h-6 flex items-center justify-center'>
          {unlocked ? <Check className='w-4 h-4 text-emerald-500' /> : <Lock className='w-4 h-4 text-gray-300' />}
        </div>
      </div>
    </div>
  );
}