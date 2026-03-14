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

$prcss = 'src/app/dashboard/profile/profile.css'
$prpg = 'src/app/dashboard/profile/page.tsx'
$prcl = 'src/app/dashboard/profile/ProfileClient.tsx'

Write-Host '=== PROFILE FEATURE ===' -ForegroundColor Cyan

# =============================================
# COMMIT 18: Profile CSS - base
# =============================================
WF $prcss @'
/* Profile Page Styles */
:root {
  --profile-primary: #3b82f6;
  --profile-accent: #8b5cf6;
  --profile-bg: #f8fafc;
  --profile-card: #ffffff;
  --profile-border: #e2e8f0;
  --profile-text: #1e293b;
  --profile-muted: #94a3b8;
}
'@ 'style(profile): add CSS variables'

# COMMIT 19: Profile CSS - header
AF $prcss @'

.profile-header {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 20px;
  padding: 32px;
  color: white;
  position: relative;
  overflow: hidden;
}
.profile-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255,255,255,0.08);
  border-radius: 50%;
}
.profile-header::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.05);
  border-radius: 50%;
}
.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid rgba(255,255,255,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  overflow: hidden;
}
.level-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  background: rgba(255,255,255,0.2);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
'@ 'style(profile): add header with gradient background'

# COMMIT 20: Profile CSS - stats grid
AF $prcss @'

.profile-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-top: 20px;
}
.profile-stat-card {
  background: var(--profile-card);
  border: 1px solid var(--profile-border);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.profile-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}
.profile-stat-card .icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
}
.profile-stat-value {
  font-size: 28px;
  font-weight: 800;
  color: var(--profile-text);
  line-height: 1;
}
.profile-stat-label {
  font-size: 12px;
  color: var(--profile-muted);
  margin-top: 6px;
  font-weight: 500;
}
'@ 'style(profile): add stats card grid styles'

# COMMIT 21: Profile CSS - chart
AF $prcss @'

.profile-chart-card {
  background: var(--profile-card);
  border: 1px solid var(--profile-border);
  border-radius: 16px;
  padding: 24px;
  margin-top: 20px;
}
.profile-chart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.profile-chart-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--profile-text);
  display: flex;
  align-items: center;
  gap: 8px;
}
.profile-chart-period {
  display: flex;
  gap: 4px;
  background: var(--profile-bg);
  padding: 3px;
  border-radius: 8px;
}
.period-btn {
  padding: 5px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--profile-muted);
  cursor: pointer;
  transition: all 0.2s;
}
.period-btn.active {
  background: white;
  color: var(--profile-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
'@ 'style(profile): add chart section styles'

# COMMIT 22: Profile CSS - activity list
AF $prcss @'

.profile-activity {
  background: var(--profile-card);
  border: 1px solid var(--profile-border);
  border-radius: 16px;
  padding: 24px;
  margin-top: 20px;
}
.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
}
.activity-item:last-child { border-bottom: none; }
.activity-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.activity-text {
  flex: 1;
}
.activity-title { font-size: 13px; font-weight: 600; color: var(--profile-text); }
.activity-time { font-size: 11px; color: var(--profile-muted); margin-top: 2px; }
.activity-badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 700;
}
'@ 'style(profile): add activity list styles'

