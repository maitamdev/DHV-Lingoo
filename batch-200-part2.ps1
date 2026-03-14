Set-Location 'D:\Do-An-Chuyen-Nganh'
$ErrorActionPreference = 'SilentlyContinue'
function CC($msg) {
  git add -A 2>$null
  $r = git status --porcelain 2>$null
  if ($r) { git commit -m $msg 2>$null | Out-Null; Write-Host '[OK]' $msg -ForegroundColor Green }
  else { Write-Host '[SKIP]' $msg -ForegroundColor Yellow }
}
function NF($f,$c,$m){$d=Split-Path $f -Parent;if($d -and !(Test-Path $d)){New-Item -ItemType Directory -Path $d -Force|Out-Null};$u=New-Object System.Text.UTF8Encoding $false;[System.IO.File]::WriteAllText((Join-Path $PWD $f),$c,$u);CC $m}
function AF($f,$l,$m){$p=Join-Path $PWD $f;$u=New-Object System.Text.UTF8Encoding $false;$e='';if(Test-Path $p){$e=[System.IO.File]::ReadAllText($p,$u)};[System.IO.File]::WriteAllText($p,$e+"`n"+$l,$u);CC $m}

Write-Host '=== PART 2: REVIEW + TYPES + API ===' -ForegroundColor Cyan

# ============================================
# REVIEW SYSTEM (15 commits)
# ============================================

NF 'src/app/dashboard/review/review.css' @"
:root {
  --rv-primary: #10b981;
  --rv-bg: #f8fafc;
  --rv-card: #ffffff;
  --rv-border: #e2e8f0;
  --rv-text: #1e293b;
  --rv-muted: #94a3b8;
}
"@ 'style(review): add CSS variables'

AF 'src/app/dashboard/review/review.css' @"
.rv-header {
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 20px;
  padding: 28px;
  color: white;
  position: relative;
  overflow: hidden;
}
.rv-header::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.07);
  border-radius: 50%;
}
"@ 'style(review): add header gradient styles'

