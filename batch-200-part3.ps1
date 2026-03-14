Set-Location 'D:\Do-An-Chuyen-Nganh'
$ErrorActionPreference = 'SilentlyContinue'
function CC($msg){git add -A 2>$null;$r=git status --porcelain 2>$null;if($r){git commit -m $msg 2>$null|Out-Null;Write-Host '[OK]' $msg -ForegroundColor Green}else{Write-Host '[SKIP]' $msg -ForegroundColor Yellow}}
function NF($f,$c,$m){$d=Split-Path $f -Parent;if($d -and !(Test-Path $d)){New-Item -ItemType Directory -Path $d -Force|Out-Null};$u=New-Object System.Text.UTF8Encoding $false;[System.IO.File]::WriteAllText((Join-Path $PWD $f),$c,$u);CC $m}
function AF($f,$l,$m){$p=Join-Path $PWD $f;$u=New-Object System.Text.UTF8Encoding $false;$e='';if(Test-Path $p){$e=[System.IO.File]::ReadAllText($p,$u)};[System.IO.File]::WriteAllText($p,$e+"`n"+$l,$u);CC $m}

Write-Host '=== PART 3: API + MIDDLEWARE + ERROR + MORE ===' -ForegroundColor Cyan

# ============================================
# API ROUTES (15 commits)
# ============================================

NF 'src/app/api/vocabulary/route.ts' @"
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('lesson_vocabularies')
    .select('id, word, phonetic, meaning, example, lesson_id', { count: 'exact' });

  if (search) {
    query = query.or('word.ilike.%' + search + '%,meaning.ilike.%' + search + '%');
  }

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .order('word', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count, page: Math.floor(offset / limit) + 1 });
}
"@ 'feat(api): add vocabulary search API route'

NF 'src/app/api/leaderboard/route.ts' @"
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sort') || 'xp';
  const limit = parseInt(searchParams.get('limit') || '50');

  const orderCol = sortBy === 'streak' ? 'streak' : 'xp';

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, xp, streak, level')
    .order(orderCol, { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data?.map((u, i) => ({ ...u, rank: i + 1 })) || [],
    total: data?.length || 0,
  });
}
"@ 'feat(api): add leaderboard ranking API route'

NF 'src/app/api/profile/xp/route.ts' @"
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { xpAmount, source } = body;

  if (!xpAmount || typeof xpAmount !== 'number' || xpAmount <= 0) {
    return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  const currentXp = profile?.xp || 0;
  const newXp = currentXp + xpAmount;

  const { error } = await supabase
    .from('profiles')
    .update({ xp: newXp })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ xp: newXp, added: xpAmount, source });
}
"@ 'feat(api): add XP award API route'

NF 'src/app/api/profile/streak/route.ts' @"
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('streak, longest_streak, last_activity')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const now = new Date();
  const lastActivity = profile.last_activity ? new Date(profile.last_activity) : null;
  let newStreak = 1;

  if (lastActivity) {
    const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    if (diffHours < 48 && diffHours > 20) {
      newStreak = (profile.streak || 0) + 1;
    } else if (diffHours < 20) {
      newStreak = profile.streak || 1;
    }
  }

  const longestStreak = Math.max(newStreak, profile.longest_streak || 0);

  const { error } = await supabase
    .from('profiles')
    .update({ streak: newStreak, longest_streak: longestStreak, last_activity: now.toISOString() })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ streak: newStreak, longestStreak });
}
"@ 'feat(api): add streak calculation API route'

