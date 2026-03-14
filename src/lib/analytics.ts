/**
 * Analytics tracking utilities
 */
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event.name, event.properties);
  }
}

export function trackPageView(page: string): void {
  trackEvent({ name: 'page_view', properties: { page } });
}

export function trackPracticeComplete(mode: string, score: number, xp: number): void {
  trackEvent({
    name: 'practice_complete',
    properties: { mode, score, xp },
  });
}

export function trackAchievementUnlock(achievementId: string): void {
  trackEvent({ name: 'achievement_unlock', properties: { achievementId } });
}