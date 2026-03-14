export type PracticeMode = 'vocab' | 'fillblank' | 'listening';

export interface PracticeQuestion {
  id: string;
  word: string;
  correct: string;
  options: string[];
  type: PracticeMode;
}

export interface PracticeResult {
  mode: PracticeMode;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  xpEarned: number;
  answers: PracticeAnswer[];
}

export interface PracticeAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}