NF 'src/app/api/achievements/check/route.ts' @"
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak, longest_streak')
    .eq('id', user.id)
    .single();

  const { data: unlockedIds } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user.id);

  const alreadyUnlocked = new Set((unlockedIds || []).map(a => a.achievement_id));
  const newUnlocks: string[] = [];

  const xp = profile?.xp || 0;
  const streak = profile?.streak || 0;
  const xpMilestones = [
    { id: 'xp-100', target: 100 },
    { id: 'xp-500', target: 500 },
    { id: 'xp-1000', target: 1000 },
    { id: 'xp-5000', target: 5000 },
  ];

  for (const m of xpMilestones) {
    if (xp >= m.target && !alreadyUnlocked.has(m.id)) {
      newUnlocks.push(m.id);
    }
  }

  const streakMilestones = [
    { id: 'streak-3', target: 3 },
    { id: 'streak-7', target: 7 },
    { id: 'streak-30', target: 30 },
  ];

  for (const m of streakMilestones) {
    if (streak >= m.target && !alreadyUnlocked.has(m.id)) {
      newUnlocks.push(m.id);
    }
  }

  if (newUnlocks.length > 0) {
    const inserts = newUnlocks.map(id => ({ user_id: user.id, achievement_id: id }));
    await supabase.from('user_achievements').insert(inserts);
  }

  return NextResponse.json({ newUnlocks, total: alreadyUnlocked.size + newUnlocks.length });
}
"@ 'feat(api): add achievement check and unlock API'

NF 'src/app/api/progress/route.ts' @"
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [profileRes, lessonsRes, achievementsRes] = await Promise.all([
    supabase.from('profiles').select('xp, streak, longest_streak, level').eq('id', user.id).single(),
    supabase.from('lesson_progress').select('id, score, xp_earned, status').eq('user_id', user.id),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
  ]);

  const profile = profileRes.data;
  const lessons = lessonsRes.data || [];
  const achievements = achievementsRes.data || [];

  const completed = lessons.filter(l => l.status === 'completed');
  const totalXpFromLessons = completed.reduce((s, l) => s + (l.xp_earned || 0), 0);
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, l) => s + (l.score || 0), 0) / completed.length)
    : 0;

  return NextResponse.json({
    profile,
    stats: {
      lessonsCompleted: completed.length,
      totalLessons: lessons.length,
      averageScore: avgScore,
      totalXpFromLessons,
      achievementsCount: achievements.length,
    },
  });
}
"@ 'feat(api): add user progress summary API'

NF 'src/app/api/review/save/route.ts' @"
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { results, totalWords, xpEarned } = body;

  if (xpEarned && xpEarned > 0) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', user.id)
      .single();

    await supabase
      .from('profiles')
      .update({ xp: (profile?.xp || 0) + xpEarned })
      .eq('id', user.id);
  }

  return NextResponse.json({ saved: true, totalWords, xpEarned });
}
"@ 'feat(api): add review session save API'

Write-Host "API routes: 7 commits done" -ForegroundColor Green

# ============================================
# ERROR PAGES & MIDDLEWARE (8 commits)
# ============================================

NF 'src/app/not-found.tsx' @"
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100\">
      <div className=\"text-center max-w-md px-6\">
        <div className=\"text-8xl font-black text-gray-200 mb-4\">404</div>
        <h1 className=\"text-2xl font-bold text-gray-900 mb-2\">Khong tim thay trang</h1>
        <p className=\"text-sm text-gray-500 mb-6\">
          Trang ban dang tim khong ton tai hoac da bi di chuyen.
        </p>
        <Link
          href=\"/dashboard\"
          className=\"inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/25\"
        >
          Ve trang chu
        </Link>
      </div>
    </div>
  );
}
"@ 'feat(pages): add custom 404 Not Found page'

NF 'src/app/global-error.tsx' @"
'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <div style={{ textAlign: 'center', maxWidth: 400, padding: 24 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>⚠️</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Co loi xay ra!</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>{error.message || 'Da co loi khong mong muon.'}</p>
            <button
              onClick={reset}
              style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Thu lai
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
"@ 'feat(pages): add global error boundary page'

NF 'src/app/dashboard/error.tsx' @"
'use client';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className=\"flex items-center justify-center min-h-[60vh]\">
      <div className=\"text-center max-w-sm\">
        <div className=\"text-5xl mb-4\">😵</div>
        <h2 className=\"text-xl font-bold text-gray-900 mb-2\">Loi tai trang</h2>
        <p className=\"text-sm text-gray-500 mb-4\">{error.message || 'Co loi xay ra khi tai trang nay.'}</p>
        <button
          onClick={reset}
          className=\"px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition\"
        >
          Thu lai
        </button>
      </div>
    </div>
  );
}
"@ 'feat(pages): add dashboard error boundary'

