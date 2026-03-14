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