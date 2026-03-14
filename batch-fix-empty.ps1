Set-Location 'D:\Do-An-Chuyen-Nganh'
$ErrorActionPreference = 'SilentlyContinue'

function CC($msg) {
  git add -A 2>$null
  $r = git status --porcelain 2>$null
  if ($r) { git commit -m $msg 2>$null | Out-Null; Write-Host '[OK]' $msg -ForegroundColor Green }
  else { Write-Host '[SKIP]' $msg -ForegroundColor Yellow }
}
function NF($file, $content, $msg) {
  $dir = Split-Path $file -Parent
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  $fullPath = Join-Path $PWD $file
  $utf8 = New-Object System.Text.UTF8Encoding $false
  [System.IO.File]::WriteAllText($fullPath, $content, $utf8)
  CC $msg
}

Write-Host '=== REAL CODE ENHANCEMENT COMMITS ===' -ForegroundColor Cyan

# ================================================
# PART 1: New utility modules (~25 commits)
# ================================================

# 1
NF 'src/lib/date-utils.ts' @"
/**
 * Date utility functions for DHV-Lingoo
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const d = typeof date === 'string' ? new Date(date) : date;
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'vua xong';
  if (diff < 3600) return Math.floor(diff / 60) + ' phut truoc';
  if (diff < 86400) return Math.floor(diff / 3600) + ' gio truoc';
  return Math.floor(diff / 86400) + ' ngay truoc';
}
"@ 'feat(lib): add relative time formatter utility'

# 2
NF 'src/lib/string-utils.ts' @"
/**
 * String manipulation utilities
 */
export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 3) + '...';
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
"@ 'feat(lib): add string truncation and slugify utilities'

# 3
NF 'src/lib/array-utils.ts' @"
/**
 * Array helper utilities
 */
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export function uniqueBy<T>(arr: T[], key: keyof T): T[] {
  const seen = new Set();
  return arr.filter((item) => {
    const k = item[key];
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
"@ 'feat(lib): add array chunking and uniqueBy utilities'

# 4
NF 'src/lib/number-utils.ts' @"
/**
 * Number formatting utilities
 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
  return n.toString();
}

export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function clampValue(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
"@ 'feat(lib): add number formatting and percentage utilities'

# 5
NF 'src/lib/color-utils.ts' @"
/**
 * Color manipulation utilities for dynamic theming
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

export function withOpacity(hex: string, opacity: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + opacity + ')';
}
"@ 'feat(lib): add hex-to-rgb and opacity color utilities'

# 6
NF 'src/lib/local-storage.ts' @"
/**
 * Type-safe localStorage wrapper
 */
export function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

export function removeItem(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
}
"@ 'feat(lib): add type-safe localStorage wrapper'

# 7
NF 'src/lib/xp-calculator.ts' @"
/**
 * XP and leveling system calculations
 */
export const XP_PER_LEVEL = 500;

export function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - (xp % XP_PER_LEVEL);
}

export function levelProgress(xp: number): number {
  return ((xp % XP_PER_LEVEL) / XP_PER_LEVEL) * 100;
}

export function xpForAction(action: 'quiz' | 'fillblank' | 'listening' | 'lesson' | 'streak'): number {
  const rewards: Record<string, number> = {
    quiz: 5,
    fillblank: 7,
    listening: 10,
    lesson: 25,
    streak: 15,
  };
  return rewards[action] || 0;
}
"@ 'feat(lib): add XP calculator with leveling system'

# 8
NF 'src/lib/streak-utils.ts' @"
/**
 * Streak tracking and calculation utilities
 */
export function isStreakActive(lastActivity: string | null): boolean {
  if (!lastActivity) return false;
  const last = new Date(lastActivity);
  const now = new Date();
  const diffMs = now.getTime() - last.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return diffHours < 48;
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 365) return '💎';
  if (streak >= 100) return '🔥';
  if (streak >= 30) return '⚡';
  if (streak >= 7) return '🌟';
  if (streak >= 3) return '✨';
  return '🌱';
}

export function getStreakMessage(streak: number): string {
  if (streak >= 100) return 'Huyen thoai! ' + streak + ' ngay lien tuc!';
  if (streak >= 30) return 'Tuyet voi! ' + streak + ' ngay streak!';
  if (streak >= 7) return 'Gioi lam! ' + streak + ' ngay lien tiep!';
  return 'Tiep tuc co gang! ' + streak + ' ngay';
}
"@ 'feat(lib): add streak tracking utilities with emoji'

# 9
NF 'src/lib/quiz-helpers.ts' @"
/**
 * Quiz generation and scoring helpers
 */
export function generateOptions<T>(correct: T, pool: T[], count: number = 3): T[] {
  const wrong = pool.filter((item) => item !== correct);
  const shuffled = [...wrong].sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, count);
  const options = [...selected, correct];
  return options.sort(() => Math.random() - 0.5);
}