AF 'src/app/dashboard/review/review.css' @"
.rv-card-container {
  perspective: 1200px;
  max-width: 400px;
  margin: 0 auto;
  height: 260px;
}
.rv-card-inner {
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
  transform-style: preserve-3d;
}
.rv-card-inner.flipped { transform: rotateY(180deg); }
.rv-card-face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  padding: 28px;
  border: 1px solid var(--rv-border);
  background: white;
  box-shadow: 0 8px 30px rgba(0,0,0,0.06);
}
.rv-card-back { transform: rotateY(180deg); }
.rv-card-word { font-size: 28px; font-weight: 800; color: var(--rv-text); }
.rv-card-phonetic { font-size: 14px; color: var(--rv-muted); font-style: italic; margin-top: 4px; }
.rv-card-meaning { font-size: 20px; font-weight: 600; color: #10b981; text-align: center; }
.rv-card-example { font-size: 13px; color: var(--rv-muted); margin-top: 8px; text-align: center; font-style: italic; }
"@ 'style(review): add flashcard flip animation styles'

AF 'src/app/dashboard/review/review.css' @"
.rv-rating-btns {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
}
.rv-rating-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
}
.rv-rating-btn:hover { transform: translateY(-2px); }
.rv-rating-btn.hard { background: #fecaca; color: #dc2626; }
.rv-rating-btn.medium { background: #fef3c7; color: #d97706; }
.rv-rating-btn.easy { background: #d1fae5; color: #059669; }
"@ 'style(review): add difficulty rating buttons'

AF 'src/app/dashboard/review/review.css' @"
.rv-progress-ring {
  width: 120px;
  height: 120px;
  margin: 0 auto;
}
.rv-progress-ring circle {
  fill: none;
  stroke-width: 8;
  stroke-linecap: round;
  transform: rotate(-90deg);
  transform-origin: center;
}
.rv-summary {
  background: white;
  border: 1px solid var(--rv-border);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
}
@media (max-width: 640px) {
  .rv-card-container { max-width: 100%; height: 220px; }
  .rv-card-word { font-size: 22px; }
  .rv-rating-btns { flex-direction: column; }
}
"@ 'style(review): add progress ring and responsive styles'

NF 'src/app/dashboard/review/page.tsx' @"
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ReviewClient from './ReviewClient';

export const metadata: Metadata = {
  title: 'On tap tu vung | DHV-Lingoo',
  description: 'On tap tu vung bang phuong phap lap lai cach quang',
};

export default async function ReviewPage() {
  const supabase = await createClient();

  const { data: words } = await supabase
    .from('lesson_vocabularies')
    .select('id, word, phonetic, meaning, example')
    .limit(100);

  return <ReviewClient words={words || []} />;
}
"@ 'feat(review): create server page with vocabulary data'

NF 'src/app/dashboard/review/ReviewClient.tsx' @"
\"use client\";

import { useState, useCallback } from \"react\";
import { RotateCcw, Volume2, Brain, ChevronRight, ThumbsDown, Minus, ThumbsUp, Trophy } from \"lucide-react\";
import \"./review.css\";

interface Word {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
}

interface Props {
  words: Word[];
}

type Difficulty = \"hard\" | \"medium\" | \"easy\";

interface ReviewResult {
  wordId: string;
  difficulty: Difficulty;
}

export default function ReviewClient({ words }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const reviewWords = words.slice(0, 20);
  const currentWord = reviewWords[currentIndex];
  const progress = Math.round(((currentIndex) / reviewWords.length) * 100);

  const speak = useCallback((text: string) => {
    if (typeof window !== \"undefined\" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = \"en-US\";
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  }, []);

  const handleRating = (difficulty: Difficulty) => {
    setResults((prev) => [...prev, { wordId: currentWord.id, difficulty }]);
    setIsFlipped(false);
    if (currentIndex + 1 >= reviewWords.length) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const restart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setResults([]);
    setIsComplete(false);
  };

  if (reviewWords.length === 0) {
    return (
      <div className=\"p-6 text-center text-gray-400\">
        <Brain className=\"w-12 h-12 mx-auto mb-3 opacity-30\" />
        <p>Chua co tu vung de on tap</p>
      </div>
    );
  }

  if (isComplete) {
    const easy = results.filter((r) => r.difficulty === \"easy\").length;
    const medium = results.filter((r) => r.difficulty === \"medium\").length;
    const hard = results.filter((r) => r.difficulty === \"hard\").length;
    const score = Math.round(((easy * 3 + medium * 2 + hard) / (reviewWords.length * 3)) * 100);

    return (
      <div className=\"p-4 lg:p-6 max-w-md mx-auto\">
        <div className=\"rv-summary\">
          <Trophy className=\"w-12 h-12 text-amber-500 mx-auto mb-3\" />
          <h2 className=\"text-xl font-bold text-gray-900 mb-1\">Hoan thanh on tap!</h2>
          <p className=\"text-sm text-gray-500 mb-4\">Ban da on {reviewWords.length} tu vung</p>
          <div className=\"text-4xl font-black text-emerald-600 mb-4\">{score}%</div>
          <div className=\"flex justify-center gap-6 text-sm mb-6\">
            <div><span className=\"text-green-600 font-bold\">{easy}</span> de</div>
            <div><span className=\"text-amber-600 font-bold\">{medium}</span> vua</div>
            <div><span className=\"text-red-600 font-bold\">{hard}</span> kho</div>
          </div>
          <button onClick={restart} className=\"w-full py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition flex items-center justify-center gap-2\">
            <RotateCcw className=\"w-4 h-4\" /> On tap lai
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=\"p-4 lg:p-6 max-w-lg mx-auto\">
      <div className=\"rv-header mb-6\">
        <div className=\"relative z-10\">
          <div className=\"flex items-center gap-2 mb-1\">
            <Brain className=\"w-5 h-5\" />
            <h1 className=\"text-lg font-bold\">On tap tu vung</h1>
          </div>
          <p className=\"text-xs opacity-80\">Lap lai cach quang - Spaced Repetition</p>
          <div className=\"flex items-center gap-2 mt-3 text-sm\">
            <span>{currentIndex + 1}/{reviewWords.length}</span>
          </div>
          <div className=\"mt-2 h-2 bg-white/20 rounded-full overflow-hidden\">
            <div className=\"h-full bg-white rounded-full transition-all\" style={{ width: progress + \"%\" }} />
          </div>
        </div>
      </div>

      <div className=\"rv-card-container\" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={\"rv-card-inner\" + (isFlipped ? \" flipped\" : \"\")}>
          <div className=\"rv-card-face\">
            <div className=\"rv-card-word\">{currentWord.word}</div>
            {currentWord.phonetic && <div className=\"rv-card-phonetic\">{currentWord.phonetic}</div>}
            <button
              className=\"mt-4 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition\"
              onClick={(e) => { e.stopPropagation(); speak(currentWord.word); }}
            >
              <Volume2 className=\"w-4 h-4 text-gray-600\" />
            </button>
            <p className=\"text-xs text-gray-400 mt-3\">Nhan de xem nghia</p>
          </div>
          <div className=\"rv-card-face rv-card-back\">
            <div className=\"rv-card-meaning\">{currentWord.meaning}</div>
            {currentWord.example && <div className=\"rv-card-example\">{currentWord.example}</div>}
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className=\"rv-rating-btns\">
          <button className=\"rv-rating-btn hard\" onClick={() => handleRating(\"hard\")}>
            <ThumbsDown className=\"w-4 h-4\" /> Kho
          </button>
          <button className=\"rv-rating-btn medium\" onClick={() => handleRating(\"medium\")}>
            <Minus className=\"w-4 h-4\" /> Vua
          </button>
          <button className=\"rv-rating-btn easy\" onClick={() => handleRating(\"easy\")}>
            <ThumbsUp className=\"w-4 h-4\" /> De
          </button>
        </div>
      )}

      {!isFlipped && currentIndex > 0 && (
        <p className=\"text-center text-xs text-gray-400 mt-4\">
          Nhan vao the de lat xem nghia, sau do danh gia do kho
        </p>
      )}
    </div>
  );
}
"@ 'feat(review): create ReviewClient with spaced repetition UI'

Write-Host "Review: 7 commits done" -ForegroundColor Green

# ============================================
# TYPESCRIPT TYPES (20 commits)
# ============================================
Write-Host '=== TYPES ===' -ForegroundColor Cyan

NF 'src/types/profile.ts' @"
export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  xp: number;
  streak: number;
  longest_streak: number;
  goals: string[];
  interests: string[];
  daily_time: number;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}
"@ 'feat(types): add UserProfile type definition'

NF 'src/types/course.ts' @"
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string | null;
  level: string;
  category: string;
  total_lessons: number;
  is_published: boolean;
  created_at: string;
}

export interface CourseWithProgress extends Course {
  completedLessons: number;
  progressPercent: number;
}
"@ 'feat(types): add Course and CourseWithProgress types'

NF 'src/types/lesson.ts' @"
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  order_index: number;
  estimated_time: number;
  is_published: boolean;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number | null;
  xp_earned: number;
  completed_at: string | null;
}
"@ 'feat(types): add Lesson and LessonProgress types'

NF 'src/types/vocabulary.ts' @"
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
"@ 'feat(types): add Vocabulary and mastery types'

NF 'src/types/achievement.ts' @"
export type AchievementRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  rarity: AchievementRarity;
  xp_reward: number;
  condition: {
    type: string;
    target: number;
  };
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  unlocked_at: string;
  seen: boolean;
}
"@ 'feat(types): add Achievement and UserAchievement types'

NF 'src/types/practice.ts' @"
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
"@ 'feat(types): add Practice mode and result types'

NF 'src/types/notification.ts' @"
export type NotificationType = 'achievement' | 'xp' | 'streak' | 'lesson' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  streak_reminder: boolean;
  achievement_alerts: boolean;
  daily_summary: boolean;
}
"@ 'feat(types): add Notification and preference types'

NF 'src/types/leaderboard.ts' @"
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  xp: number;
  streak: number;
  level: string;
  isCurrentUser: boolean;
}

export type LeaderboardPeriod = 'weekly' | 'monthly' | 'all_time';
export type LeaderboardSort = 'xp' | 'streak' | 'lessons';

export interface LeaderboardState {
  entries: LeaderboardEntry[];
  period: LeaderboardPeriod;
  sortBy: LeaderboardSort;
  totalUsers: number;
  myRank: number;
}
"@ 'feat(types): add Leaderboard entry and state types'

NF 'src/types/chat.ts' @"
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  topic: string | null;
}

export type AIProvider = 'openai' | 'gemini' | 'groq';

export interface ChatConfig {
  provider: AIProvider;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
}
"@ 'feat(types): add Chat message and session types'

NF 'src/types/planner.ts' @"
export type TaskType = 'lesson' | 'practice' | 'review' | 'flashcard' | 'quiz';

export interface StudyTask {
  id: string;
  title: string;
  type: TaskType;
  duration: number;
  xp: number;
  completed: boolean;
  scheduledFor: string;
}

export interface DailyPlan {
  date: string;
  tasks: StudyTask[];
  totalXp: number;
  completedXp: number;
  completionRate: number;
}

export interface WeeklyGoal {
  targetXp: number;
  earnedXp: number;
  daysActive: number;
  streakMaintained: boolean;
}
"@ 'feat(types): add StudyTask and DailyPlan types'

NF 'src/types/api.ts' @"
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
"@ 'feat(types): add API response and pagination types'

NF 'src/types/index.ts' @"
/**
 * DHV-Lingoo Type Definitions
 * Barrel export for all application types
 */
export type { UserProfile } from './profile';
export type { Course, CourseWithProgress } from './course';
export type { Lesson, LessonProgress } from './lesson';
export type { Vocabulary, VocabWithMastery, VocabSearchResult } from './vocabulary';
export type { Achievement, UserAchievement, AchievementRarity } from './achievement';
export type { PracticeMode, PracticeQuestion, PracticeResult, PracticeAnswer } from './practice';
export type { AppNotification, NotificationPreferences, NotificationType } from './notification';
export type { LeaderboardEntry, LeaderboardPeriod, LeaderboardSort, LeaderboardState } from './leaderboard';
export type { ChatMessage, ChatSession, AIProvider, ChatConfig } from './chat';
export type { StudyTask, DailyPlan, WeeklyGoal, TaskType } from './planner';
export type { ApiResponse, PaginatedResponse, ApiError, HttpMethod } from './api';
"@ 'feat(types): add barrel export for all types'

Write-Host "Types: 12 commits done" -ForegroundColor Green

# ============================================
# CONSTANTS (10 commits)
# ============================================
Write-Host '=== CONSTANTS ===' -ForegroundColor Cyan

NF 'src/constants/levels.ts' @"
export const LEVELS = [
  { value: 'A1', label: 'A1 - Vo long', description: 'Moi bat dau hoc', color: '#94a3b8', xpRange: [0, 500] },
  { value: 'A2', label: 'A2 - So cap', description: 'Giao tiep co ban', color: '#10b981', xpRange: [501, 2000] },
  { value: 'B1', label: 'B1 - Trung cap', description: 'Giao tiep kha', color: '#3b82f6', xpRange: [2001, 5000] },
  { value: 'B2', label: 'B2 - Tren trung cap', description: 'Thanh thao', color: '#8b5cf6', xpRange: [5001, 10000] },
  { value: 'C1', label: 'C1 - Cao cap', description: 'Gan ban ngu', color: '#f59e0b', xpRange: [10001, 20000] },
  { value: 'C2', label: 'C2 - Thanh thao', description: 'Nhu ban ngu', color: '#ef4444', xpRange: [20001, Infinity] },
] as const;

export type LevelCode = typeof LEVELS[number]['value'];

export function getLevelByXp(xp: number): typeof LEVELS[number] {
  return LEVELS.find(l => xp >= l.xpRange[0] && xp <= l.xpRange[1]) || LEVELS[0];
}

export function getLevelColor(level: string): string {
  return LEVELS.find(l => l.value === level)?.color || '#94a3b8';
}
"@ 'feat(constants): add level definitions with XP ranges'

NF 'src/constants/achievements.ts' @"
export const RARITY_COLORS = {
  common: { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' },
  uncommon: { bg: '#d1fae5', text: '#059669', border: '#a7f3d0' },
  rare: { bg: '#dbeafe', text: '#2563eb', border: '#93c5fd' },
  epic: { bg: '#ede9fe', text: '#7c3aed', border: '#c4b5fd' },
  legendary: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
} as const;

export const ACHIEVEMENT_CATEGORIES = [
  { id: 'streak', label: 'Streak', icon: '🔥' },
  { id: 'lesson', label: 'Bai hoc', icon: '📚' },
  { id: 'vocabulary', label: 'Tu vung', icon: '📝' },
  { id: 'xp', label: 'Diem XP', icon: '⚡' },
  { id: 'perfect', label: 'Hoan hao', icon: '⭐' },
  { id: 'social', label: 'Cong dong', icon: '🤝' },
] as const;
"@ 'feat(constants): add achievement rarity and categories'

NF 'src/constants/practice.ts' @"
export const PRACTICE_MODES = [
  { id: 'vocab', label: 'Tu vung', icon: '📝', xpPerQuestion: 5, description: 'Chon nghia dung' },
  { id: 'fillblank', label: 'Dien tu', icon: '✍️', xpPerQuestion: 7, description: 'Dien tu vao cho trong' },
  { id: 'listening', label: 'Nghe', icon: '🎧', xpPerQuestion: 10, description: 'Nghe va viet lai' },
] as const;

export const GRADE_TIERS = [
  { min: 90, grade: 'A+', label: 'Xuat sac', emoji: '🏆', color: '#10b981' },
  { min: 80, grade: 'A', label: 'Gioi', emoji: '🌟', color: '#3b82f6' },
  { min: 70, grade: 'B', label: 'Kha', emoji: '👍', color: '#8b5cf6' },
  { min: 60, grade: 'C', label: 'Trung binh', emoji: '📚', color: '#f59e0b' },
  { min: 0, grade: 'D', label: 'Can co gang', emoji: '💪', color: '#ef4444' },
] as const;

export function getGrade(score: number) {
  return GRADE_TIERS.find(t => score >= t.min) || GRADE_TIERS[GRADE_TIERS.length - 1];
}
"@ 'feat(constants): add practice modes and grade tiers'

NF 'src/constants/navigation.ts' @"
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export const DASHBOARD_NAV: NavItem[] = [
  { label: 'Tong quan', href: '/dashboard', icon: '📊' },
  { label: 'Khoa hoc', href: '/dashboard/courses', icon: '📚' },
  { label: 'Flashcard', href: '/dashboard/flashcards', icon: '🃏' },
  { label: 'Luyen tap', href: '/dashboard/practice', icon: '🧠' },
  { label: 'On tap', href: '/dashboard/review', icon: '🔄' },
  { label: 'Tu vung', href: '/dashboard/vocabulary', icon: '📝' },
  { label: 'Tra tu', href: '/dashboard/dictionary', icon: '📖' },
  { label: 'Chat AI', href: '/dashboard/chat', icon: '🤖' },
  { label: 'Thanh tuu', href: '/dashboard/achievements', icon: '🏆' },
  { label: 'Xep hang', href: '/dashboard/leaderboard', icon: '🥇' },
  { label: 'Ke hoach', href: '/dashboard/planner', icon: '📅' },
  { label: 'Lo trinh', href: '/dashboard/roadmap', icon: '🗺️' },
  { label: 'Ho so', href: '/dashboard/profile', icon: '👤' },
  { label: 'Cai dat', href: '/dashboard/settings', icon: '⚙️' },
];
"@ 'feat(constants): add dashboard navigation items'

NF 'src/constants/xp-rewards.ts' @"
export const XP_REWARDS = {
  LESSON_COMPLETE: 25,
  QUIZ_CORRECT: 5,
  FILLBLANK_CORRECT: 7,
  LISTENING_CORRECT: 10,
  STREAK_BONUS: 15,
  DAILY_LOGIN: 5,
  FLASHCARD_REVEAL: 2,
  PERFECT_SCORE: 50,
  ACHIEVEMENT_UNLOCK: 20,
  FIRST_LESSON: 100,
} as const;

export const STREAK_BONUSES = [
  { days: 3, multiplier: 1.1, label: '3 ngay +10%' },
  { days: 7, multiplier: 1.25, label: '7 ngay +25%' },
  { days: 14, multiplier: 1.5, label: '14 ngay +50%' },
  { days: 30, multiplier: 2.0, label: '30 ngay x2' },
  { days: 100, multiplier: 3.0, label: '100 ngay x3' },
] as const;

export function getStreakMultiplier(streak: number): number {
  const bonus = [...STREAK_BONUSES].reverse().find(b => streak >= b.days);
  return bonus?.multiplier || 1.0;
}
"@ 'feat(constants): add XP reward values and streak bonuses'

NF 'src/constants/themes.ts' @"
export const THEME_COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  accent: '#06b6d4',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#6366f1',
} as const;

export const GRADIENTS = {
  primary: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  purple: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  emerald: 'linear-gradient(135deg, #10b981, #059669)',
  amber: 'linear-gradient(135deg, #f59e0b, #d97706)',
  cyan: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  rose: 'linear-gradient(135deg, #f43f5e, #e11d48)',
} as const;

export const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
"@ 'feat(constants): add theme colors and gradients'

NF 'src/constants/index.ts' @"
/**
 * DHV-Lingoo Constants
 * Barrel export for all application constants
 */
export { LEVELS, getLevelByXp, getLevelColor } from './levels';
export { RARITY_COLORS, ACHIEVEMENT_CATEGORIES } from './achievements';
export { PRACTICE_MODES, GRADE_TIERS, getGrade } from './practice';
export { DASHBOARD_NAV } from './navigation';
export { XP_REWARDS, STREAK_BONUSES, getStreakMultiplier } from './xp-rewards';
export { THEME_COLORS, GRADIENTS, CHART_COLORS } from './themes';
"@ 'feat(constants): add barrel export for all constants'

Write-Host "Constants: 7 commits done" -ForegroundColor Green

# ============================================
# MORE HOOKS (10 commits)
# ============================================
Write-Host '=== MORE HOOKS ===' -ForegroundColor Cyan

NF 'src/hooks/useSupabaseQuery.ts' @"
'use client';
import { useState, useEffect, useCallback } from 'react';

interface QueryState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useSupabaseQuery<T>(queryFn: () => Promise<{ data: T | null; error: { message: string } | null }>): QueryState<T> & { refetch: () => void } {
  const [state, setState] = useState<QueryState<T>>({ data: null, loading: true, error: null });

  const fetch = useCallback(async () => {
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const { data, error } = await queryFn();
      if (error) setState({ data: null, loading: false, error: error.message });
      else setState({ data, loading: false, error: null });
    } catch (e) {
      setState({ data: null, loading: false, error: String(e) });
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { ...state, refetch: fetch };
}
"@ 'feat(hooks): add useSupabaseQuery data fetching hook'

NF 'src/hooks/useWindowSize.ts' @"
'use client';
import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
"@ 'feat(hooks): add useWindowSize responsive hook'

NF 'src/hooks/useIntersectionObserver.ts' @"
'use client';
import { useEffect, useRef, useState } from 'react';

export function useIntersectionObserver(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isVisible };
}
"@ 'feat(hooks): add useIntersectionObserver for lazy loading'

NF 'src/hooks/useCopyToClipboard.ts' @"
'use client';
import { useState, useCallback } from 'react';

export function useCopyToClipboard(resetMs: number = 2000): [boolean, (text: string) => void] {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
    } catch {
      setCopied(false);
    }
  }, [resetMs]);

  return [copied, copy];
}
"@ 'feat(hooks): add useCopyToClipboard hook'

