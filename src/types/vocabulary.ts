export interface Vocabulary {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
  audio_url: string | null;
  lesson_id: string;
}

export interface VocabWithMastery extends Vocabulary {
  mastery: 'new' | 'learning' | 'mastered';
  reviewCount: number;
  lastReviewed: string | null;
}

export interface VocabSearchResult {
  word: string;
  meaning: string;
  matchType: 'exact' | 'partial' | 'fuzzy';
}