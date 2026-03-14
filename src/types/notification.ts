export type NotificationType = 'achievement' | 'xp' | 'streak' | 'lesson' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  streak_reminder: boolean;
  achievement_alerts: boolean;
  daily_summary: boolean;
}