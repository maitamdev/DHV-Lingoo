'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
  isOpen, title, message, onConfirm, onCancel,
  confirmLabel = 'Xac nhan', cancelLabel = 'Huy', variant = 'default',
}: ConfirmDialogProps) {
  if (!isOpen) return null;
  const btnColor = variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' onClick={onCancel}>
      <div className='bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl' onClick={(e) => e.stopPropagation()}>
        <h3 className='text-lg font-bold text-gray-900 mb-2'>{title}</h3>
        <p className='text-sm text-gray-600 mb-6'>{message}</p>
        <div className='flex gap-3 justify-end'>
          <button onClick={onCancel} className='px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg'>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={'px-4 py-2 text-sm font-medium text-white rounded-lg ' + btnColor}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}