"use client";

import { useState, useCallback } from "react";
import { BookOpen, Headphones, PenLine, Trophy } from "lucide-react";
import "./practice.css";

interface Vocabulary {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
  lesson_id: string;
}

type PracticeMode = "vocab" | "fillblank" | "listening";
type PracticeState = "selecting" | "practicing" | "results";

interface PracticeProps {
  vocabularies: Vocabulary[];
  userXp: number;
  userLevel: string;
  userId: string;
}

interface PracticeResult {
  total: number;
  correct: number;
  wrong: number;
  xpEarned: number;
  answers: { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[];
}

export default function PracticeClient({ vocabularies, userXp, userLevel, userId }: PracticeProps) {
  const [mode, setMode] = useState<PracticeMode>("vocab");
  const [state, setState] = useState<PracticeState>("selecting");
  const [result, setResult] = useState<PracticeResult | null>(null);

  const handleComplete = useCallback((r: PracticeResult) => {
    setResult(r);
    setState("results");
  }, []);

  const handleRetry = useCallback(() => {
    setResult(null);
    setState("selecting");
  }, []);

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-500" />
          Luyá»‡n táº­p
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Cá»§ng cá»‘ kiáº¿n thá»©c vá»›i cÃ¡c bÃ i táº­p tÆ°Æ¡ng tÃ¡c
        </p>
      </div>

      {state === "selecting" && (
        <>
          <div className="practice-tabs mb-6">
            <button
              className={`practice-tab ${mode === "vocab" ? "active" : ""}`}
              onClick={() => setMode("vocab")}
            >
              <BookOpen className="w-4 h-4" /> Tá»« vá»±ng
            </button>
            <button
              className={`practice-tab ${mode === "fillblank" ? "active" : ""}`}
              onClick={() => setMode("fillblank")}
            >
              <PenLine className="w-4 h-4" /> Äiá»n tá»«
            </button>
            <button
              className={`practice-tab ${mode === "listening" ? "active" : ""}`}
              onClick={() => setMode("listening")}
            >
              <Headphones className="w-4 h-4" /> Nghe
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mb-4">
            {vocabularies.length} tá»« vá»±ng cÃ³ sáºµn Â· Level {userLevel}
          </p>

          <div className="text-center">
            <button
              className="practice-btn practice-btn-primary text-base px-8 py-3"
              onClick={() => setState("practicing")}
              disabled={vocabularies.length < 4}
            >
              ðŸš€ Báº¯t Ä‘áº§u luyá»‡n táº­p
            </button>
            {vocabularies.length < 4 && (
              <p className="text-red-400 text-xs mt-2">Cáº§n Ã­t nháº¥t 4 tá»« vá»±ng Ä‘á»ƒ luyá»‡n táº­p</p>
            )}
          </div>
        </>
      )}

      {state === "practicing" && mode === "vocab" && (
        <div className="animate-slide-up">
          <p className="text-center text-gray-400">Äang táº£i bÃ i táº­p tá»« vá»±ng...</p>
        </div>
      )}

      {state === "practicing" && mode === "fillblank" && (
        <div className="animate-slide-up">
          <p className="text-center text-gray-400">Äang táº£i bÃ i Ä‘iá»n tá»«...</p>
        </div>
      )}

      {state === "practicing" && mode === "listening" && (
        <div className="animate-slide-up">
          <p className="text-center text-gray-400">Äang táº£i bÃ i nghe...</p>
        </div>
      )}

      {state === "results" && result && (
        <div className="animate-scale-in text-center py-10">
          <p className="text-2xl font-bold">{result.correct}/{result.total}</p>
          <button className="practice-btn practice-btn-primary mt-4" onClick={handleRetry}>
            LÃ m láº¡i
          </button>
        </div>
      )}
    </div>
  );
}