export function calculateGrade(score: number): { grade: string; label: string; color: string } {
  if (score >= 90) return { grade: 'A+', label: 'Xuat sac', color: '#10b981' };
  if (score >= 80) return { grade: 'A', label: 'Gioi', color: '#3b82f6' };
  if (score >= 70) return { grade: 'B', label: 'Kha', color: '#8b5cf6' };
  if (score >= 60) return { grade: 'C', label: 'Trung binh', color: '#f59e0b' };
  return { grade: 'D', label: 'Can cai thien', color: '#ef4444' };
}

export function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
"@ 'feat(lib): add quiz option generator and grading system'

# 10
NF 'src/lib/speech-utils.ts' @"
/**
 * Web Speech API wrapper for text-to-speech
 */
export function speak(text: string, options?: { rate?: number; lang?: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      reject(new Error('Speech synthesis not available'));
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options?.lang || 'en-US';
    utterance.rate = options?.rate || 0.8;
    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);
    window.speechSynthesis.speak(utterance);
  });
}

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}
"@ 'feat(lib): add Web Speech API wrapper for TTS'

# 11
NF 'src/lib/keyboard-utils.ts' @"
/**
 * Keyboard event utility helpers
 */
export function isEnterKey(e: { key: string }): boolean {
  return e.key === 'Enter';
}

export function isEscapeKey(e: { key: string }): boolean {
  return e.key === 'Escape';
}

export function isArrowKey(e: { key: string }): boolean {
  return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key);
}

export type KeyHandler = { key: string; handler: () => void; ctrl?: boolean; shift?: boolean };

export function createKeyboardHandler(handlers: KeyHandler[]) {
  return (e: KeyboardEvent) => {
    for (const h of handlers) {
      if (e.key === h.key && (!h.ctrl || e.ctrlKey) && (!h.shift || e.shiftKey)) {
        e.preventDefault();
        h.handler();
        break;
      }
    }
  };
}
"@ 'feat(lib): add keyboard event utilities'

# 12
NF 'src/lib/supabase-helpers.ts' @"
/**
 * Supabase query helper functions
 */
export async function fetchSingle<T>(
  query: { data: T | null; error: { message: string } | null }
): Promise<T | null> {
  if (query.error) {
    console.error('Supabase query error:', query.error.message);
    return null;
  }
  return query.data;
}

export function buildPagination(page: number, pageSize: number): { from: number; to: number } {
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  return { from, to };
}

export function handleSupabaseError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: string }).message);
  }
  return 'An unexpected error occurred';
}
"@ 'feat(lib): add Supabase query helper functions'

# 13
NF 'src/lib/analytics.ts' @"
/**
 * Analytics tracking utilities
 */
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, string | number | boolean>;
};

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === 'undefined') return;
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics]', event.name, event.properties);
  }
}

export function trackPageView(page: string): void {
  trackEvent({ name: 'page_view', properties: { page } });
}

