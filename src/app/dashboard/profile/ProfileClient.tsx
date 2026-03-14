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
                Tham gia {formatDate(profile.createdAt)} Â· {memberDays} ngÃ y
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
          <div className="profile-stat-label">Tá»•ng XP</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#fef3c7" }}>
            <Flame className="w-5 h-5 text-amber-500" />
          </div>
          <div className="profile-stat-value count-up">{profile.streak}</div>
          <div className="profile-stat-label">Streak hiá»‡n táº¡i</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#fce7f3" }}>
            <TrendingUp className="w-5 h-5 text-pink-500" />
          </div>
          <div className="profile-stat-value count-up">{profile.longestStreak}</div>
          <div className="profile-stat-label">Streak dÃ i nháº¥t</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#ecfdf5" }}>
            <BookOpen className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="profile-stat-value count-up">{lessonsCompleted}</div>
          <div className="profile-stat-label">BÃ i há»c hoÃ n thÃ nh</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#f3e8ff" }}>
            <Medal className="w-5 h-5 text-purple-500" />
          </div>
          <div className="profile-stat-value count-up">{perfectScores}</div>
          <div className="profile-stat-label">Äiá»ƒm tuyá»‡t Ä‘á»‘i</div>
        </div>

        <div className="profile-stat-card">
          <div className="icon-circle" style={{ background: "#fff7ed" }}>
            <Trophy className="w-5 h-5 text-orange-500" />
          </div>
          <div className="profile-stat-value count-up">{achievementCount}</div>
          <div className="profile-stat-label">ThÃ nh tá»±u</div>
        </div>
      </div>

      {/* XP Chart */}
      <div className="profile-chart-card profile-animate-in">
        <div className="profile-chart-header">
          <span className="profile-chart-title">
            <BarChart3 className="w-5 h-5 text-blue-500" /> Biá»ƒu Ä‘á»“ XP
          </span>
          <div className="profile-chart-period">
            {([7, 14, 30] as const).map((p) => (
              <button
                key={p}
                className={`period-btn ${chartPeriod === p ? "active" : ""}`}
                onClick={() => setChartPeriod(p)}
              >
                {p} ngÃ y
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
                name === "xp" ? `${value} XP` : `${value} bÃ i`,
                name === "xp" ? "XP" : "BÃ i há»c",
              ]}
            />
            <Area type="monotone" dataKey="xp" stroke="#3b82f6" strokeWidth={2} fill="url(#xpGradient)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Activity */}
      <div className="profile-activity profile-animate-in">
        <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-500" /> Hoáº¡t Ä‘á»™ng gáº§n Ä‘Ã¢y
        </h3>
        {progress.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            ChÆ°a cÃ³ hoáº¡t Ä‘á»™ng nÃ o. HÃ£y báº¯t Ä‘áº§u há»c nhÃ©! ðŸš€
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
                    HoÃ n thÃ nh bÃ i há»c Â· {p.score} Ä‘iá»ƒm
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
          <Target className="w-5 h-5 text-purple-500" /> ThÃ´ng tin há»c táº­p
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Tá»« vá»±ng Ä‘Ã£ há»c:</span>
            <span className="font-bold text-gray-900 ml-2">{wordCount}</span>
          </div>
          <div>
            <span className="text-gray-400">KhÃ³a há»c cÃ³ sáºµn:</span>
            <span className="font-bold text-gray-900 ml-2">{courses.length}</span>
          </div>
          <div>
            <span className="text-gray-400">Thá»i gian/ngÃ y:</span>
            <span className="font-bold text-gray-900 ml-2">{profile.dailyTime} phÃºt</span>
          </div>
          <div>
            <span className="text-gray-400">Tá»•ng XP tá»« bÃ i há»c:</span>
            <span className="font-bold text-gray-900 ml-2">{totalXpEarned}</span>
          </div>
        </div>
        {profile.goals.length > 0 && (
          <div className="mt-4">
            <span className="text-sm text-gray-400">Má»¥c tiÃªu:</span>
            <div className="profile-badges">
              {profile.goals.map((g) => (
                <span key={g} className="badge-item badge-unlocked">
                  <span className="badge-emoji">ðŸŽ¯</span> {g}
                </span>
              ))}
            </div>
          </div>
        )}
        {profile.interests.length > 0 && (
          <div className="mt-3">
            <span className="text-sm text-gray-400">Ká»¹ nÄƒng quan tÃ¢m:</span>
            <div className="profile-badges">
              {profile.interests.map((i) => (
                <span key={i} className="badge-item">
                  <span className="badge-emoji">ðŸ’¡</span> {i}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// Header gradient uses blue-to-purple color scheme
// Avatar fallback shows first letter of full name
// Level badge color maps to CEFR level (A1 green to C2 pink)
// Stats grid uses 6 cards: XP, streak, longest, lessons, perfect, achievements
// XP chart uses Recharts AreaChart with blue gradient fill
// Chart supports 7/14/30 day period toggle
// Activity list shows 8 most recent completed lessons
// Activity items color-coded by score performance
// Goals rendered as badge chips with target emoji
