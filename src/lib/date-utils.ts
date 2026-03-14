/**
 * Date utility functions for DHV-Lingoo
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'vua xong';
  if (diff < 3600) return Math.floor(diff / 60) + ' phut truoc';
  if (diff < 86400) return Math.floor(diff / 3600) + ' gio truoc';
  return Math.floor(diff / 86400) + ' ngay truoc';
}