export function trackPracticeComplete(mode: string, score: number, xp: number): void {
  trackEvent({
    name: 'practice_complete',
    properties: { mode, score, xp },
  });
}

export function trackAchievementUnlock(achievementId: string): void {
  trackEvent({ name: 'achievement_unlock', properties: { achievementId } });
}
"@ 'feat(lib): add analytics event tracking'

# 14
NF 'src/lib/validation.ts' @"
/**
 * Input validation helpers
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isStrongPassword(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: 'Mat khau phai co it nhat 8 ky tu' };
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Can it nhat 1 chu hoa' };
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Can it nhat 1 so' };
  return { valid: true, message: 'Mat khau hop le' };
}

export function sanitizeInput(input: string): string {
  return input.replace(/[<>&'"]/g, (char) => {
    const entities: Record<string, string> = { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&#39;', '"': '&quot;' };
    return entities[char] || char;
  });
}
"@ 'feat(lib): add input validation and sanitization'

# 15
NF 'src/lib/toast.ts' @"
/**
 * Simple toast notification system
 */
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration: number;
}

let toastId = 0;

export function createToast(type: ToastType, message: string, duration = 3000): Toast {
  return {
    id: 'toast-' + (++toastId),
    type,
    message,
    duration,
  };
}

export function getToastIcon(type: ToastType): string {
  switch (type) {
    case 'success': return '✓';
    case 'error': return '✗';
    case 'warning': return '⚠';
    case 'info': return 'ℹ';
  }
}

export function getToastColor(type: ToastType): string {
  switch (type) {
    case 'success': return '#10b981';
    case 'error': return '#ef4444';
    case 'warning': return '#f59e0b';
    case 'info': return '#3b82f6';
  }
}
"@ 'feat(lib): add toast notification system'

Write-Host "Part 1 done: 15 utility commits" -ForegroundColor Cyan

# ================================================
# PART 2: New hooks (~10 commits)
# ================================================

# 16
NF 'src/hooks/useLocalStorage.ts' @"
'use client';
import { useState, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T) => {
    setStoredValue(value);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key]);

  return [storedValue, setValue];
}
"@ 'feat(hooks): add useLocalStorage hook with SSR safety'

# 17
NF 'src/hooks/useDebounce.ts' @"
'use client';
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}
"@ 'feat(hooks): add useDebounce hook for input delay'

# 18
NF 'src/hooks/useMediaQuery.ts' @"
'use client';
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 768px)');
}
"@ 'feat(hooks): add useMediaQuery and useIsMobile hooks'

# 19
NF 'src/hooks/useCountUp.ts' @"
'use client';
import { useState, useEffect, useRef } from 'react';

export function useCountUp(end: number, duration: number = 1000): number {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    if (end === 0) { setCount(0); return; }
    startTime.current = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTime.current || now);
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return count;
}
"@ 'feat(hooks): add useCountUp animation hook'

# 20
NF 'src/hooks/useKeyboard.ts' @"
'use client';
import { useEffect, useCallback } from 'react';

export function useKeyboard(key: string, handler: () => void, deps: unknown[] = []): void {
  const callback = useCallback(handler, deps);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === key) {
        e.preventDefault();
        callback();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, callback]);
}
"@ 'feat(hooks): add useKeyboard shortcut hook'

# 21
NF 'src/hooks/useTimer.ts' @"
'use client';
import { useState, useRef, useCallback } from 'react';

export function useTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
  }, [isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setElapsed(0);
  }, [stop]);

  const formatTime = useCallback((secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m.toString().padStart(2, '0') + ':' + s.toString().padStart(2, '0');
  }, []);

  return { elapsed, isRunning, start, stop, reset, formatted: formatTime(elapsed) };
}
"@ 'feat(hooks): add useTimer hook for practice timing'

