Set-Location 'D:\Do-An-Chuyen-Nganh'
$ErrorActionPreference = 'SilentlyContinue'

function CC($msg) {
  git add -A 2>$null
  $r = git status --porcelain 2>$null
  if ($r) { git commit -m $msg 2>$null | Out-Null; Write-Host '[OK]' $msg -ForegroundColor Green }
  else { Write-Host '[SKIP]' $msg -ForegroundColor Yellow }
}

function WF($file, $content, $msg) {
  $dir = Split-Path $file -Parent
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  Set-Content -Path $file -Value $content -Encoding UTF8
  CC $msg
}

function AF($file, $line, $msg) {
  Add-Content -Path $file -Value $line -Encoding UTF8
  CC $msg
}

# === File paths ===
$pcss = 'src/app/dashboard/practice/practice.css'
$ppg = 'src/app/dashboard/practice/page.tsx'
$pcl = 'src/app/dashboard/practice/PracticeClient.tsx'
$vq = 'src/app/dashboard/practice/VocabQuiz.tsx'
$fb = 'src/app/dashboard/practice/FillBlank.tsx'
$lp = 'src/app/dashboard/practice/ListeningPractice.tsx'
$pr = 'src/app/dashboard/practice/PracticeResults.tsx'
$prcss = 'src/app/dashboard/profile/profile.css'
$prpg = 'src/app/dashboard/profile/page.tsx'
$prcl = 'src/app/dashboard/profile/ProfileClient.tsx'

Write-Host '=== PRACTICE & PROFILE FEATURES ===' -ForegroundColor Cyan
Write-Host "Started at $(Get-Date -Format 'HH:mm:ss')" -ForegroundColor Gray

# =============================================
# COMMIT 1: Practice CSS - Base variables
# =============================================
WF $pcss @'
/* Practice Page Styles */
:root {
  --practice-primary: #3b82f6;
  --practice-success: #10b981;
  --practice-danger: #ef4444;
  --practice-warning: #f59e0b;
  --practice-bg: #f8fafc;
  --practice-card: #ffffff;
  --practice-border: #e2e8f0;
  --practice-text: #1e293b;
  --practice-muted: #94a3b8;
  --practice-radius: 16px;
}
'@ 'style(practice): add CSS variables and design tokens'

# COMMIT 2: Practice CSS - Tab navigation
AF $pcss @'

.practice-tabs {
  display: flex;
  gap: 4px;
  background: var(--practice-bg);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid var(--practice-border);
}
.practice-tab {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-weight: 600;
  font-size: 13px;
  color: var(--practice-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.practice-tab:hover { background: #e2e8f0; color: var(--practice-text); }
.practice-tab.active {
  background: var(--practice-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}
'@ 'style(practice): add tab navigation styles'

# COMMIT 3: Practice CSS - Question card
AF $pcss @'

.practice-card {
  background: var(--practice-card);
  border: 1px solid var(--practice-border);
  border-radius: var(--practice-radius);
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  transition: all 0.3s ease;
}
.practice-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.question-number {
  font-size: 12px;
  font-weight: 700;
  color: var(--practice-primary);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}
.question-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--practice-text);
  line-height: 1.4;
  margin-bottom: 24px;
}
'@ 'style(practice): add question card styles'

# COMMIT 4: Practice CSS - Answer options
AF $pcss @'

.options-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.option-btn {
  padding: 14px 18px;
  border: 2px solid var(--practice-border);
  border-radius: 12px;
  background: white;
  font-size: 14px;
  font-weight: 500;
  color: var(--practice-text);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
}
.option-btn:hover {
  border-color: var(--practice-primary);
  background: #eff6ff;
  transform: translateY(-1px);
}
.option-btn.correct {
  border-color: var(--practice-success);
  background: #ecfdf5;
  color: #065f46;
  animation: correctPulse 0.4s ease;
}
.option-btn.wrong {
  border-color: var(--practice-danger);
  background: #fef2f2;
  color: #991b1b;
  animation: shake 0.4s ease;
}
.option-btn.disabled { pointer-events: none; opacity: 0.7; }
'@ 'style(practice): add answer option styles'

# COMMIT 5: Practice CSS - Progress bar
AF $pcss @'

.practice-progress {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 20px;
}
.practice-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--practice-primary), #8b5cf6);
  border-radius: 4px;
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
.practice-score-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
  color: var(--practice-muted);
  margin-bottom: 12px;
}
.practice-score-bar .score {
  font-weight: 700;
  color: var(--practice-primary);
  font-size: 15px;
}
'@ 'style(practice): add progress bar styles'