# COMMIT 23: Profile CSS - badges
AF $prcss @'

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}
.badge-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: var(--profile-bg);
  border: 1px solid var(--profile-border);
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  color: var(--profile-text);
  transition: all 0.2s;
}
.badge-item:hover { background: #eff6ff; border-color: var(--profile-primary); }
.badge-item .badge-emoji { font-size: 16px; }
.badge-unlocked { background: #ecfdf5; border-color: #a7f3d0; }
.badge-locked { opacity: 0.5; filter: grayscale(1); }
'@ 'style(profile): add achievement badge styles'

# COMMIT 24: Profile CSS - animations
AF $prcss @'

@keyframes profileSlideUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes countUp {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
.profile-animate-in {
  animation: profileSlideUp 0.4s ease forwards;
}
.profile-animate-in:nth-child(1) { animation-delay: 0ms; }
.profile-animate-in:nth-child(2) { animation-delay: 100ms; }
.profile-animate-in:nth-child(3) { animation-delay: 200ms; }
.profile-animate-in:nth-child(4) { animation-delay: 300ms; }
.profile-animate-in:nth-child(5) { animation-delay: 400ms; }
.count-up { animation: countUp 0.5s ease forwards; }
'@ 'style(profile): add animations and staggered delays'

# COMMIT 25: Profile CSS - responsive
AF $prcss @'

@media (max-width: 768px) {
  .profile-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .profile-header { padding: 24px; border-radius: 16px; }
}
@media (max-width: 480px) {
  .profile-stats-grid { grid-template-columns: 1fr; }
  .profile-header { padding: 20px; }
  .profile-avatar { width: 64px; height: 64px; font-size: 22px; }
  .profile-stat-value { font-size: 22px; }
}
'@ 'style(profile): add responsive breakpoints'

Write-Host "Profile CSS done (8 commits)" -ForegroundColor Cyan

# =============================================
# COMMIT 26: Profile server page
# =============================================
WF $prpg @'
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'Hồ sơ của tôi | DHV-Lingoo',
  description: 'Xem thông tin cá nhân và tiến trình học tập',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Vui lòng đăng nhập để xem hồ sơ
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url, xp, streak, longest_streak, level, goals, interests, daily_time, created_at')
    .eq('id', user.id)
    .single();

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('id, score, xp_earned, completed_at, lesson_id')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title');

  const { count: wordCount } = await supabase
    .from('lesson_vocabularies')
    .select('id', { count: 'exact', head: true });

  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', user.id);

  return (
    <ProfileClient
      profile={{
        fullName: profile?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatarUrl: profile?.avatar_url || null,
        xp: profile?.xp || 0,
        streak: profile?.streak || 0,
        longestStreak: profile?.longest_streak || 0,
        level: profile?.level || 'A1',
        goals: profile?.goals || [],
        interests: profile?.interests || [],
        dailyTime: profile?.daily_time || 30,
        createdAt: profile?.created_at || user.created_at || new Date().toISOString(),
      }}
      progress={progress || []}
      courses={courses || []}
      wordCount={wordCount || 0}
      achievementCount={userAchievements?.length || 0}
    />
  );
}
'@ 'feat(profile): create server page with comprehensive data fetching'

Write-Host "Profile server page done (1 commit)" -ForegroundColor Cyan

# =============================================
# COMMIT 27: ProfileClient component
# =============================================
WF $prcl @'
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  User, Zap, Flame, Trophy, BookOpen, Star,
  Calendar, Target, BarChart3, Award,
  Clock, TrendingUp, Medal,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import "./profile.css";

interface ProfileData {
  fullName: string;
  email: string;
  avatarUrl: string | null;
  xp: number;
  streak: number;
  longestStreak: number;
  level: string;
  goals: string[];
  interests: string[];
  dailyTime: number;
  createdAt: string;
}

interface ProgressItem {
  id: string;
  score: number;
  xp_earned: number;
  completed_at: string;
  lesson_id: string;
}

interface ProfileClientProps {
  profile: ProfileData;
  progress: ProgressItem[];
  courses: { id: string; title: string }[];
  wordCount: number;
  achievementCount: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function daysAgo(iso: string) {
  const now = new Date();
  const then = new Date(iso);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

const LEVEL_COLORS: Record<string, string> = {
  A1: "#10b981", A2: "#3b82f6", B1: "#8b5cf6",
  B2: "#f59e0b", C1: "#ef4444", C2: "#ec4899",
};

export default function ProfileClient({
  profile, progress, courses, wordCount, achievementCount,
}: ProfileClientProps) {
  const [chartPeriod, setChartPeriod] = useState<7 | 14 | 30>(7);

  const lessonsCompleted = progress.length;
  const perfectScores = progress.filter((p) => p.score >= 100).length;
  const totalXpEarned = progress.reduce((s, p) => s + (p.xp_earned || 0), 0);
  const memberDays = daysAgo(profile.createdAt);

  // Chart data
  const chartData = useMemo(() => {
    const now = new Date();
    const days: { date: string; xp: number; lessons: number }[] = [];
    for (let i = chartPeriod - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayProgress = progress.filter(
        (p) => p.completed_at && p.completed_at.slice(0, 10) === key
      );
      days.push({
        date: d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }),
        xp: dayProgress.reduce((s, p) => s + (p.xp_earned || 0), 0),
        lessons: dayProgress.length,
      });
    }
    return days;
  }, [progress, chartPeriod]);

  const levelColor = LEVEL_COLORS[profile.level] || "#3b82f6";

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="profile-header profile-animate-in">
        <div className="flex items-center gap-5 relative z-10">
          <div className="profile-avatar">
            {profile.avatarUrl ? (
              <Image src={profile.avatarUrl} alt="Avatar" width={80} height={80} className="w-full h-full object-cover rounded-full" />
            ) : (
              profile.fullName.charAt(0).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{profile.fullName}</h1>
            <p className="text-sm opacity-80">{profile.email}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="level-badge" style={{ background: `${levelColor}33` }}>
                <Star className="w-3 h-3" /> Level {profile.level}
              </span>
              <span className="text-xs opacity-70">
                <Calendar className="w-3 h-3 inline mr-1" />
                Tham gia {formatDate(profile.createdAt)} · {memberDays} ngày
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="profile-stats-grid profile-animate-in">
        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#eff6ff" }}>
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <div className="profile-stat-value count-up">{profile.xp.toLocaleString()}</div>
          <div className="profile-stat-label">Tổng XP</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#fef3c7" }}>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="profile-stat-value count-up">{profile.streak}</div>
          <div className="profile-stat-label">Streak hiện tại</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#fce7f3" }}>
            <TrendingUp className="w-5 h-5 text-pink-500" />
          </div>
          <div className="profile-stat-value count-up">{profile.longestStreak}</div>
          <div className="profile-stat-label">Streak dài nhất</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#ecfdf5" }}>
            <BookOpen className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="profile-stat-value count-up">{lessonsCompleted}</div>
          <div className="profile-stat-label">Bài học hoàn thành</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#f3e8ff" }}>
            <Medal className="w-5 h-5 text-purple-500" />
          </div>
          <div className="profile-stat-value count-up">{perfectScores}</div>
          <div className="profile-stat-label">Điểm tuyệt đối</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#fff7ed" }}>
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          <div className="profile-stat-value count-up">{achievementCount}</div>
          <div className="profile-stat-label">Thành tựu</div>
        </div>
      </div>

      {/* XP Chart */}
      <div className="profile-chart-card profile-animate-in">
        <div className="profile-chart-header">
          <span className="profile-chart-title">
            <BarChart3 className="w-5 h-5 text-blue-500" /> Biểu đồ XP
          </span>
          <div className="profile-chart-period">
            {([7, 14, 30] as const).map((p) => (
              <button
                key={p}
                className={`period-btn ${chartPeriod === p ? "active" : ""}`}
                onClick={() => setChartPeriod(p)}
              >
                {p} ngày
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
              formatter={(value: number, name: string) => [
                name === "xp" ? `${value} XP` : `${value} bài`,
                name === "xp" ? "XP" : "Bài học",
              ]}
            />
            <Area type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={2} fill="url(#xpGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="profile-activity profile-animate-in">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" /> Hoạt động gần đây
        </h3>
        {progress.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            Chưa có hoạt động nào. Hãy bắt đầu học nhé! 🚀
          </p>
        ) : (
          <div>
            {progress.slice(0, 8).map((p, i) => (
              <div key={p.id} className="activity-item">
                <div
                  className="activity-icon"
                  style={{ background: p.score >= 100 ? "#ecfdf5" : "#eff6ff" }}
                >
                  {p.score >= 100 ? (
                    <Star className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <BookOpen className="w-5 h-5 text-blue-500" />
                  )}
                </div>
                <div className="activity-text">
                  <div className="activity-title">
                    Hoàn thành bài học · {p.score} điểm
                  </div>
                  <div className="activity-time">{formatDate(p.completed_at)}</div>
                </div>
                <span
                  className="activity-badge"
                  style={{
                    background: p.score >= 100 ? "#ecfdf5" : p.score >= 70 ? "#eff6ff" : "#fef2f2",
                    color: p.score >= 100 ? "#065f46" : p.score >= 70 ? "#1e40af" : "#991b1b",
                  }}
                >
                  +{p.xp_earned} XP
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Learning Info */}
      <div className="profile-activity profile-animate-in">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-500" /> Thông tin học tập
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Từ vựng đã học:</span>
            <span className="font-bold text-gray-900 ml-2">{wordCount}</span>
          </div>
          <div>
            <span className="text-gray-400">Khóa học có sẵn:</span>
            <span className="font-bold text-gray-900 ml-2">{courses.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Thời gian/ngày:</span>
            <span className="font-bold text-gray-900 ml-2">{profile.dailyTime} phút</span>
          </div>
          <div>
            <span className="text-gray-400">Tổng XP từ bài học:</span>
            <span className="font-bold text-gray-900 ml-2">{totalXpEarned}</span>
          </div>
        </div>
        {profile.goals.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-400">Mục tiêu:</span>
            <div className="profile-badges">
              {profile.goals.map((g) => (
                <span key={g} className="badge-item badge-unlocked">
                  <span className="badge-emoji">🎯</span> {g}
                </span>
              ))}
            </div>
          </div>
        )}
        {profile.interests.length > 0 && (
          <div className="mt-3">
            <span className="text-sm text-gray-400">Kỹ năng quan tâm:</span>
            <div className="profile-badges">
              {profile.interests.map((i) => (
                <span key={i} className="badge-item">
                  <span className="badge-emoji">💡</span> {i}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'@ 'feat(profile): create ProfileClient with header, stats, chart, activity'

Write-Host "=== PROFILE FEATURE COMPLETE ===" -ForegroundColor Green

# Push profile commits
git push origin main 2>$null
Write-Host '[PUSHED] Profile feature commits' -ForegroundColor Magenta
