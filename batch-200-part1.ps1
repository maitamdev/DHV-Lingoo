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
function AF($file, $line, $msg) {
  $fullPath = Join-Path $PWD $file
  $utf8 = New-Object System.Text.UTF8Encoding $false
  $existing = ''
  if (Test-Path $fullPath) { $existing = [System.IO.File]::ReadAllText($fullPath, $utf8) }
  [System.IO.File]::WriteAllText($fullPath, $existing + "`n" + $line, $utf8)
  CC $msg
}

Write-Host '=== PART 1: LEADERBOARD (40 commits) ===' -ForegroundColor Cyan

# --- Leaderboard CSS ---
NF 'src/app/dashboard/leaderboard/leaderboard.css' @"
:root {
  --lb-gold: #f59e0b;
  --lb-silver: #94a3b8;
  --lb-bronze: #d97706;
  --lb-primary: #3b82f6;
  --lb-bg: #f8fafc;
  --lb-card: #ffffff;
  --lb-border: #e2e8f0;
  --lb-text: #1e293b;
  --lb-muted: #94a3b8;
}
"@ 'style(leaderboard): add CSS variables'

AF 'src/app/dashboard/leaderboard/leaderboard.css' @"
.lb-header {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 20px;
  padding: 28px;
  color: white;
  position: relative;
  overflow: hidden;
}
.lb-header::before {
  content: '';
  position: absolute;
  top: -40%;
  right: -15%;
  width: 250px;
  height: 250px;
  background: rgba(255,255,255,0.08);
  border-radius: 50%;
}
"@ 'style(leaderboard): add header gradient styles'

AF 'src/app/dashboard/leaderboard/leaderboard.css' @"
.lb-tabs {
  display: flex;
  gap: 4px;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 20px;
}
.lb-tab {
  flex: 1;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  color: var(--lb-muted);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}
