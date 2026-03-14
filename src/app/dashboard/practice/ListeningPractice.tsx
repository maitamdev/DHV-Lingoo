"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Volume2, Check, ArrowRight, Eye, RotateCcw } from "lucide-react";

interface Vocabulary {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
}

interface ListeningProps {
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

export default function ListeningPractice({ vocabularies, onComplete }: ListeningProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const questions = useMemo(() => shuffleArray(vocabularies).slice(0, Math.min(10, vocabularies.length)), [vocabularies]);
  const TOTAL = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answers, setAnswers] = useState<
    { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[]
  >([]);

  const current = questions[currentIndex];

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = playCount === 0 ? 0.8 : 0.6;
    u.onstart = () => setIsPlaying(true);
    u.onend = () => setIsPlaying(false);
    window.speechSynthesis.speak(u);
    setPlayCount((c) => c + 1);
  }, [playCount]);

  useEffect(() => {
    if (current) {
      const timer = setTimeout(() => speak(current.word), 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex]);

  useEffect(() => { inputRef.current?.focus(); }, [currentIndex]);

  if (!current) return null;

  const handleCheck = () => {
    if (!input.trim() || isAnswered) return;
    const correct = input.trim().toLowerCase() === current.word.toLowerCase();
    setIsCorrect(correct);
    setIsAnswered(true);
    if (correct) setCorrectCount((c) => c + 1);
    setAnswers((prev) => [
      ...prev,
      { question: `[Audio] ${current.word}`, userAnswer: input.trim(), correctAnswer: current.word, isCorrect: correct },
    ]);
  };

  const handleNext = () => {
    if (currentIndex + 1 >= TOTAL) {
      onComplete({
        total: TOTAL,
        correct: correctCount,
        wrong: TOTAL - correctCount,
        xpEarned: correctCount * 10,
        answers,
      });
      return;
    }
    setCurrentIndex((i) => i + 1);
    setInput("");
    setIsAnswered(false);
    setIsCorrect(false);
    setPlayCount(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (isAnswered) handleNext();
      else handleCheck();
    }
  };

  const progress = ((currentIndex + 1) / TOTAL) * 100;

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

      <div className="practice-card text-center">
        <div className="question-number">Luyá»‡n nghe</div>
        <p className="text-gray-500 text-sm mb-6">Nghe vÃ  viáº¿t láº¡i tá»« báº¡n nghe Ä‘Æ°á»£c</p>

        <button
          className={`listening-speaker ${isPlaying ? "playing" : ""}`}
          onClick={() => speak(current.word)}
          title="Nghe láº¡i"
        >
          <Volume2 className="w-10 h-10 text-white" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => speak(current.word)}
            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Nghe láº¡i {playCount > 0 && `(${playCount})`}
          </button>
        </div>

        {isAnswered && (
          <p className="text-sm text-gray-400 mb-3 animate-fade-in">
            NghÄ©a: <strong className="text-gray-700">{current.meaning}</strong>
          </p>
        )}

        <div className="max-w-md mx-auto">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nháº­p tá»« báº¡n nghe Ä‘Æ°á»£c..."
              disabled={isAnswered}
              className={`practice-input flex-1 text-center ${isAnswered ? (isCorrect ? "correct" : "wrong") : ""}`}
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {!isAnswered && (
            <button
              className="practice-btn practice-btn-primary mt-4 w-full justify-center"
              onClick={handleCheck}
              disabled={!input.trim()}
            >
              <Check className="w-4 h-4" /> Kiá»ƒm tra
            </button>
          )}

          {isAnswered && (
            <div className="mt-4 flex flex-col items-center gap-3 animate-fade-in">
              <span className={`text-sm font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "âœ“ ChÃ­nh xÃ¡c! +10 XP" : (
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> ÄÃ¡p Ã¡n: <strong>{current.word}</strong>
                    {current.phonetic && <span className="text-gray-400 font-normal"> {current.phonetic}</span>}
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
    </div>
  );
}
// Web Speech API with en-US locale for pronunciation
// First play at 0.8x speed, subsequent at 0.6x speed
// Speaker button pulses during audio playback
