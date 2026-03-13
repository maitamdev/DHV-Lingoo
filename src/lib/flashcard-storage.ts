import { FLASHCARD_STORAGE_PREFIX } from './flashcard-constants';
export function getStorageKey(userId: string, date: string) { return FLASHCARD_STORAGE_PREFIX+userId+'_'+date; }
export function saveRevealedState(userId: string, date: string, revealed: boolean[]) { localStorage.setItem(getStorageKey(userId, date), JSON.stringify(revealed)); }
export function loadRevealedState(userId: string, date: string) { const s = localStorage.getItem(getStorageKey(userId, date)); return s ? JSON.parse(s) : null; }
export function clearOldData(userId: string, currentDate: string) { Object.keys(localStorage).filter(k => k.startsWith(FLASHCARD_STORAGE_PREFIX+userId) && !k.endsWith(currentDate)).forEach(k => localStorage.removeItem(k)); }
// Offline-first persistence
