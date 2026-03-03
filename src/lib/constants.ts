// Application constants and configuration values

export const APP_NAME = 'DHV-Lingoo';
export const APP_DESCRIPTION = 'Nền tảng học tiếng Anh hiện đại';
export const APP_URL = 'https://dhv-lingoo.vercel.app';

// XP Constants
export const XP_PER_LESSON = 10;
export const XP_PER_VOCAB = 2;
export const XP_PER_QUIZ = 5;
export const XP_STREAK_BONUS = 10;

// Level thresholds
export const LEVELS = {
    A1: { min: 0, max: 500, label: 'Beginner' },
    A2: { min: 501, max: 1500, label: 'Elementary' },
    B1: { min: 1501, max: 3000, label: 'Intermediate' },
    B2: { min: 3001, max: 5000, label: 'Upper Intermediate' },
    C1: { min: 5001, max: 8000, label: 'Advanced' },
    C2: { min: 8001, max: Infinity, label: 'Proficiency' },
} as const;

// Level colors
export const LEVEL_COLORS: Record<string, { bg: string; text: string; gradient: string }> = {
    A1: { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-500 to-emerald-600' },
    A2: { bg: 'bg-blue-100', text: 'text-blue-700', gradient: 'from-blue-500 to-blue-600' },
    B1: { bg: 'bg-violet-100', text: 'text-violet-700', gradient: 'from-violet-500 to-violet-600' },
    B2: { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-500 to-amber-600' },
    C1: { bg: 'bg-red-100', text: 'text-red-700', gradient: 'from-red-500 to-red-600' },
    C2: { bg: 'bg-gray-100', text: 'text-gray-700', gradient: 'from-gray-800 to-gray-900' },
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// API timeouts
export const API_TIMEOUT_MS = 30000;
export const DICTIONARY_API_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en';
