/**
 * Notification creation helpers
 */
export type NotificationType = 'achievement' | 'xp' | 'streak' | 'lesson' | 'system';

export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
}

let notifId = 0;

export function createNotification(type: NotificationType, title: string, message: string) {
  return {
    id: 'notif-' + (++notifId) + '-' + Date.now(),
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export function achievementNotification(name: string, xp: number) {
  return createNotification('achievement', 'Mo khoa thanh tuu!', name + ' - Nhan ' + xp + ' XP');
}

export function streakNotification(days: number) {
  return createNotification('streak', 'Streak ' + days + ' ngay!', 'Tiep tuc hoc moi ngay de duy tri streak');
}

export function xpNotification(amount: number, source: string) {
  return createNotification('xp', '+' + amount + ' XP', 'Nhan tu ' + source);
}

export function lessonNotification(lessonName: string) {
  return createNotification('lesson', 'Hoan thanh bai hoc!', lessonName);
}