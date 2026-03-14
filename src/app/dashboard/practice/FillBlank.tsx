"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Check, ArrowRight, Lightbulb, Eye } from "lucide-react";

interface Vocabulary {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
}

interface FillBlankProps {
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

export default function FillBlank({ vocabularies, onComplete }: FillBlankProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const vocabsWithExamples = useMemo(
    () => vocabularies.filter((v) => v.example && v.example.toLowerCase().includes(v.word.toLowerCase())),
    [vocabularies]
  );

  const questions = useMemo(() => {
    const pool = vocabsWithExamples.length >= 5 ? vocabsWithExamples : vocabularies;
    return shuffleArray(pool).slice(0, Math.min(10, pool.length)).map((v) => {
      const sentence = v.example
        ? v.example.replace(new RegExp(v.word, "gi"), "_____")
        : `NghÄ©a cá»§a "_____" lÃ : ${v.meaning}`;
      return { vocab: v, sentence, answer: v.word.toLowerCase() };
    });
  }, [vocabularies, vocabsWithExamples]);

  const TOTAL = questions.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<
    { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[]
  >([]);

  const current = questions[currentIndex];

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentIndex]);

  if (!current) return null;

  const handleCheck = () => {
    if (!input.trim() || isAnswered) return;
    const correct = input.trim().toLowerCase() === current.answer;
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    setAnswers((prev) => [
      ...prev,
      { question: current.sentence, userAnswer: input.trim(), correctAnswer: current.vocab.word, isCorrect: correct },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= TOTAL) {
      onComplete({
        total: TOTAL,
        correct: correctCount,
        wrong: TOTAL - correctCount,
        xpEarned: correctCount * 7,
        answers,
      });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setInput("");
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isAnswered) handleNext();
      else handleCheck();
    }
  };

  const progress = ((currentIndex + 1) / TOTAL) * 100;
  const hint = current.vocab.word.charAt(0) + "..." + current.vocab.word.charAt(current.vocab.word.length - 1);

  return (
    <div className="animate-slide-up">
      <div className="practice-score-bar">
        <span>CÃ¢u {currentIndex + 1}/{TOTAL}</span>
        <span className="score">
          <Check className="w-4 h-4 inline text-green-500" /> {correctCount} Ä‘Ãºng
        </span>
      </div>
      <div className="practice-progress">
        <div className="practice-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="practice-card">
        <div className="question-number">Äiá»n tá»« vÃ o chá»— trá»‘ng</div>
        <div className="question-text">{current.sentence}</div>
        <p className="text-sm text-gray-500 mb-3">NghÄ©a: <strong>{current.vocab.meaning}</strong></p>

        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nháº­p tá»« tiáº¿ng Anh..."
            disabled={isAnswered}
            className={`practice-input flex-1 ${isAnswered ? (isCorrect ? "correct" : "wrong") : ""}`}
            autoComplete="off"
            spellCheck={false}
          />
          {!isAnswered && (
            <button className="practice-btn practice-btn-primary" onClick={handleCheck} disabled={!input.trim()}>
              <Check className="w-4 h-4" /> Kiá»ƒm tra
            </button>
          )}
        </div>

        {!isAnswered && !showHint && (
          <button className="text-xs text-amber-600 mt-3 flex items-center gap-1 hover:underline" onClick={() => setShowHint(true)}>
            <Lightbulb className="w-3 h-3" /> Gá»£i Ã½
          </button>
        )}
        {showHint && !isAnswered && (
          <div className="hint-box mt-3">ðŸ’¡ Gá»£i Ã½: <strong>{hint}</strong> ({current.vocab.word.length} kÃ½ tá»±)</div>
        )}

        {isAnswered && (
          <div className="mt-4 flex justify-between items-center animate-fade-in">
            <span className={`text-sm font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "âœ“ ChÃ­nh xÃ¡c!" : (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> ÄÃ¡p Ã¡n: <strong>{current.vocab.word}</strong>
                </span>
              )}
            </span>
            <button className="practice-btn practice-btn-primary" onClick={handleNext}>
              {currentIndex + 1 >= TOTAL ? "Xem káº¿t quáº£" : "Tiáº¿p theo"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
// Sentences sourced from lesson_vocabularies.example field
// Hint shows first and last character of the answer
// Case-insensitive comparison for answer checking
