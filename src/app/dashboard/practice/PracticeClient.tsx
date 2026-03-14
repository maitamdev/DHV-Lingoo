"use client";

import { useState, useCallback } from "react";
import { BookOpen, Headphones, PenLine, Trophy } from "lucide-react";
import VocabQuiz from "./VocabQuiz";
import FillBlank from "./FillBlank";
import ListeningPractice from "./ListeningPractice";
import PracticeResults from "./PracticeResults";
import { createClient } from "@/lib/supabase/client";
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

interface PracticeResult {
  total: number;
  correct: number;
  wrong: number;
  xpEarned: number;
  answers: { question: string; userAnswer: string; correctAnswer: string; isCorrect: boolean }[];
}

interface PracticeProps {
  vocabularies: Vocabulary[];
  userXp: number;
  userLevel: string;
  userId: string;
}

export default function PracticeClient({ vocabularies, userXp, userLevel, userId }: PracticeProps) {
  const [mode, setMode] = useState<PracticeMode>("vocab");
  const [state, setState] = useState<PracticeState>("selecting");
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [saving, setSaving] = useState(false);

  const handleComplete = useCallback(async (r: PracticeResult) => {
    setResult(r);
    setState("results");

    // Save XP to profile
    if (r.xpEarned > 0) {
      setSaving(true);
      try {
        const supabase = createClient();
        await supabase
          .from("profiles")
          .update({ xp: userXp + r.xpEarned })
          .eq("id", userId);
      } catch (e) {
        console.error("Failed to save XP:", e);
      } finally {
        setSaving(false);
      }
    }
  }, [userXp, userId]);

  const handleRetry = useCallback(() => {
    setResult(null);
    setState("selecting");
  }, []);

  const modeInfo = {
    vocab: { label: "Tá»« vá»±ng", desc: "Chá»n nghÄ©a Ä‘Ãºng cho má»—i tá»«", icon: BookOpen, xp: "5 XP/cÃ¢u" },
    fillblank: { label: "Äiá»n tá»«", desc: "Äiá»n tá»« tiáº¿ng Anh vÃ o chá»— trá»‘ng", icon: PenLine, xp: "7 XP/cÃ¢u" },
    listening: { label: "Nghe", desc: "Nghe vÃ  viáº¿t láº¡i tá»«", icon: Headphones, xp: "10 XP/cÃ¢u" },
  };

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
            {(Object.keys(modeInfo) as PracticeMode[]).map((m) => {
              const info = modeInfo[m];
              const Icon = info.icon;
              return (
                <button
                  key={m}
                  className={`practice-tab ${mode === m ? "active" : ""}`}
                  onClick={() => setMode(m)}
                >
                  <Icon className="w-4 h-4" /> {info.label}
                </button>
              );
            })}
          </div>

          <div className="practice-card text-center animate-fade-in">
            <div className="text-4xl mb-3">
              {mode === "vocab" ? "ðŸ“š" : mode === "fillblank" ? "âœï¸" : "ðŸŽ§"}
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{modeInfo[mode].label}</h2>
            <p className="text-sm text-gray-500 mb-2">{modeInfo[mode].desc}</p>
            <p className="text-xs text-blue-500 font-medium mb-6">{modeInfo[mode].xp} Â· 10 cÃ¢u há»i</p>

            <p className="text-xs text-gray-400 mb-4">
              {vocabularies.length} tá»« vá»±ng cÃ³ sáºµn Â· Level {userLevel}
            </p>

            <button
              className="practice-btn practice-btn-primary text-base px-8 py-3"
              onClick={() => setState("practicing")}
              disabled={vocabularies.length < 4}
            >
              ðŸš€ Báº¯t Ä‘áº§u luyá»‡n táº­p
            </button>
            {vocabularies.length < 4 && (
              <p className="text-red-400 text-xs mt-2">Cáº§n Ã­t nháº¥t 4 tá»« vá»±ng</p>
            )}
          </div>
        </>
      )}

      {state === "practicing" && mode === "vocab" && (
        <VocabQuiz vocabularies={vocabularies} onComplete={handleComplete} />
      )}

      {state === "practicing" && mode === "fillblank" && (
        <FillBlank vocabularies={vocabularies} onComplete={handleComplete} />
      )}

      {state === "practicing" && mode === "listening" && (
        <ListeningPractice vocabularies={vocabularies} onComplete={handleComplete} />
      )}

      {state === "results" && result && (
        <PracticeResults result={result} onRetry={handleRetry} mode={mode} />
      )}
    </div>
  );
}