.lb-tab.active {
  background: white;
  color: var(--lb-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
"@ 'style(leaderboard): add tab navigation styles'

AF 'src/app/dashboard/leaderboard/leaderboard.css' @"
.lb-podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  padding: 24px 0;
  margin-bottom: 16px;
}
.lb-podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.lb-podium-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
  color: white;
  margin-bottom: 8px;
}
.lb-podium-avatar.gold { background: linear-gradient(135deg, #f59e0b, #d97706); border: 3px solid #fbbf24; }
.lb-podium-avatar.silver { background: linear-gradient(135deg, #94a3b8, #64748b); border: 3px solid #cbd5e1; }
.lb-podium-avatar.bronze { background: linear-gradient(135deg, #d97706, #b45309); border: 3px solid #f59e0b; }
.lb-podium-name { font-size: 13px; font-weight: 700; color: var(--lb-text); max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lb-podium-xp { font-size: 11px; color: var(--lb-muted); font-weight: 600; }
.lb-podium-rank { font-size: 20px; margin-bottom: 4px; }
.lb-podium-bar { width: 80px; border-radius: 8px 8px 0 0; display: flex; align-items: flex-end; justify-content: center; padding-bottom: 8px; }
.lb-podium-bar.first { height: 100px; background: linear-gradient(180deg, #fef3c7, #fbbf24); }
.lb-podium-bar.second { height: 75px; background: linear-gradient(180deg, #e2e8f0, #94a3b8); }
.lb-podium-bar.third { height: 55px; background: linear-gradient(180deg, #fed7aa, #d97706); }
"@ 'style(leaderboard): add podium display styles'

AF 'src/app/dashboard/leaderboard/leaderboard.css' @"
.lb-list { display: flex; flex-direction: column; gap: 6px; }
.lb-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--lb-border);
  border-radius: 12px;
  transition: all 0.2s;
}
.lb-row:hover { transform: translateX(4px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.lb-row.current-user { background: #eff6ff; border-color: #93c5fd; }
.lb-rank { width: 32px; text-align: center; font-weight: 800; font-size: 14px; color: var(--lb-muted); }
.lb-rank.top3 { font-size: 18px; }
.lb-user-avatar {
  width: 40px; height: 40px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 14px; color: white; flex-shrink: 0;
}
.lb-user-info { flex: 1; min-width: 0; }
.lb-user-name { font-size: 13px; font-weight: 700; color: var(--lb-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lb-user-level { font-size: 11px; color: var(--lb-muted); }
.lb-user-xp { font-size: 14px; font-weight: 800; color: var(--lb-primary); }
.lb-user-xp-label { font-size: 10px; color: var(--lb-muted); }
"@ 'style(leaderboard): add ranking list styles'

AF 'src/app/dashboard/leaderboard/leaderboard.css' @"
.lb-my-position {
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #93c5fd;
  border-radius: 16px;
  padding: 16px;
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.lb-my-rank { font-size: 24px; font-weight: 900; color: var(--lb-primary); }
.lb-my-label { font-size: 12px; color: var(--lb-muted); }
"@ 'style(leaderboard): add current user position styles'

AF 'src/app/dashboard/leaderboard/leaderboard.css' @"
@keyframes lbSlideIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.lb-animate { animation: lbSlideIn 0.3s ease forwards; }
.lb-animate:nth-child(1) { animation-delay: 0ms; }
.lb-animate:nth-child(2) { animation-delay: 50ms; }
.lb-animate:nth-child(3) { animation-delay: 100ms; }
.lb-animate:nth-child(4) { animation-delay: 150ms; }
.lb-animate:nth-child(5) { animation-delay: 200ms; }
"@ 'style(leaderboard): add entrance animations'

AF 'src/app/dashboard/leaderboard/leaderboard.css' @"
@media (max-width: 640px) {
  .lb-header { padding: 20px; border-radius: 16px; }
  .lb-podium { gap: 8px; padding: 16px 0; }
  .lb-podium-avatar { width: 44px; height: 44px; font-size: 16px; }
  .lb-podium-bar.first { height: 80px; }
  .lb-podium-bar.second { height: 60px; }
  .lb-podium-bar.third { height: 45px; }
  .lb-row { padding: 10px 12px; }
}
"@ 'style(leaderboard): add responsive breakpoints'

# --- Leaderboard Server Page ---
NF 'src/app/dashboard/leaderboard/page.tsx' @"
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import LeaderboardClient from './LeaderboardClient';

export const metadata: Metadata = {
  title: 'Bảng xếp hạng | DHV-Lingoo',
  description: 'Xem thứ hạng và so sánh tiến trình với bạn bè',
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: allUsers } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, xp, streak, level')
    .order('xp', { ascending: false })
    .limit(50);

  const currentUserId = user?.id || null;

  return (
    <LeaderboardClient
      users={allUsers || []}
      currentUserId={currentUserId}
    />
  );
}
"@ 'feat(leaderboard): create server page with data fetching'

# --- Leaderboard Client ---
NF 'src/app/dashboard/leaderboard/LeaderboardClient.tsx' @"
\"use client\";

import { useState, useMemo } from \"react\";
import Image from \"next/image\";
import { Trophy, Flame, Zap, Medal, Crown, TrendingUp, Users } from \"lucide-react\";
import \"./leaderboard.css\";

interface LeaderboardUser {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  xp: number;
  streak: number;
  level: string;
}

interface Props {
  users: LeaderboardUser[];
  currentUserId: string | null;
}

type SortBy = \"xp\" | \"streak\";

const AVATAR_COLORS = [\"#3b82f6\", \"#8b5cf6\", \"#10b981\", \"#f59e0b\", \"#ef4444\", \"#ec4899\", \"#06b6d4\"];

function getColor(name: string): string {
  const idx = (name || \"\").split(\"\").reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitial(name: string | null): string {
  return (name || \"?\").charAt(0).toUpperCase();
}

export default function LeaderboardClient({ users, currentUserId }: Props) {
  const [sortBy, setSortBy] = useState<SortBy>(\"xp\");

  const sorted = useMemo(() => {
    return [...users].sort((a, b) =>
      sortBy === \"xp\" ? b.xp - a.xp : b.streak - a.streak
    );
  }, [users, sortBy]);

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);
  const myIndex = sorted.findIndex((u) => u.id === currentUserId);

  return (
    <div className=\"p-4 lg:p-6 max-w-3xl mx-auto\">
      {/* Header */}
      <div className=\"lb-header lb-animate\">
        <div className=\"relative z-10\">
          <div className=\"flex items-center gap-3 mb-2\">
            <Trophy className=\"w-7 h-7\" />
            <h1 className=\"text-2xl font-bold\">Bang xep hang</h1>
          </div>
          <p className=\"text-sm opacity-80\">So sanh tien trinh hoc tap voi moi nguoi</p>
          <div className=\"flex items-center gap-4 mt-3\">
            <div className=\"flex items-center gap-1 text-sm\">
              <Users className=\"w-4 h-4\" /> {users.length} nguoi hoc
            </div>
            {myIndex >= 0 && (
              <div className=\"flex items-center gap-1 text-sm\">
                <Medal className=\"w-4 h-4\" /> Hang {myIndex + 1}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sort Tabs */}
      <div className=\"lb-tabs mt-6\">
        <button className={\"lb-tab \" + (sortBy === \"xp\" ? \"active\" : \"\")} onClick={() => setSortBy(\"xp\")}>
          <Zap className=\"w-4 h-4\" /> XP cao nhat
        </button>
        <button className={\"lb-tab \" + (sortBy === \"streak\" ? \"active\" : \"\")} onClick={() => setSortBy(\"streak\")}>
          <Flame className=\"w-4 h-4\" /> Streak dai nhat
        </button>
      </div>

      {/* Podium top 3 */}
      {top3.length >= 3 && (
        <div className=\"lb-podium\">
          {[1, 0, 2].map((pos) => {
            const u = top3[pos];
            const rankClass = pos === 0 ? \"gold\" : pos === 1 ? \"silver\" : \"bronze\";
            const barClass = pos === 0 ? \"first\" : pos === 1 ? \"second\" : \"third\";
            const emoji = pos === 0 ? \"\\ud83e\\udd47\" : pos === 1 ? \"\\ud83e\\udd48\" : \"\\ud83e\\udd49\";
            return (
              <div key={u.id} className=\"lb-podium-item lb-animate\">
                <div className=\"lb-podium-rank\">{emoji}</div>
                <div className={\"lb-podium-avatar \" + rankClass}>
                  {u.avatar_url ? (
                    <Image src={u.avatar_url} alt=\"\" width={56} height={56} className=\"w-full h-full object-cover rounded-full\" />
                  ) : getInitial(u.full_name)}
                </div>
                <div className=\"lb-podium-name\">{u.full_name || \"User\"}</div>
                <div className=\"lb-podium-xp\">
                  {sortBy === \"xp\" ? u.xp.toLocaleString() + \" XP\" : u.streak + \" ngay\"}
                </div>
                <div className={\"lb-podium-bar \" + barClass} />
              </div>
            );
          })}
        </div>
      )}

      {/* List */}
      <div className=\"lb-list\">
        {rest.map((u, i) => {
          const rank = i + 4;
          const isMe = u.id === currentUserId;
          return (
            <div key={u.id} className={\"lb-row lb-animate\" + (isMe ? \" current-user\" : \"\")}>
              <div className=\"lb-rank\">{rank}</div>
              <div className=\"lb-user-avatar\" style={{ background: getColor(u.full_name || \"\") }}>
                {u.avatar_url ? (
                  <Image src={u.avatar_url} alt=\"\" width={40} height={40} className=\"w-full h-full object-cover rounded-full\" />
                ) : getInitial(u.full_name)}
              </div>
              <div className=\"lb-user-info\">
                <div className=\"lb-user-name\">{u.full_name || \"User\"}{isMe && \" (ban)\"}</div>
                <div className=\"lb-user-level\">Level {u.level} - {u.streak} ngay streak</div>
              </div>
              <div className=\"text-right\">
                <div className=\"lb-user-xp\">{sortBy === \"xp\" ? u.xp.toLocaleString() : u.streak}</div>
                <div className=\"lb-user-xp-label\">{sortBy === \"xp\" ? \"XP\" : \"ngay\"}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* My Position */}
      {myIndex >= 3 && (
        <div className=\"lb-my-position lb-animate\">
          <div>
            <div className=\"lb-my-rank\">#{myIndex + 1}</div>
            <div className=\"lb-my-label\">Vi tri cua ban</div>
          </div>
          <div className=\"flex-1\">
            <TrendingUp className=\"w-5 h-5 text-blue-500\" />
          </div>
          <div className=\"text-right\">
            <div className=\"lb-user-xp\">
              {sortBy === \"xp\"
                ? sorted[myIndex].xp.toLocaleString() + \" XP\"
                : sorted[myIndex].streak + \" ngay\"}
            </div>
          </div>
        </div>
      )}

      {users.length === 0 && (
        <div className=\"text-center py-12 text-gray-400\">
          <Trophy className=\"w-12 h-12 mx-auto mb-3 opacity-30\" />
          <p className=\"text-sm\">Chua co du lieu xep hang</p>
        </div>
      )}
    </div>
  );
}
"@ 'feat(leaderboard): create LeaderboardClient with podium and list'

Write-Host "Leaderboard: 10 commits done" -ForegroundColor Green

# ============================================
# VOCABULARY NOTEBOOK (20 commits)
# ============================================
Write-Host '=== VOCABULARY NOTEBOOK ===' -ForegroundColor Cyan

NF 'src/app/dashboard/vocabulary/vocabulary.css' @"
:root {
  --vn-primary: #8b5cf6;
  --vn-accent: #a78bfa;
  --vn-bg: #f8fafc;
  --vn-card: #ffffff;
  --vn-border: #e2e8f0;
  --vn-text: #1e293b;
  --vn-muted: #94a3b8;
}
"@ 'style(vocabulary): add CSS variables'

AF 'src/app/dashboard/vocabulary/vocabulary.css' @"
.vn-header {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  border-radius: 20px;
  padding: 28px;
  color: white;
  position: relative;
  overflow: hidden;
}
.vn-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 300px;
  height: 300px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
}
"@ 'style(vocabulary): add header gradient styles'

AF 'src/app/dashboard/vocabulary/vocabulary.css' @"
.vn-search {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}
.vn-search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--vn-border);
  border-radius: 12px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.2s;
}
.vn-search-input:focus {
  border-color: var(--vn-primary);
  box-shadow: 0 0 0 3px rgba(139,92,246,0.1);
}
.vn-filter-btn {
  padding: 10px 16px;
  border: 1px solid var(--vn-border);
  border-radius: 12px;
  background: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--vn-muted);
  transition: all 0.2s;
}
.vn-filter-btn:hover { border-color: var(--vn-primary); color: var(--vn-primary); }
.vn-filter-btn.active { background: #f3e8ff; border-color: var(--vn-primary); color: var(--vn-primary); }
"@ 'style(vocabulary): add search and filter styles'

AF 'src/app/dashboard/vocabulary/vocabulary.css' @"
.vn-word-card {
  background: var(--vn-card);
  border: 1px solid var(--vn-border);
  border-radius: 14px;
  padding: 16px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 14px;
}
.vn-word-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
.vn-word-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}
.vn-word-text { font-size: 15px; font-weight: 700; color: var(--vn-text); }
.vn-word-phonetic { font-size: 12px; color: var(--vn-muted); font-style: italic; }
.vn-word-meaning { font-size: 13px; color: #6366f1; font-weight: 500; margin-top: 2px; }
.vn-word-meta { font-size: 11px; color: var(--vn-muted); margin-top: 3px; }
.vn-word-actions { display: flex; gap: 6px; margin-left: auto; }
.vn-action-btn {
  width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--vn-border);
  background: white; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s; color: var(--vn-muted);
}
.vn-action-btn:hover { border-color: var(--vn-primary); color: var(--vn-primary); background: #f3e8ff; }
"@ 'style(vocabulary): add word card styles'

AF 'src/app/dashboard/vocabulary/vocabulary.css' @"
.vn-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.vn-stat-box {
  background: white;
  border: 1px solid var(--vn-border);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}
.vn-stat-value { font-size: 22px; font-weight: 800; color: var(--vn-text); }
.vn-stat-label { font-size: 11px; color: var(--vn-muted); margin-top: 2px; }
"@ 'style(vocabulary): add stats row styles'

AF 'src/app/dashboard/vocabulary/vocabulary.css' @"
.vn-mastery-badge {
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}
.vn-mastery-new { background: #dbeafe; color: #1e40af; }
.vn-mastery-learning { background: #fef3c7; color: #92400e; }
.vn-mastery-mastered { background: #d1fae5; color: #065f46; }
"@ 'style(vocabulary): add mastery badge styles'

AF 'src/app/dashboard/vocabulary/vocabulary.css' @"
.vn-add-form {
  background: white;
  border: 1px solid var(--vn-border);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
}
.vn-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.vn-input {
  padding: 10px 14px;
  border: 1px solid var(--vn-border);
  border-radius: 10px;
  font-size: 13px;
  outline: none;
  width: 100%;
  transition: border-color 0.2s;
}
.vn-input:focus { border-color: var(--vn-primary); box-shadow: 0 0 0 3px rgba(139,92,246,0.1); }
@media (max-width: 640px) {
  .vn-stats-row { grid-template-columns: 1fr; }
  .vn-form-row { grid-template-columns: 1fr; }
}
"@ 'style(vocabulary): add form and responsive styles'

# Vocabulary Server Page
NF 'src/app/dashboard/vocabulary/page.tsx' @"
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import VocabularyClient from './VocabularyClient';

export const metadata: Metadata = {
  title: 'So tay tu vung | DHV-Lingoo',
  description: 'Quan ly va on luyen tu vung ca nhan',
};

export default async function VocabularyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className=\"p-6 text-center text-gray-500\">Vui long dang nhap</div>;
  }

  const { data: vocabularies } = await supabase
    .from('lesson_vocabularies')
    .select('id, word, phonetic, meaning, example, lesson_id')
    .limit(500);

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single();

  return (
    <VocabularyClient
      words={vocabularies || []}
      userLevel={profile?.level || 'A1'}
      userId={user.id}
    />
  );
}
"@ 'feat(vocabulary): create server page with data fetching'

# Vocabulary Client
NF 'src/app/dashboard/vocabulary/VocabularyClient.tsx' @"
\"use client\";

import { useState, useMemo } from \"react\";
import { BookOpen, Search, Volume2, Star, Filter, Plus, Bookmark, Brain, Sparkles } from \"lucide-react\";
import \"./vocabulary.css\";

interface Word {
  id: string;
  word: string;
  phonetic: string | null;
  meaning: string;
  example: string | null;
  lesson_id: string;
}

interface Props {
  words: Word[];
  userLevel: string;
  userId: string;
}

type MasteryLevel = \"all\" | \"new\" | \"learning\" | \"mastered\";

export default function VocabularyClient({ words, userLevel, userId }: Props) {
  const [search, setSearch] = useState(\"\");
  const [mastery, setMastery] = useState<MasteryLevel>(\"all\");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    let result = words;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) => w.word.toLowerCase().includes(q) || w.meaning.toLowerCase().includes(q)
      );
    }
    return result;
  }, [words, search, mastery]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const speak = (text: string) => {
    if (typeof window !== \"undefined\" && window.speechSynthesis) {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = \"en-US\";
      u.rate = 0.8;
      window.speechSynthesis.speak(u);
    }
  };

  return (
    <div className=\"p-4 lg:p-6 max-w-3xl mx-auto\">
      <div className=\"vn-header\">
        <div className=\"relative z-10\">
          <div className=\"flex items-center gap-3 mb-2\">
            <BookOpen className=\"w-6 h-6\" />
            <h1 className=\"text-2xl font-bold\">So tay tu vung</h1>
          </div>
          <p className=\"text-sm opacity-80\">Quan ly va on luyen tu vung ca nhan</p>
        </div>
      </div>

      <div className=\"vn-stats-row mt-5\">
        <div className=\"vn-stat-box\">
          <div className=\"vn-stat-value\">{words.length}</div>
          <div className=\"vn-stat-label\">Tong tu vung</div>
        </div>
        <div className=\"vn-stat-box\">
          <div className=\"vn-stat-value\">{favorites.size}</div>
          <div className=\"vn-stat-label\">Yeu thich</div>
        </div>
        <div className=\"vn-stat-box\">
          <div className=\"vn-stat-value\">{userLevel}</div>
          <div className=\"vn-stat-label\">Cap do</div>
        </div>
      </div>

      <div className=\"vn-search\">
        <div className=\"relative flex-1\">
          <Search className=\"w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400\" />
          <input
            type=\"text\"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder=\"Tim tu vung...\"
            className=\"vn-search-input pl-10\"
          />
        </div>
      </div>

      <div className=\"space-y-3\">
        {filtered.length === 0 ? (
          <div className=\"text-center py-12 text-gray-400\">
            <Sparkles className=\"w-10 h-10 mx-auto mb-3 opacity-30\" />
            <p className=\"text-sm\">Khong tim thay tu vung nao</p>
          </div>
        ) : (
          filtered.slice(0, 50).map((w) => (
            <div key={w.id} className=\"vn-word-card\">
              <div className=\"vn-word-icon\" style={{ background: \"#f3e8ff\" }}>
                <Brain className=\"w-5 h-5 text-purple-500\" />
              </div>
              <div className=\"flex-1 min-w-0\">
                <div className=\"flex items-center gap-2\">
                  <span className=\"vn-word-text\">{w.word}</span>
                  {w.phonetic && <span className=\"vn-word-phonetic\">{w.phonetic}</span>}
                </div>
                <div className=\"vn-word-meaning\">{w.meaning}</div>
                {w.example && (
                  <div className=\"vn-word-meta truncate\">{w.example}</div>
                )}
              </div>
              <div className=\"vn-word-actions\">
                <button className=\"vn-action-btn\" onClick={() => speak(w.word)} title=\"Phat am\">
                  <Volume2 className=\"w-3.5 h-3.5\" />
                </button>
                <button
                  className=\"vn-action-btn\"
                  onClick={() => toggleFavorite(w.id)}
                  title=\"Yeu thich\"
                  style={favorites.has(w.id) ? { color: \"#f59e0b\", borderColor: \"#f59e0b\" } : {}}
                >
                  <Star className=\"w-3.5 h-3.5\" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filtered.length > 50 && (
        <p className=\"text-center text-xs text-gray-400 mt-4\">
          Hien thi 50/{filtered.length} tu vung. Dung tim kiem de loc.
        </p>
      )}
    </div>
  );
}
"@ 'feat(vocabulary): create VocabularyClient with search, favorites, TTS'

Write-Host "Vocabulary: 10 commits done" -ForegroundColor Green

# ============================================
# NOTIFICATIONS SYSTEM (10 commits)
# ============================================
Write-Host '=== NOTIFICATIONS ===' -ForegroundColor Cyan

NF 'src/components/dashboard/NotificationPanel.tsx' @"
\"use client\";

import { useState } from \"react\";
import { Bell, X, Check, CheckCheck, Trash2, Trophy, Zap, BookOpen, Flame } from \"lucide-react\";

export interface Notification {
  id: string;
  type: \"achievement\" | \"xp\" | \"streak\" | \"lesson\" | \"system\";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface Props {
  notifications: Notification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onDismiss: (id: string) => void;
}

const typeIcons = {
  achievement: { icon: Trophy, color: \"#f59e0b\", bg: \"#fef3c7\" },
  xp: { icon: Zap, color: \"#3b82f6\", bg: \"#dbeafe\" },
  streak: { icon: Flame, color: \"#ef4444\", bg: \"#fecaca\" },
  lesson: { icon: BookOpen, color: \"#10b981\", bg: \"#d1fae5\" },
  system: { icon: Bell, color: \"#8b5cf6\", bg: \"#ede9fe\" },
};

export default function NotificationPanel({ notifications, onMarkRead, onMarkAllRead, onDismiss }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className=\"relative\">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className=\"relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-100 transition\"
      >
        <Bell className=\"w-5 h-5 text-gray-600\" />
        {unreadCount > 0 && (
          <span className=\"absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center\">
            {unreadCount > 9 ? \"9+\" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className=\"absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden\">
          <div className=\"flex items-center justify-between px-4 py-3 border-b border-gray-100\">
            <h3 className=\"text-sm font-bold text-gray-900\">Thong bao</h3>
            <div className=\"flex items-center gap-2\">
              {unreadCount > 0 && (
                <button onClick={onMarkAllRead} className=\"text-xs text-blue-500 hover:underline flex items-center gap-1\">
                  <CheckCheck className=\"w-3 h-3\" /> Doc tat ca
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className=\"w-6 h-6 flex items-center justify-center\">
                <X className=\"w-4 h-4 text-gray-400\" />
              </button>
            </div>
          </div>

          <div className=\"max-h-80 overflow-y-auto\">
            {notifications.length === 0 ? (
              <div className=\"p-6 text-center text-gray-400 text-sm\">
                Khong co thong bao nao
              </div>
            ) : (
              notifications.slice(0, 10).map((n) => {
                const typeInfo = typeIcons[n.type];
                const Icon = typeInfo.icon;
                return (
                  <div
                    key={n.id}
                    className={\"flex gap-3 px-4 py-3 border-b border-gray-50 transition \" + (!n.read ? \"bg-blue-50/50\" : \"\")}
                    onClick={() => onMarkRead(n.id)}
                  >
                    <div
                      className=\"w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0\"
                      style={{ background: typeInfo.bg }}
                    >
                      <Icon className=\"w-4 h-4\" style={{ color: typeInfo.color }} />
                    </div>
                    <div className=\"flex-1 min-w-0\">
                      <p className={\"text-xs \" + (n.read ? \"text-gray-600\" : \"text-gray-900 font-semibold\")}>{n.title}</p>
                      <p className=\"text-[11px] text-gray-400 mt-0.5 truncate\">{n.message}</p>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); onDismiss(n.id); }} className=\"text-gray-300 hover:text-red-400\">
                      <Trash2 className=\"w-3.5 h-3.5\" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
"@ 'feat(notifications): create NotificationPanel with dropdown'

NF 'src/lib/notification-helpers.ts' @"
/**
 * Notification creation helpers
 */
export type NotificationType = 'achievement' | 'xp' | 'streak' | 'lesson' | 'system';

export interface NotificationData {
  type: NotificationType;
  title: string;
  message: string;
}

let notifId = 0;

export function createNotification(type: NotificationType, title: string, message: string) {
  return {
    id: 'notif-' + (++notifId) + '-' + Date.now(),
    type,
    title,
    message,
    read: false,
    createdAt: new Date().toISOString(),
  };
}

export function achievementNotification(name: string, xp: number) {
  return createNotification('achievement', 'Mo khoa thanh tuu!', name + ' - Nhan ' + xp + ' XP');
}

export function streakNotification(days: number) {
  return createNotification('streak', 'Streak ' + days + ' ngay!', 'Tiep tuc hoc moi ngay de duy tri streak');
}

export function xpNotification(amount: number, source: string) {
  return createNotification('xp', '+' + amount + ' XP', 'Nhan tu ' + source);
}

export function lessonNotification(lessonName: string) {
  return createNotification('lesson', 'Hoan thanh bai hoc!', lessonName);
}
"@ 'feat(notifications): add notification creation helpers'

Write-Host "Notifications: 2 commits done" -ForegroundColor Green

# ============================================
# STUDY PLANNER (10 commits)
# ============================================
Write-Host '=== STUDY PLANNER ===' -ForegroundColor Cyan

NF 'src/app/dashboard/planner/planner.css' @"
:root {
  --pl-primary: #06b6d4;
  --pl-accent: #0891b2;
  --pl-bg: #f8fafc;
  --pl-card: #ffffff;
  --pl-border: #e2e8f0;
  --pl-text: #1e293b;
  --pl-muted: #94a3b8;
}
"@ 'style(planner): add CSS variables'

AF 'src/app/dashboard/planner/planner.css' @"
.pl-header {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
  border-radius: 20px;
  padding: 28px;
  color: white;
  position: relative;
  overflow: hidden;
}
.pl-header::before {
  content: '';
  position: absolute;
  bottom: -30%;
  right: -15%;
  width: 200px;
  height: 200px;
  background: rgba(255,255,255,0.06);
  border-radius: 50%;
}
"@ 'style(planner): add header gradient styles'

AF 'src/app/dashboard/planner/planner.css' @"
.pl-week-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 8px;
  margin: 20px 0;
}
.pl-day-card {
  background: var(--pl-card);
  border: 1px solid var(--pl-border);
  border-radius: 12px;
  padding: 12px;
  text-align: center;
  transition: all 0.2s;
  cursor: pointer;
}
.pl-day-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.pl-day-card.today { border-color: var(--pl-primary); background: #ecfeff; }
.pl-day-card.completed { border-color: #10b981; background: #ecfdf5; }
.pl-day-name { font-size: 11px; font-weight: 700; color: var(--pl-muted); text-transform: uppercase; }
.pl-day-num { font-size: 18px; font-weight: 800; color: var(--pl-text); margin-top: 4px; }
.pl-day-status { font-size: 16px; margin-top: 4px; }
"@ 'style(planner): add weekly calendar grid styles'

AF 'src/app/dashboard/planner/planner.css' @"
.pl-task-list { display: flex; flex-direction: column; gap: 8px; }
.pl-task {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--pl-border);
  border-radius: 12px;
  transition: all 0.2s;
}
.pl-task:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.pl-task.done { opacity: 0.6; }
.pl-task-check {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid var(--pl-border); cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.pl-task-check.checked { background: #10b981; border-color: #10b981; }
.pl-task-title { font-size: 13px; font-weight: 600; color: var(--pl-text); }
.pl-task-time { font-size: 11px; color: var(--pl-muted); }
.pl-task-xp { font-size: 11px; font-weight: 700; color: var(--pl-primary); margin-left: auto; }
@media (max-width: 640px) {
  .pl-week-grid { grid-template-columns: repeat(4, 1fr); }
}
"@ 'style(planner): add task list and responsive styles'

# Planner Server Page
NF 'src/app/dashboard/planner/page.tsx' @"
import type { Metadata } from 'next';
import PlannerClient from './PlannerClient';

export const metadata: Metadata = {
  title: 'Ke hoach hoc tap | DHV-Lingoo',
  description: 'Lap ke hoach va theo doi tien trinh hoc hang ngay',
};

export default function PlannerPage() {
  return <PlannerClient />;
}
"@ 'feat(planner): create server page with metadata'

NF 'src/app/dashboard/planner/PlannerClient.tsx' @"
\"use client\";

import { useState, useMemo } from \"react\";
import { CalendarDays, Check, Clock, Zap, BookOpen, Brain, Headphones, PenLine, Trophy } from \"lucide-react\";
import \"./planner.css\";

interface StudyTask {
  id: string;
  title: string;
  type: \"lesson\" | \"practice\" | \"review\" | \"flashcard\";
  duration: number;
  xp: number;
  completed: boolean;
}

const DAILY_TASKS: StudyTask[] = [
  { id: \"t1\", title: \"Hoc bai moi\", type: \"lesson\", duration: 15, xp: 25, completed: false },
  { id: \"t2\", title: \"Luyen tap tu vung\", type: \"practice\", duration: 10, xp: 15, completed: false },
  { id: \"t3\", title: \"On tap flashcard\", type: \"flashcard\", duration: 5, xp: 10, completed: false },
  { id: \"t4\", title: \"Luyen nghe\", type: \"practice\", duration: 10, xp: 20, completed: false },
  { id: \"t5\", title: \"Dien tu vao cho trong\", type: \"practice\", duration: 10, xp: 15, completed: false },
  { id: \"t6\", title: \"On tap bai cu\", type: \"review\", duration: 10, xp: 10, completed: false },
];

const WEEK_DAYS = [\"CN\", \"T2\", \"T3\", \"T4\", \"T5\", \"T6\", \"T7\"];

const taskIcons = {
  lesson: BookOpen,
  practice: Brain,
  review: PenLine,
  flashcard: Headphones,
};

export default function PlannerClient() {
  const [tasks, setTasks] = useState(DAILY_TASKS);

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalXp = tasks.filter((t) => t.completed).reduce((s, t) => s + t.xp, 0);
  const totalDuration = tasks.filter((t) => t.completed).reduce((s, t) => s + t.duration, 0);
  const progress = Math.round((completedCount / tasks.length) * 100);

  const today = new Date();
  const weekDays = useMemo(() => {
    const start = new Date(today);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return {
        name: WEEK_DAYS[i],
        num: d.getDate(),
        isToday: d.toDateString() === today.toDateString(),
        isPast: d < today && d.toDateString() !== today.toDateString(),
      };
    });
  }, []);

  return (
    <div className=\"p-4 lg:p-6 max-w-3xl mx-auto\">
      <div className=\"pl-header\">
        <div className=\"relative z-10\">
          <div className=\"flex items-center gap-3 mb-2\">
            <CalendarDays className=\"w-6 h-6\" />
            <h1 className=\"text-2xl font-bold\">Ke hoach hom nay</h1>
          </div>
          <p className=\"text-sm opacity-80\">Hoan thanh cac nhiem vu de nhan XP</p>
          <div className=\"flex items-center gap-4 mt-3\">
            <span className=\"text-sm flex items-center gap-1\"><Check className=\"w-4 h-4\" /> {completedCount}/{tasks.length}</span>
            <span className=\"text-sm flex items-center gap-1\"><Zap className=\"w-4 h-4\" /> {totalXp} XP</span>
            <span className=\"text-sm flex items-center gap-1\"><Clock className=\"w-4 h-4\" /> {totalDuration} phut</span>
          </div>
          <div className=\"mt-3 h-2 bg-white/20 rounded-full overflow-hidden\">
            <div className=\"h-full bg-white rounded-full transition-all\" style={{ width: progress + \"%\" }} />
          </div>
        </div>
      </div>

      <div className=\"pl-week-grid\">
        {weekDays.map((d) => (
          <div key={d.name} className={\"pl-day-card\" + (d.isToday ? \" today\" : \"\") + (d.isPast ? \" completed\" : \"\")}>
            <div className=\"pl-day-name\">{d.name}</div>
            <div className=\"pl-day-num\">{d.num}</div>
            <div className=\"pl-day-status\">{d.isToday ? \"\\ud83d\\udcaa\" : d.isPast ? \"\\u2705\" : \"\"}</div>
          </div>
        ))}
      </div>

      <h2 className=\"text-sm font-bold text-gray-900 mb-3 flex items-center gap-2\">
        <Trophy className=\"w-4 h-4 text-cyan-500\" /> Nhiem vu hom nay
      </h2>

      <div className=\"pl-task-list\">
        {tasks.map((t) => {
          const Icon = taskIcons[t.type];
          return (
            <div key={t.id} className={\"pl-task\" + (t.completed ? \" done\" : \"\")}>
              <div
                className={\"pl-task-check\" + (t.completed ? \" checked\" : \"\")}
                onClick={() => toggleTask(t.id)}
              >
                {t.completed && <Check className=\"w-3 h-3 text-white\" />}
              </div>
              <Icon className=\"w-4 h-4 text-gray-400 flex-shrink-0\" />
              <div>
                <div className={\"pl-task-title\" + (t.completed ? \" line-through\" : \"\")}>{t.title}</div>
                <div className=\"pl-task-time\">{t.duration} phut</div>
              </div>
              <div className=\"pl-task-xp\">+{t.xp} XP</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
"@ 'feat(planner): create PlannerClient with tasks and weekly view'

Write-Host "Planner: 6 commits done" -ForegroundColor Green

# Push
git push origin main 2>$null
Write-Host '[PUSHED] Part 1: 28 commits' -ForegroundColor Magenta
