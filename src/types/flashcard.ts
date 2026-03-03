// Flashcard type definitions for daily mystery bag feature

export interface FlashcardWord {
  id: string;
  word: string;
  meaning: string;
  phonetic: string | null;
  example: string | null;
  lesson_id: string;
}

export interface DailyFlashcard extends FlashcardWord {
  isRevealed: boolean;
  cardIndex: number;
}

export interface DailyFlashcardResponse {
  cards: FlashcardWord[];
  date: string;
  userId: string;
  revealedCount: number;
}

export interface FlashcardProgress {
  userId: string;
  date: string;
  revealedCards: number[];
  completedAt?: string;
}

export type CardRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface CardMeta {
  rarity: CardRarity;
  color: string;
  gradient: string;
  glow: string;
  icon: string;
}