# COMMIT 6: Practice CSS - Animations
AF $pcss @'

@keyframes correctPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
}
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes confettiBurst {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(-100px) rotate(720deg); opacity: 0; }
}
.animate-slide-up { animation: slideUp 0.4s ease forwards; }
.animate-fade-in { animation: fadeIn 0.3s ease forwards; }
.animate-scale-in { animation: scaleIn 0.3s ease forwards; }
'@ 'style(practice): add animations and keyframes'

# COMMIT 7: Practice CSS - Input styles
AF $pcss @'

.practice-input {
  width: 100%;
  padding: 14px 18px;
  border: 2px solid var(--practice-border);
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  color: var(--practice-text);
  background: white;
  outline: none;
  transition: all 0.2s ease;
}
.practice-input:focus {
  border-color: var(--practice-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.practice-input.correct { border-color: var(--practice-success); background: #ecfdf5; }
.practice-input.wrong { border-color: var(--practice-danger); background: #fef2f2; }
.practice-btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.practice-btn-primary {
  background: var(--practice-primary);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}
.practice-btn-primary:hover { background: #2563eb; transform: translateY(-1px); }
.practice-btn-success {
  background: var(--practice-success);
  color: white;
}
.practice-btn-success:hover { background: #059669; }
'@ 'style(practice): add input and button styles'

# COMMIT 8: Practice CSS - Results page
AF $pcss @'

.results-container {
  text-align: center;
  padding: 40px 20px;
  animation: scaleIn 0.5s ease;
}
.results-circle {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 0 auto 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 800;
  position: relative;
}
.results-circle.excellent {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #065f46;
  border: 3px solid var(--practice-success);
}
.results-circle.good {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  color: #1e40af;
  border: 3px solid var(--practice-primary);
}
.results-circle.poor {
  background: linear-gradient(135deg, #fef2f2, #fecaca);
  color: #991b1b;
  border: 3px solid var(--practice-danger);
}
.results-label { font-size: 13px; font-weight: 600; margin-top: 2px; }
.results-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 24px 0;
}
.results-stat {
  padding: 16px;
  background: var(--practice-bg);
  border-radius: 12px;
  text-align: center;
}
.results-stat-value { font-size: 24px; font-weight: 800; color: var(--practice-text); }
.results-stat-label { font-size: 11px; color: var(--practice-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
'@ 'style(practice): add results page styles'

# COMMIT 9: Practice CSS - Listening styles
AF $pcss @'

.listening-speaker {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--practice-primary), #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}
.listening-speaker:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}
.listening-speaker.playing {
  animation: pulse 1.5s ease infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  50% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
}
.hint-box {
  background: #fefce8;
  border: 1px solid #fde68a;
  border-radius: 10px;
  padding: 12px 16px;
  font-size: 13px;
  color: #92400e;
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
'@ 'style(practice): add listening exercise styles'

# COMMIT 10: Practice CSS - Responsive
AF $pcss @'

@media (max-width: 640px) {
  .options-grid { grid-template-columns: 1fr; }
  .results-stats { grid-template-columns: 1fr; }
  .practice-card { padding: 20px; }
  .question-text { font-size: 17px; }
  .results-circle { width: 110px; height: 110px; font-size: 28px; }
  .practice-tabs { flex-direction: column; }
  .practice-tab { padding: 8px 12px; font-size: 12px; }
}
@media (max-width: 480px) {
  .practice-card { padding: 16px; margin: 0 -8px; }
  .results-container { padding: 24px 12px; }
}
'@ 'style(practice): add responsive breakpoints'

Write-Host "Phase 1 done: Practice CSS (10 commits)" -ForegroundColor Cyan

# =============================================
# COMMIT 11: Practice page server component
# =============================================
WF $ppg @'
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import PracticeClient from './PracticeClient';

export const metadata: Metadata = {
  title: 'Luyện tập | DHV-Lingoo',
  description: 'Luyện tập tiếng Anh với các bài tập tương tác',
};

export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Vui lòng đăng nhập để luyện tập
      </div>
    );
  }

  const { data: vocabularies } = await supabase
    .from('lesson_vocabularies')
    .select('id, word, phonetic, meaning, example, lesson_id')
    .limit(200);

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak, level')
    .eq('id', user.id)
    .single();

  return (
    <PracticeClient
      vocabularies={vocabularies || []}
      userXp={profile?.xp || 0}
      userLevel={profile?.level || 'A1'}
      userId={user.id}
    />
  );
}
'@ 'feat(practice): create server page with data fetching'

# COMMIT 12: PracticeClient shell - imports and types
WF $pcl @'
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
          Luyện tập
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Củng cố kiến thức với các bài tập tương tác
        </p>
      </div>

      {state === "selecting" && (
        <>
          <div className="practice-tabs mb-6">
            <button
              className={`practice-tab ${mode === "vocab" ? "active" : ""}`}
              onClick={() => setMode("vocab")}
            >
              <BookOpen className="w-4 h-4" /> Từ vựng
            </button>
            <button
              className={`practice-tab ${mode === "fillblank" ? "active" : ""}`}
              onClick={() => setMode("fillblank")}
            >
              <PenLine className="w-4 h-4" /> Điền từ
            </button>
            <button
              className={`practice-tab ${mode === "listening" ? "active" : ""}`}
              onClick={() => setMode("listening")}
            >
              <Headphones className="w-4 h-4" /> Nghe
            </button>
          </div>

          <p className="text-center text-gray-400 text-sm mb-4">
            {vocabularies.length} từ vựng có sẵn · Level {userLevel}
          </p>

          <div className="text-center">
            <button
              className="practice-btn practice-btn-primary text-base px-8 py-3"
              onClick={() => setState("practicing")}
              disabled={vocabularies.length < 4}
            >
              🚀 Bắt đầu luyện tập
            </button>
            {vocabularies.length < 4 && (
              <p className="text-red-400 text-xs mt-2">Cần ít nhất 4 từ vựng để luyện tập</p>
            )}
          </div>
        </>
      )}

      {state === "practicing" && mode === "vocab" && (
        <div className="animate-slide-up">
          <p className="text-center text-gray-400">Đang tải bài tập từ vựng...</p>
        </div>
      )}

      {state === "practicing" && mode === "fillblank" && (
        <div className="animate-slide-up">
          <p className="text-center text-gray-400">Đang tải bài điền từ...</p>
        </div>
      )}

      {state === "practicing" && mode === "listening" && (
        <div className="animate-slide-up">
          <p className="text-center text-gray-400">Đang tải bài nghe...</p>
        </div>
      )}

      {state === "results" && result && (
        <div className="animate-scale-in text-center py-10">
          <p className="text-2xl font-bold">{result.correct}/{result.total}</p>
          <button className="practice-btn practice-btn-primary mt-4" onClick={handleRetry}>
            Làm lại
          </button>
        </div>
      )}
    </div>
  );
}
'@ 'feat(practice): create PracticeClient with tab navigation shell'

Write-Host "Phase 2 done: Practice page + client (2 commits)" -ForegroundColor Cyan

# =============================================
# COMMIT 13: VocabQuiz component
# =============================================
WF $vq @'
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
        <span>Câu {currentIndex + 1}/{TOTAL_QUESTIONS}</span>
        <span className="score">
          <Check className="w-4 h-4 inline text-green-500" /> {correctCount} đúng
        </span>
      </div>
      <div className="practice-progress">
        <div className="practice-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="practice-card">
        <div className="question-number">Trắc nghiệm từ vựng</div>
        <div className="question-text">
          &ldquo;{current.vocab.word}&rdquo;
          {current.vocab.phonetic && (
            <span className="block text-sm font-normal text-gray-400 mt-1">
              {current.vocab.phonetic}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-4">Chọn nghĩa đúng:</p>

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
              {selected === current.correctAnswer ? "✓ Chính xác!" : `✗ Đáp án: ${current.correctAnswer}`}
            </span>
            <button className="practice-btn practice-btn-primary" onClick={handleNext}>
              {currentIndex + 1 >= TOTAL_QUESTIONS ? "Xem kết quả" : "Tiếp theo"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
'@ 'feat(practice): create VocabQuiz component with multiple choice'

Write-Host "Phase 3 done: VocabQuiz (1 commit)" -ForegroundColor Cyan

# =============================================
# COMMIT 14: FillBlank component
# =============================================
WF $fb @'
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
        : `Nghĩa của "_____" là: ${v.meaning}`;
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
        <span>Câu {currentIndex + 1}/{TOTAL}</span>
        <span className="score">
          <Check className="w-4 h-4 inline text-green-500" /> {correctCount} đúng
        </span>
      </div>
      <div className="practice-progress">
        <div className="practice-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="practice-card">
        <div className="question-number">Điền từ vào chỗ trống</div>
        <div className="question-text">{current.sentence}</div>
        <p className="text-sm text-gray-500 mb-3">Nghĩa: <strong>{current.vocab.meaning}</strong></p>

        <div className="flex gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập từ tiếng Anh..."
            disabled={isAnswered}
            className={`practice-input flex-1 ${isAnswered ? (isCorrect ? "correct" : "wrong") : ""}`}
            autoComplete="off"
            spellCheck={false}
          />
          {!isAnswered && (
            <button className="practice-btn practice-btn-primary" onClick={handleCheck} disabled={!input.trim()}>
              <Check className="w-4 h-4" /> Kiểm tra
            </button>
          )}
        </div>

        {!isAnswered && !showHint && (
          <button className="text-xs text-amber-600 mt-3 flex items-center gap-1 hover:underline" onClick={() => setShowHint(true)}>
            <Lightbulb className="w-3 h-3" /> Gợi ý
          </button>
        )}
        {showHint && !isAnswered && (
          <div className="hint-box mt-3">💡 Gợi ý: <strong>{hint}</strong> ({current.vocab.word.length} ký tự)</div>
        )}

        {isAnswered && (
          <div className="mt-4 flex justify-between items-center animate-fade-in">
            <span className={`text-sm font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "✓ Chính xác!" : (
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" /> Đáp án: <strong>{current.vocab.word}</strong>
                </span>
              )}
            </span>
            <button className="practice-btn practice-btn-primary" onClick={handleNext}>
              {currentIndex + 1 >= TOTAL ? "Xem kết quả" : "Tiếp theo"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
'@ 'feat(practice): create FillBlank component with hints'

Write-Host "Phase 4 done: FillBlank (1 commit)" -ForegroundColor Cyan

# =============================================
# COMMIT 15: ListeningPractice component
# =============================================
WF $lp @'
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
        <span>Câu {currentIndex + 1}/{TOTAL}</span>
        <span className="score">
          <Check className="w-4 h-4 inline text-green-500" /> {correctCount} đúng
        </span>
      </div>
      <div className="practice-progress">
        <div className="practice-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="practice-card text-center">
        <div className="question-number">Luyện nghe</div>
        <p className="text-gray-500 text-sm mb-6">Nghe và viết lại từ bạn nghe được</p>

        <button
          className={`listening-speaker ${isPlaying ? "playing" : ""}`}
          onClick={() => speak(current.word)}
          title="Nghe lại"
        >
          <Volume2 className="w-10 h-10 text-white" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-4">
          <button
            onClick={() => speak(current.word)}
            className="text-xs text-blue-500 hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Nghe lại {playCount > 0 && `(${playCount})`}
          </button>
        </div>

        {isAnswered && (
          <p className="text-sm text-gray-400 mb-3 animate-fade-in">
            Nghĩa: <strong className="text-gray-700">{current.meaning}</strong>
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
              placeholder="Nhập từ bạn nghe được..."
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
              <Check className="w-4 h-4" /> Kiểm tra
            </button>
          )}

          {isAnswered && (
            <div className="mt-4 flex flex-col items-center gap-3 animate-fade-in">
              <span className={`text-sm font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                {isCorrect ? "✓ Chính xác! +10 XP" : (
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" /> Đáp án: <strong>{current.word}</strong>
                    {current.phonetic && <span className="text-gray-400 font-normal"> {current.phonetic}</span>}
                  </span>
                )}
              </span>
              <button className="practice-btn practice-btn-primary" onClick={handleNext}>
                {currentIndex + 1 >= TOTAL ? "Xem kết quả" : "Tiếp theo"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
'@ 'feat(practice): create ListeningPractice with TTS'

Write-Host "Phase 5 done: ListeningPractice (1 commit)" -ForegroundColor Cyan

# =============================================
# COMMIT 16: PracticeResults component
# =============================================
WF $pr @'
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
  const emoji = percentage >= 80 ? "🎉" : percentage >= 50 ? "👏" : "💪";
  const message = percentage >= 80
    ? "Xuất sắc! Bạn nắm vững kiến thức!"
    : percentage >= 50
    ? "Khá tốt! Cố gắng thêm nhé!"
    : "Hãy ôn lại và thử lại nhé!";

  const modeLabel = mode === "vocab" ? "Trắc nghiệm từ vựng" : mode === "fillblank" ? "Điền từ" : "Luyện nghe";

  return (
    <div className="results-container">
      <div className="text-4xl mb-2">{emoji}</div>
      <div className={`results-circle ${grade}`}>
        {percentage}%
        <div className="results-label">{grade === "excellent" ? "Xuất sắc" : grade === "good" ? "Khá" : "Cần cải thiện"}</div>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-1">{message}</h2>
      <p className="text-sm text-gray-400 mb-6">{modeLabel}</p>

      <div className="results-stats">
        <div className="results-stat">
          <div className="results-stat-value text-green-600">{result.correct}</div>
          <div className="results-stat-label">Đúng</div>
        </div>
        <div className="results-stat">
          <div className="results-stat-value text-red-500">{result.wrong}</div>
          <div className="results-stat-label">Sai</div>
        </div>
        <div className="results-stat">
          <div className="results-stat-value text-amber-500 flex items-center justify-center gap-1">
            <Zap className="w-5 h-5" /> {result.xpEarned}
          </div>
          <div className="results-stat-label">XP kiếm được</div>
        </div>
      </div>

      {result.answers.length > 0 && (
        <div className="text-left max-w-md mx-auto mt-6">
          <h3 className="font-bold text-sm text-gray-700 mb-3">Chi tiết đáp án:</h3>
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
                      Bạn trả lời: <span className="text-red-600">{a.userAnswer}</span> · Đáp án: <span className="text-green-600 font-medium">{a.correctAnswer}</span>
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
          <RotateCcw className="w-4 h-4" /> Luyện tập lại
        </button>
      </div>
    </div>
  );
}
'@ 'feat(practice): create PracticeResults with score display'

Write-Host "Phase 6 done: PracticeResults (1 commit)" -ForegroundColor Cyan

# =============================================
# COMMIT 17: Update PracticeClient to integrate all components
# =============================================
WF $pcl @'
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
    vocab: { label: "Từ vựng", desc: "Chọn nghĩa đúng cho mỗi từ", icon: BookOpen, xp: "5 XP/câu" },
    fillblank: { label: "Điền từ", desc: "Điền từ tiếng Anh vào chỗ trống", icon: PenLine, xp: "7 XP/câu" },
    listening: { label: "Nghe", desc: "Nghe và viết lại từ", icon: Headphones, xp: "10 XP/câu" },
  };

  return (
    <div className="p-4 lg:p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Trophy className="w-6 h-6 text-blue-500" />
          Luyện tập
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Củng cố kiến thức với các bài tập tương tác
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
              {mode === "vocab" ? "📚" : mode === "fillblank" ? "✍️" : "🎧"}
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{modeInfo[mode].label}</h2>
            <p className="text-sm text-gray-500 mb-2">{modeInfo[mode].desc}</p>
            <p className="text-xs text-blue-500 font-medium mb-6">{modeInfo[mode].xp} · 10 câu hỏi</p>

            <p className="text-xs text-gray-400 mb-4">
              {vocabularies.length} từ vựng có sẵn · Level {userLevel}
            </p>

            <button
              className="practice-btn practice-btn-primary text-base px-8 py-3"
              onClick={() => setState("practicing")}
              disabled={vocabularies.length < 4}
            >
              🚀 Bắt đầu luyện tập
            </button>
            {vocabularies.length < 4 && (
              <p className="text-red-400 text-xs mt-2">Cần ít nhất 4 từ vựng</p>
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
'@ 'feat(practice): integrate all exercise components into PracticeClient'

Write-Host "Phase 7 done: PracticeClient integration (1 commit)" -ForegroundColor Cyan
Write-Host "=== PRACTICE FEATURE COMPLETE ===" -ForegroundColor Green

# Push practice commits
git push origin main 2>$null
Write-Host '[PUSHED] Practice feature commits' -ForegroundColor Magenta
