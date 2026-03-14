"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Check, X, ArrowRight, RotateCcw } from "lucide-react";

interface Vocabulary {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
}

interface VocabQuizProps {
  vocabularies: Vocabulary[];
  onComplete: (result: {
    total: number;
    correct: number;
    wrong: number;
    xpEarned: number;
    answers: { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[];
  }) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function VocabQuiz({ vocabularies, onComplete }: VocabQuizProps) {
  const TOTAL_QUESTIONS = Math.min(10, vocabularies.length);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<
    { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[]
  >([]);

  const questions = useMemo(() => {
    const shuffled = shuffleArray(vocabularies);
    return shuffled.slice(0, TOTAL_QUESTIONS).map((vocab) => {
      const wrongOptions = shuffleArray(
        vocabularies.filter((v) => v.id !== vocab.id)
      )
        .slice(0, 3)
        .map((v) => v.meaning);

      const options = shuffleArray([vocab.meaning, ...wrongOptions]);
      return { vocab, options, correctAnswer: vocab.meaning };
    });
  }, [vocabularies, TOTAL_QUESTIONS]);

  const current = questions[currentIndex];
  if (!current) return null;

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelected(option);
    setIsAnswered(true);
    const isCorrect = option === current.correctAnswer;
    if (isCorrect) setCorrectCount((c) => c + 1);
    setAnswers((prev) => [
      ...prev,
      {
        question: current.vocab.word,
        userAnswer: option,
        correctAnswer: current.correctAnswer,
        isCorrect,
      },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= TOTAL_QUESTIONS) {
      const finalCorrect = correctCount;
      const xp = finalCorrect * 5;
      onComplete({
        total: TOTAL_QUESTIONS,
        correct: finalCorrect,
        wrong: TOTAL_QUESTIONS - finalCorrect,
        xpEarned: xp,
        answers,
      });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelected(null);
    setIsAnswered(false);
  };

  const progress = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;

  return (
    <div className="animate-slide-up">
      <div className="practice-score-bar">
        <span>CÃ¢u {currentIndex + 1}/{TOTAL_QUESTIONS}</span>
        <span className="score">
          <Check className="w-4 h-4 inline text-green-500" /> {correctCount} Ä‘Ãºng
        </span>
      </div>
      <div className="practice-progress">
        <div className="practice-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="practice-card">
        <div className="question-number">Tráº¯c nghiá»‡m tá»« vá»±ng</div>
        <div className="question-text">
          &ldquo;{current.vocab.word}&rdquo;
          {current.vocab.phonetic && (
            <span className="block text-sm font-normal text-gray-400 mt-1">
              {current.vocab.phonetic}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4">Chá»n nghÄ©a Ä‘Ãºng:</p>

        <div className="options-grid">
          {current.options.map((opt, i) => {
            let cls = "option-btn";
            if (isAnswered) {
              cls += " disabled";
              if (opt === current.correctAnswer) cls += " correct";
              else if (opt === selected) cls += " wrong";
            }
            return (
              <button key={i} className={cls} onClick={() => handleSelect(opt)}>
                <span className="font-bold mr-2 text-gray-400">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div className="mt-6 flex justify-between items-center animate-fade-in">
            <span className={`text-sm font-bold ${selected === current.correctAnswer ? "text-green-600" : "text-red-600"}`}>
              {selected === current.correctAnswer ? "âœ“ ChÃ­nh xÃ¡c!" : `âœ— ÄÃ¡p Ã¡n: ${current.correctAnswer}`}
            </span>
            <button className="practice-btn practice-btn-primary" onClick={handleNext}>
              {currentIndex + 1 >= TOTAL_QUESTIONS ? "Xem káº¿t quáº£" : "Tiáº¿p theo"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// Shuffle uses Fisher-Yates algorithm for true randomness