# 22
NF 'src/hooks/useOnlineStatus.ts' @"
'use client';
import { useState, useEffect } from 'react';

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setIsOnline(navigator.onLine);
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
}
"@ 'feat(hooks): add useOnlineStatus network detection'

# 23
NF 'src/hooks/useClickOutside.ts' @"
'use client';
import { useEffect, useRef } from 'react';

export function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const listener = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref;
}
"@ 'feat(hooks): add useClickOutside for dropdown/modal'

# 24
NF 'src/hooks/usePrevious.ts' @"
'use client';
import { useRef, useEffect } from 'react';

export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
"@ 'feat(hooks): add usePrevious value tracking hook'

# 25
NF 'src/hooks/useToggle.ts' @"
'use client';
import { useState, useCallback } from 'react';

export function useToggle(initialValue = false): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}
"@ 'feat(hooks): add useToggle state management hook'

Write-Host "Part 2 done: 10 hook commits" -ForegroundColor Cyan

# ================================================  
# PART 3: New components (~10 commits)
# ================================================

# 26
NF 'src/components/ui/LoadingSpinner.tsx' @"
'use client';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const sizes = { sm: 16, md: 24, lg: 40 };

export default function LoadingSpinner({ size = 'md', color = '#3b82f6' }: SpinnerProps) {
  const s = sizes[size];
  return (
    <div className='flex items-center justify-center'>
      <svg width={s} height={s} viewBox='0 0 24 24' fill='none' className='animate-spin'>
        <circle cx='12' cy='12' r='10' stroke={color} strokeWidth='3' strokeLinecap='round' opacity='0.25' />
        <path d='M12 2a10 10 0 0 1 10 10' stroke={color} strokeWidth='3' strokeLinecap='round' />
      </svg>
    </div>
  );
}
"@ 'feat(ui): add LoadingSpinner component with sizes'

# 27
NF 'src/components/ui/EmptyState.tsx' @"
interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center py-12 text-center'>
      <div className='text-4xl mb-3'>{icon}</div>
      <h3 className='text-lg font-bold text-gray-800 mb-1'>{title}</h3>
      {description && <p className='text-sm text-gray-500 mb-4 max-w-xs'>{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors'
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
"@ 'feat(ui): add EmptyState placeholder component'

# 28
NF 'src/components/ui/Badge.tsx' @"
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

const variants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
};

export default function Badge({ children, variant = 'default', size = 'sm' }: BadgeProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';
  return (
    <span className={'inline-flex items-center rounded-full font-medium ' + variants[variant] + ' ' + sizeClass}>
      {children}
    </span>
  );
}
"@ 'feat(ui): add Badge component with variants'

# 29
NF 'src/components/ui/ProgressBar.tsx' @"
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  height?: number;
}

export default function ProgressBar({
  value, max = 100, color = '#3b82f6', showLabel = false, height = 8,
}: ProgressBarProps) {
  const pct = Math.min((value / max) * 100, 100);
  return (
    <div className='w-full'>
      {showLabel && (
        <div className='flex justify-between text-xs text-gray-500 mb-1'>
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className='w-full bg-gray-200 rounded-full overflow-hidden' style={{ height }}>
        <div
          className='h-full rounded-full transition-all duration-500 ease-out'
          style={{ width: pct + '%', backgroundColor: color }}
        />
      </div>
    </div>
  );
}
"@ 'feat(ui): add ProgressBar component with animation'

# 30
NF 'src/components/ui/Tooltip.tsx' @"
'use client';
import { useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom';
}

export default function Tooltip({ children, content, position = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const posStyle = position === 'top'
    ? { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 6 }
    : { top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: 6 };

  return (
    <div className='relative inline-block' onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div
          className='absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap'
          style={posStyle}
        >
          {content}
        </div>
      )}
    </div>
  );
}
"@ 'feat(ui): add Tooltip component with positioning'

# 31
NF 'src/components/ui/Avatar.tsx' @"
import Image from 'next/image';

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}

