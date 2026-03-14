interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon = 'ðŸ“­', title, description, action }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='text-4xl mb-3'>{icon}</div>
      <h3 className='text-lg font-bold text-gray-800 mb-1'>{title}</h3>
      {description && <p className='text-sm text-gray-500 mb-4 max-w-xs'>{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors'
        >
          {action.label}
        </button>
      )}
    </div>
  );
}