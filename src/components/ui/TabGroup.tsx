'use client';

interface Tab { id: string; label: string; icon?: React.ReactNode; }

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function TabGroup({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div className='flex gap-1 bg-gray-100 p-1 rounded-xl'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ' +
            (activeTab === tab.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700')}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}