export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COURSES: '/dashboard/courses',
  FLASHCARDS: '/dashboard/flashcards',
  PRACTICE: '/dashboard/practice',
  REVIEW: '/dashboard/review',
  VOCABULARY: '/dashboard/vocabulary',
  DICTIONARY: '/dashboard/dictionary',
  CHAT: '/dashboard/chat',
  ACHIEVEMENTS: '/dashboard/achievements',
  LEADERBOARD: '/dashboard/leaderboard',
  PLANNER: '/dashboard/planner',
  PROFILE: '/dashboard/profile',
  SETTINGS: '/dashboard/settings',
} as const;

export const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.REGISTER];