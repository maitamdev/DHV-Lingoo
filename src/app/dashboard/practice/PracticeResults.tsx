"use client";

import { useMemo } from "react";
import { Trophy, RotateCcw, Check, X, Star, Zap } from "lucide-react";

interface PracticeResultsProps {
  result: {
    total: number;
    correct: number;
    wrong: number;
    xpEarned: number;
    answers: { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[];
  };
  onRetry: () => void;
  mode: string;
}

export default function PracticeResults({ result, onRetry, mode }: PracticeResultsProps) {
  const percentage = Math.round((result.correct / result.total) * 100);
  const grade = percentage >= 80 ? "excellent" : percentage >= 50 ? "good" : "poor";
  const emoji = percentage >= 80 ? "ðŸŽ‰" : percentage >= 50 ? "ðŸ‘" : "ðŸ’ª";
  const message = percentage >= 80
    ? "Xuáº¥t sáº¯c! Báº¡n náº¯m vá»¯ng kiáº¿n thá»©c!"
    : percentage >= 50
    ? "KhÃ¡ tá»‘t! Cá»‘ gáº¯ng thÃªm nhÃ©!"
    : "HÃ£y Ã´n láº¡i vÃ  thá»­ láº¡i nhÃ©!";

  const modeLabel = mode === "vocab" ? "Tráº¯c nghiá»‡m tá»« vá»±ng" : mode === "fillblank" ? "Äiá»n tá»«" : "Luyá»‡n nghe";

  return (
    <div className="results-container">
      <div className="text-4xl mb-2">{emoji}</div>
      <div className={`results-circle ${grade}`}>
        {percentage}%
        <div className="results-label">{grade === "excellent" ? "Xuáº¥t sáº¯c" : grade === "good" ? "KhÃ¡" : "Cáº§n cáº£i thiá»‡n"}</div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-1">{message}</h2>
      <p className="text-sm text-gray-400 mb-6">{modeLabel}</p>

      <div className="results-stats">
        <div className="results-stat">
          <div className="results-stat-value text-green-600">{result.correct}</div>
          <div className="results-stat-label">ÄÃºng</div>
        </div>
        <div className="results-stat">
          <div className="results-stat-value text-red-500">{result.wrong}</div>
          <div className="results-stat-label">Sai</div>
        </div>
        <div className="results-stat">
          <div className="results-stat-value text-amber-500 flex items-center justify-center gap-1">
            <Zap className="w-5 h-5" /> {result.xpEarned}
          </div>
          <div className="results-stat-label">XP kiáº¿m Ä‘Æ°á»£c</div>
        </div>
      </div>

      {result.answers.length > 0 && (
        <div className="text-left max-w-md mx-auto mt-6">
          <h3 className="font-bold text-sm text-gray-700 mb-3">Chi tiáº¿t Ä‘Ã¡p Ã¡n:</h3>
          <div className="space-y-2">
            {result.answers.map((a, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 p-3 rounded-xl text-sm ${
                  a.isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                {a.isCorrect ? (
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                )}
                <div>
                  <p className="font-medium text-gray-800">{a.question}</p>
                  {!a.isCorrect && (
                    <p className="text-xs text-gray-500 mt-1">
                      Báº¡n tráº£ lá»i: <span className="text-red-600">{a.userAnswer}</span> Â· ÄÃ¡p Ã¡n: <span className="text-green-600 font-medium">{a.correctAnswer}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 justify-center mt-8">
        <button className="practice-btn practice-btn-primary text-base px-6" onClick={onRetry}>
          <RotateCcw className="w-4 h-4" /> Luyá»‡n táº­p láº¡i
        </button>
      </div>
    </div>
  );
}
// Score circle uses 3 tiers: excellent/good/poor
// Detailed answer review with correct/wrong indicators
