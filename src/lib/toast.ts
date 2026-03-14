/**
 * Simple toast notification system
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

let toastId = 0;

export function createToast(type: ToastType, message: string, duration = 3000): Toast {
  return {
    id: 'toast-' + (++toastId),
    type,
    message,
    duration,
  };
}

export function getToastIcon(type: ToastType): string {
  switch (type) {
    case 'success': return 'âœ“';
    case 'error': return 'âœ—';
    case 'warning': return 'âš ';
    case 'info': return 'â„¹';
  }
}

export function getToastColor(type: ToastType): string {
  switch (type) {
    case 'success': return '#10b981';
    case 'error': return '#ef4444';
    case 'warning': return '#f59e0b';
    case 'info': return '#3b82f6';
  }
}