NF 'src/app/dashboard/loading.tsx' @"
export default function DashboardLoading() {
  return (
    <div className=\"flex items-center justify-center min-h-[60vh]\">
      <div className=\"flex flex-col items-center gap-3\">
        <div className=\"w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin\" />
        <p className=\"text-sm text-gray-500 font-medium\">Dang tai...</p>
      </div>
    </div>
  );
}
"@ 'feat(pages): add dashboard loading skeleton'

NF 'src/lib/error-boundary.ts' @"
/**
 * Error boundary utilities
 */
export class AppError extends Error {
  public code: string;
  public statusCode: number;

  constructor(message: string, code: string = 'UNKNOWN', statusCode: number = 500) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function getErrorMessage(error: unknown): string {
  if (isAppError(error)) return error.message;
  if (error instanceof Error) return error.message;
  return 'Da co loi khong mong muon';
}

export function createNotFoundError(resource: string): AppError {
  return new AppError(resource + ' khong tim thay', 'NOT_FOUND', 404);
}

export function createUnauthorizedError(): AppError {
  return new AppError('Ban khong co quyen truy cap', 'UNAUTHORIZED', 401);
}
"@ 'feat(lib): add error boundary utility classes'

NF 'src/lib/api-helpers.ts' @"
/**
 * API request helpers
 */
export async function fetchApi<T>(url: string, options?: RequestInit): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      ...options,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }));
      return { data: null, error: err.error || 'HTTP ' + res.status };
    }

    const data = await res.json();
    return { data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e.message : 'Network error' };
  }
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => k + '=' + encodeURIComponent(String(v))).join('&');
}
"@ 'feat(lib): add API request helper functions'

NF 'src/lib/rate-limit.ts' @"
/**
 * Simple in-memory rate limiter
 */
const requests = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(key: string, maxRequests: number = 60, windowMs: number = 60000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || now > entry.resetTime) {
    requests.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxRequests - entry.count };
}

export function getRateLimitKey(userId: string, action: string): string {
  return userId + ':' + action;
}
"@ 'feat(lib): add in-memory rate limiter'

NF 'src/lib/cache.ts' @"
/**
 * Simple in-memory cache with TTL
 */
const cache = new Map<string, { value: unknown; expiresAt: number }>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
}

export function setCache<T>(key: string, value: T, ttlMs: number = 300000): void {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
}

export function invalidateCache(pattern: string): void {
  for (const key of cache.keys()) {
    if (key.startsWith(pattern)) cache.delete(key);
  }
}

export function clearCache(): void {
  cache.clear();
}
"@ 'feat(lib): add in-memory cache with TTL support'

Write-Host "API + Error + Middleware: 15 commits done" -ForegroundColor Green

# ============================================
# MORE UI COMPONENTS (15 commits)
# ============================================
Write-Host '=== MORE UI COMPONENTS ===' -ForegroundColor Cyan

