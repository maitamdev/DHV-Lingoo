export const TABLES = {
  PROFILES: 'profiles',
  COURSES: 'courses',
  LESSONS: 'lessons',
  LESSON_VOCABULARIES: 'lesson_vocabularies',
  LESSON_PROGRESS: 'lesson_progress',
  USER_ACHIEVEMENTS: 'user_achievements',
  CHAT_MESSAGES: 'chat_messages',
  DAILY_FLASHCARDS: 'daily_flashcards',
} as const;

export type TableName = typeof TABLES[keyof typeof TABLES];