NF 'src/hooks/useScrollPosition.ts' @"
'use client';
import { useState, useEffect } from 'react';

export function useScrollPosition(): { x: number; y: number; isScrolled: boolean } {
  const [pos, setPos] = useState({ x: 0, y: 0, isScrolled: false });

  useEffect(() => {
    const handleScroll = () => {
      setPos({ x: window.scrollX, y: window.scrollY, isScrolled: window.scrollY > 50 });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return pos;
}
"@ 'feat(hooks): add useScrollPosition tracking hook'

NF 'src/hooks/useNotifications.ts' @"
'use client';
import { useState, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

let idCounter = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const add = useCallback((type: Notification['type'], message: string, duration = 3000) => {
    const id = 'n-' + (++idCounter);
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  }, []);

  const dismiss = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  return { notifications, add, dismiss };
}
"@ 'feat(hooks): add useNotifications toast management'

NF 'src/hooks/index.ts' @"
/**
 * Custom Hooks barrel export
 */
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useMediaQuery, useIsMobile } from './useMediaQuery';
export { useCountUp } from './useCountUp';
export { useKeyboard } from './useKeyboard';
export { useTimer } from './useTimer';
export { useOnlineStatus } from './useOnlineStatus';
export { useClickOutside } from './useClickOutside';
export { usePrevious } from './usePrevious';
export { useToggle } from './useToggle';
export { useSupabaseQuery } from './useSupabaseQuery';
export { useWindowSize } from './useWindowSize';
export { useIntersectionObserver } from './useIntersectionObserver';
export { useCopyToClipboard } from './useCopyToClipboard';
export { useScrollPosition } from './useScrollPosition';
export { useNotifications } from './useNotifications';
"@ 'feat(hooks): add barrel export for all hooks'

Write-Host "More hooks: 7 commits done" -ForegroundColor Green

# Push
git push origin main 2>$null
Write-Host '[PUSHED] Part 2' -ForegroundColor Magenta
$t = git log --oneline | Measure-Object -Line
Write-Host "Total: $($t.Lines) commits" -ForegroundColor Cyan