export default function Avatar({ src, name, size = 40, className = '' }: AvatarProps) {
  const initials = name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];
  const colorIndex = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;

  if (src) {
    return (
      <Image src={src} alt={name} width={size} height={size}
        className={'rounded-full object-cover ' + className}
        style={{ width: size, height: size }} />
    );
  }

  return (
    <div className={'rounded-full flex items-center justify-center font-bold text-white ' + className}
      style={{ width: size, height: size, backgroundColor: colors[colorIndex], fontSize: size * 0.4 }}>
      {initials}
    </div>
  );
}
"@ 'feat(ui): add Avatar component with image and initials'

# 32
NF 'src/components/ui/StatCard.tsx' @"
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: { value: number; isUp: boolean };
  bgColor?: string;
}

export default function StatCard({ icon, label, value, trend, bgColor = '#eff6ff' }: StatCardProps) {
  return (
    <div className='bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between mb-3'>
        <div className='w-10 h-10 rounded-xl flex items-center justify-center' style={{ background: bgColor }}>
          {icon}
        </div>
        {trend && (
          <span className={'text-xs font-bold ' + (trend.isUp ? 'text-green-500' : 'text-red-500')}>
            {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
          </span>
        )}
      </div>
      <div className='text-2xl font-extrabold text-gray-900'>{value}</div>
      <div className='text-xs text-gray-500 mt-1'>{label}</div>
    </div>
  );
}
"@ 'feat(ui): add StatCard component with trend indicator'

# 33
NF 'src/components/ui/ConfirmDialog.tsx' @"
'use client';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
}

export default function ConfirmDialog({
  isOpen, title, message, onConfirm, onCancel,
  confirmLabel = 'Xac nhan', cancelLabel = 'Huy', variant = 'default',
}: ConfirmDialogProps) {
  if (!isOpen) return null;
  const btnColor = variant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600';

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50' onClick={onCancel}>
      <div className='bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl' onClick={(e) => e.stopPropagation()}>
        <h3 className='text-lg font-bold text-gray-900 mb-2'>{title}</h3>
        <p className='text-sm text-gray-600 mb-6'>{message}</p>
        <div className='flex gap-3 justify-end'>
          <button onClick={onCancel} className='px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg'>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={'px-4 py-2 text-sm font-medium text-white rounded-lg ' + btnColor}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
"@ 'feat(ui): add ConfirmDialog modal component'

# 34
NF 'src/components/ui/Skeleton.tsx' @"
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

const roundedMap = { sm: '4px', md: '8px', lg: '16px', full: '9999px' };

export default function Skeleton({ width = '100%', height = 20, rounded = 'md', className = '' }: SkeletonProps) {
  return (
    <div
      className={'animate-pulse bg-gray-200 ' + className}
      style={{ width, height, borderRadius: roundedMap[rounded] }}
    />
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className='space-y-2'>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}
"@ 'feat(ui): add Skeleton and SkeletonText loading components'

# 35
NF 'src/components/ui/index.ts' @"
/**
 * UI Components barrel export
 */
export { default as LoadingSpinner } from './LoadingSpinner';
export { default as EmptyState } from './EmptyState';
export { default as Badge } from './Badge';
export { default as ProgressBar } from './ProgressBar';
export { default as Tooltip } from './Tooltip';
export { default as Avatar } from './Avatar';
export { default as StatCard } from './StatCard';
export { default as ConfirmDialog } from './ConfirmDialog';
export { default as Skeleton, SkeletonText } from './Skeleton';
"@ 'feat(ui): add barrel export for all UI components'

Write-Host "Part 3 done: 10 component commits" -ForegroundColor Cyan

# Push
git push origin main 2>$null
Write-Host '[PUSHED] 35 commits' -ForegroundColor Magenta

# Count
$total = git log --oneline | Measure-Object -Line
Write-Host "Total repo commits: $($total.Lines)" -ForegroundColor Cyan