NF 'src/components/ui/SearchInput.tsx' @"
'use client';
import { useState } from 'react';
import { Search, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchInput({ value, onChange, placeholder = 'Tim kiem...' }: Props) {
  return (
    <div className='relative'>
      <Search className='w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400' />
      <input
        type='text'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition'
      />
      {value && (
        <button onClick={() => onChange('')} className='absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600'>
          <X className='w-3.5 h-3.5' />
        </button>
      )}
    </div>
  );
}
"@ 'feat(ui): add SearchInput component with clear button'

NF 'src/components/ui/TabGroup.tsx' @"
'use client';

interface Tab { id: string; label: string; icon?: React.ReactNode; }

interface Props {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function TabGroup({ tabs, activeTab, onTabChange }: Props) {
  return (
    <div className='flex gap-1 bg-gray-100 p-1 rounded-xl'>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={'flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition ' +
            (activeTab === tab.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700')}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
"@ 'feat(ui): add TabGroup navigation component'

NF 'src/components/ui/EmptySearch.tsx' @"
import { Search } from 'lucide-react';

interface Props {
  query: string;
  suggestion?: string;
}

export default function EmptySearch({ query, suggestion }: Props) {
  return (
    <div className='py-12 text-center'>
      <Search className='w-10 h-10 text-gray-200 mx-auto mb-3' />
      <p className='text-sm text-gray-500'>Khong tim thay ket qua cho <strong>\"{query}\"</strong></p>
      {suggestion && <p className='text-xs text-gray-400 mt-1'>Thu: {suggestion}</p>}
    </div>
  );
}
"@ 'feat(ui): add EmptySearch result component'

NF 'src/components/ui/XpBadge.tsx' @"
import { Zap } from 'lucide-react';

interface Props {
  amount: number;
  showPlus?: boolean;
  size?: 'sm' | 'md';
}

export default function XpBadge({ amount, showPlus = true, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={'inline-flex items-center gap-1 rounded-full font-bold bg-blue-100 text-blue-700 ' + sizeClass}>
      <Zap className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {showPlus && '+'}{amount} XP
    </span>
  );
}
"@ 'feat(ui): add XpBadge component with amount display'

NF 'src/components/ui/StreakBadge.tsx' @"
import { Flame } from 'lucide-react';

interface Props {
  days: number;
  size?: 'sm' | 'md';
}

export default function StreakBadge({ days, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  const color = days >= 30 ? 'bg-red-100 text-red-700' : days >= 7 ? 'bg-orange-100 text-orange-700' : 'bg-amber-100 text-amber-700';
  return (
    <span className={'inline-flex items-center gap-1 rounded-full font-bold ' + color + ' ' + sizeClass}>
      <Flame className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {days} ngay
    </span>
  );
}
"@ 'feat(ui): add StreakBadge component with color tiers'

NF 'src/components/ui/LevelBadge.tsx' @"
interface Props {
  level: string;
  size?: 'sm' | 'md';
}

const LEVEL_COLORS: Record<string, string> = {
  A1: 'bg-gray-100 text-gray-700', A2: 'bg-green-100 text-green-700',
  B1: 'bg-blue-100 text-blue-700', B2: 'bg-purple-100 text-purple-700',
  C1: 'bg-amber-100 text-amber-700', C2: 'bg-red-100 text-red-700',
};

export default function LevelBadge({ level, size = 'sm' }: Props) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  const color = LEVEL_COLORS[level] || 'bg-gray-100 text-gray-700';
  return (
    <span className={'inline-flex items-center rounded-full font-bold ' + color + ' ' + sizeClass}>
      {level}
    </span>
  );
}
"@ 'feat(ui): add LevelBadge component with CEFR colors'

NF 'src/components/ui/CountdownTimer.tsx' @"
'use client';
import { useState, useEffect } from 'react';

interface Props {
  targetDate: Date;
  onComplete?: () => void;
}

export default function CountdownTimer({ targetDate, onComplete }: Props) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const tick = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) { setTimeLeft('00:00:00'); onComplete?.(); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft([h, m, s].map(v => String(v).padStart(2, '0')).join(':'));
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetDate, onComplete]);

  return <span className='font-mono font-bold text-gray-700'>{timeLeft}</span>;
}
"@ 'feat(ui): add CountdownTimer real-time component'

NF 'src/components/ui/CircularProgress.tsx' @"
interface Props {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  showLabel?: boolean;
}

export default function CircularProgress({ value, max = 100, size = 60, strokeWidth = 5, color = '#3b82f6', showLabel = true }: Props) {
  const pct = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className='relative inline-flex items-center justify-center' style={{ width: size, height: size }}>
      <svg width={size} height={size} className='-rotate-90'>
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} stroke='#e5e7eb' fill='none' />
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} stroke={color} fill='none'
          strokeLinecap='round' strokeDasharray={circumference} strokeDashoffset={offset}
          className='transition-all duration-500' />
      </svg>
      {showLabel && (
        <span className='absolute text-xs font-bold text-gray-700'>{Math.round(pct)}%</span>
      )}
    </div>
  );
}
"@ 'feat(ui): add CircularProgress SVG component'

NF 'src/components/ui/GradientCard.tsx' @"
interface Props {
  gradient?: string;
  children: React.ReactNode;
  className?: string;
}

const GRADIENTS: Record<string, string> = {
  blue: 'linear-gradient(135deg, #3b82f6, #2563eb)',
  purple: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
  emerald: 'linear-gradient(135deg, #10b981, #059669)',
  amber: 'linear-gradient(135deg, #f59e0b, #d97706)',
  rose: 'linear-gradient(135deg, #f43f5e, #e11d48)',
  cyan: 'linear-gradient(135deg, #06b6d4, #0891b2)',
};

export default function GradientCard({ gradient = 'blue', children, className = '' }: Props) {
  const bg = GRADIENTS[gradient] || GRADIENTS.blue;
  return (
    <div className={'rounded-2xl p-6 text-white relative overflow-hidden ' + className} style={{ background: bg }}>
      <div className='absolute top-[-30%] right-[-15%] w-[200px] h-[200px] rounded-full' style={{ background: 'rgba(255,255,255,0.07)' }} />
      <div className='relative z-10'>{children}</div>
    </div>
  );
}
"@ 'feat(ui): add GradientCard with preset color schemes'

NF 'src/components/ui/DataTable.tsx' @"
interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
}

export default function DataTable<T extends { id: string }>({ data, columns, emptyMessage = 'Khong co du lieu' }: Props<T>) {
  if (data.length === 0) {
    return <div className='text-center py-8 text-sm text-gray-400'>{emptyMessage}</div>;
  }

  return (
    <div className='overflow-x-auto'>
      <table className='w-full text-sm'>
        <thead>
          <tr className='border-b border-gray-200'>
            {columns.map((col) => (
              <th key={String(col.key)} className='text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider'>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className='border-b border-gray-100 hover:bg-gray-50 transition'>
              {columns.map((col) => (
                <td key={String(col.key)} className='py-3 px-4 text-gray-700'>
                  {col.render ? col.render(row[col.key], row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
"@ 'feat(ui): add generic DataTable component'

NF 'src/components/ui/FeatureCard.tsx' @"
interface Props {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  color?: string;
}

export default function FeatureCard({ icon, title, description, href, color = '#3b82f6' }: Props) {
  const Wrapper = href ? 'a' : 'div';
  return (
    <Wrapper
      href={href}
      className='block bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all group cursor-pointer'
    >
      <div className='w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110'
        style={{ background: color + '15', color }}>
        {icon}
      </div>
      <h3 className='text-sm font-bold text-gray-900 mb-1'>{title}</h3>
      <p className='text-xs text-gray-500 leading-relaxed'>{description}</p>
    </Wrapper>
  );
}
"@ 'feat(ui): add FeatureCard with hover animation'

NF 'src/components/ui/AchievementCard.tsx' @"
import { Trophy, Lock, Check } from 'lucide-react';

interface Props {
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  xpReward: number;
}

const rarityColors: Record<string, { bg: string; border: string; text: string }> = {
  common: { bg: '#f1f5f9', border: '#e2e8f0', text: '#64748b' },
  uncommon: { bg: '#d1fae5', border: '#a7f3d0', text: '#059669' },
  rare: { bg: '#dbeafe', border: '#93c5fd', text: '#2563eb' },
  epic: { bg: '#ede9fe', border: '#c4b5fd', text: '#7c3aed' },
  legendary: { bg: '#fef3c7', border: '#fcd34d', text: '#d97706' },
};

export default function AchievementCard({ name, description, icon, rarity, unlocked, xpReward }: Props) {
  const colors = rarityColors[rarity] || rarityColors.common;
  return (
    <div className={'relative border rounded-2xl p-4 transition ' + (unlocked ? 'hover:shadow-md' : 'opacity-60')}
      style={{ background: unlocked ? colors.bg : '#f8fafc', borderColor: colors.border }}>
      <div className='flex items-start gap-3'>
        <div className='text-2xl'>{icon}</div>
        <div className='flex-1'>
          <h4 className='text-sm font-bold' style={{ color: colors.text }}>{name}</h4>
          <p className='text-xs text-gray-500 mt-0.5'>{description}</p>
          <div className='flex items-center gap-2 mt-2'>
            <span className='text-[10px] font-bold uppercase tracking-wider' style={{ color: colors.text }}>{rarity}</span>
            <span className='text-[10px] text-gray-400'>+{xpReward} XP</span>
          </div>
        </div>
        <div className='w-6 h-6 flex items-center justify-center'>
          {unlocked ? <Check className='w-4 h-4 text-emerald-500' /> : <Lock className='w-4 h-4 text-gray-300' />}
        </div>
      </div>
    </div>
  );
}
"@ 'feat(ui): add AchievementCard with rarity styling'

NF 'src/components/ui/WordCard.tsx' @"
'use client';
import { Volume2, Star, Brain } from 'lucide-react';

interface Props {
  word: string;
  phonetic?: string;
  meaning: string;
  example?: string;
  isFavorite?: boolean;
  onSpeak?: () => void;
  onToggleFavorite?: () => void;
}

export default function WordCard({ word, phonetic, meaning, example, isFavorite, onSpeak, onToggleFavorite }: Props) {
  return (
    <div className='flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition'>
      <div className='w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0'>
        <Brain className='w-5 h-5 text-purple-500' />
      </div>
      <div className='flex-1 min-w-0'>
        <div className='flex items-center gap-2'>
          <span className='font-bold text-gray-900'>{word}</span>
          {phonetic && <span className='text-xs text-gray-400 italic'>{phonetic}</span>}
        </div>
        <p className='text-sm text-indigo-600 font-medium'>{meaning}</p>
        {example && <p className='text-xs text-gray-400 truncate mt-0.5'>{example}</p>}
      </div>
      <div className='flex gap-1.5'>
        {onSpeak && (
          <button onClick={onSpeak} className='w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-300 transition'>
            <Volume2 className='w-3.5 h-3.5' />
          </button>
        )}
        {onToggleFavorite && (
          <button onClick={onToggleFavorite} className='w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center transition'
            style={isFavorite ? { color: '#f59e0b', borderColor: '#f59e0b' } : { color: '#94a3b8' }}>
            <Star className='w-3.5 h-3.5' />
          </button>
        )}
      </div>
    </div>
  );
}
"@ 'feat(ui): add WordCard vocabulary display component'

NF 'src/components/ui/PracticeCard.tsx' @"
import { Brain, PenLine, Headphones, ChevronRight } from 'lucide-react';

interface Props {
  mode: 'vocab' | 'fillblank' | 'listening';
  title: string;
  description: string;
  xpPerQuestion: number;
  totalQuestions: number;
  onClick: () => void;
}

const icons = { vocab: Brain, fillblank: PenLine, listening: Headphones };
const colors = { vocab: '#3b82f6', fillblank: '#8b5cf6', listening: '#06b6d4' };

export default function PracticeCard({ mode, title, description, xpPerQuestion, totalQuestions, onClick }: Props) {
  const Icon = icons[mode];
  const color = colors[mode];

  return (
    <button onClick={onClick}
      className='w-full text-left bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all group'>
      <div className='flex items-start gap-4'>
        <div className='w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0'
          style={{ background: color + '15' }}>
          <Icon className='w-5 h-5' style={{ color }} />
        </div>
        <div className='flex-1'>
          <h3 className='text-sm font-bold text-gray-900 mb-0.5'>{title}</h3>
          <p className='text-xs text-gray-500'>{description}</p>
          <div className='flex items-center gap-3 mt-2 text-[11px] text-gray-400'>
            <span>+{xpPerQuestion} XP/cau</span>
            <span>{totalQuestions} cau</span>
          </div>
        </div>
        <ChevronRight className='w-5 h-5 text-gray-300 group-hover:text-blue-500 transition mt-1' />
      </div>
    </button>
  );
}
"@ 'feat(ui): add PracticeCard mode selection component'

Write-Host "UI Components: 14 commits done" -ForegroundColor Green

# Push
git push origin main 2>$null
Write-Host '[PUSHED] Part 3' -ForegroundColor Magenta
$t = git log --oneline | Measure-Object -Line
Write-Host "Total: $($t.Lines) commits" -ForegroundColor Cyan
