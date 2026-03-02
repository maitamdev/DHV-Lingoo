import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
    Flame,
    Trophy,
    Bell,
    BookOpen,
    Play,
    Clock,
    TrendingUp,
    Calendar,
    Target,
    Zap,
    Award,
    Sparkles,
    ChevronRight,
    Star,
} from "lucide-react";

const goalLabels: Record<string, string> = {
    travel: "Du lịch",
    toeic: "TOEIC",
    ielts: "IELTS",
    business: "Kinh doanh",
    communication: "Giao tiếp",
};

const skillLabels: Record<string, string> = {
    listening: "Nghe", speaking: "Nói", reading: "Đọc",
    writing: "Viết", vocabulary: "Từ vựng", grammar: "Ngữ pháp",
};

const levelConfig: Record<string, { label: string; progress: number; color: string }> = {
    A1: { label: "Người mới bắt đầu", progress: 10, color: "from-blue-500 to-indigo-600" },
    A2: { label: "Sơ cấp", progress: 25, color: "from-cyan-500 to-blue-600" },
    B1: { label: "Trung cấp", progress: 45, color: "from-violet-500 to-purple-600" },
    B2: { label: "Trung cấp cao", progress: 65, color: "from-orange-500 to-red-600" },
    C1: { label: "Cao cấp", progress: 85, color: "from-pink-500 to-rose-600" },
    C2: { label: "Thành thạo", progress: 100, color: "from-amber-500 to-yellow-600" },
};

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
}

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    const { data: leaderboard } = await supabase.from("profiles").select("id, full_name, xp, avatar_url").order("xp", { ascending: false }).limit(5);

    const displayName = profile?.full_name || user.email?.split("@")[0] || "Học viên";
    const level = profile?.level || "A1";
    const levelInfo = levelConfig[level] || levelConfig.A1;
    const xp = profile?.xp || 0;
    const streak = profile?.streak || 0;
    const longestStreak = profile?.longest_streak || 0;
    const dailyTime = profile?.daily_time || 30;
    const goals = (profile?.goals || []) as string[];
    const interests = (profile?.interests || []) as string[];
    const lastActiveDate = profile?.last_active_date;
    const createdAt = profile?.created_at ? new Date(profile.created_at) : new Date();
    const daysSinceJoined = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    const userRank = leaderboard?.findIndex((p) => p.id === user.id) ?? -1;

    return (
        <div className="min-h-screen bg-gray-950">
            {/* ══════ HERO BANNER ══════ */}
            <div className="relative overflow-hidden">
                {/* Geometric grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-3xl" />
                <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-indigo-500/5 blur-3xl" />

                <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
                    {/* Top Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                                    {getGreeting()},{" "}
                                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                                        {displayName}
                                    </span>
                                </h1>
                            </div>
                            <p className="text-gray-500 text-sm">
                                {streak > 0
                                    ? `🔥 Chuỗi ${streak} ngày liên tiếp — Tiếp tục phát huy!`
                                    : "Bắt đầu hành trình học tập của bạn ngay hôm nay"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {streak > 0 && (
                                <div className="flex items-center gap-2 px-4 py-2 bg-orange-500/10 border border-orange-500/20 text-orange-400">
                                    <Flame className="h-4 w-4" />
                                    <span className="text-sm font-bold">{streak} ngày</span>
                                </div>
                            )}
                            <button className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all">
                                <Bell className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* ══════ MAIN GRID ══════ */}
                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* LEFT COLUMN */}
                        <div className="flex-1 min-w-0 space-y-5">

                            {/* Course Hero + Stats */}
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                {/* Course Card - spans 3 */}
                                <div className="lg:col-span-3 relative group">
                                    <div className={`absolute inset-0 bg-gradient-to-r ${levelInfo.color} opacity-20 group-hover:opacity-30 transition-opacity duration-500`} />
                                    <div className="relative bg-gray-900/80 backdrop-blur-sm border border-white/10 p-6 sm:p-7 h-full">
                                        {/* Decorative corner accent */}
                                        <div className="absolute top-0 left-0 w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
                                        <div className="absolute top-0 left-0 w-1 h-20 bg-gradient-to-b from-blue-500 to-transparent" />

                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                                                {level}
                                            </span>
                                            <span className="px-2.5 py-0.5 bg-white/5 border border-white/10 text-gray-400 text-[10px] font-medium uppercase tracking-wider">
                                                {levelInfo.label}
                                            </span>
                                        </div>

                                        <h2 className="text-xl sm:text-2xl font-extrabold font-heading text-white mb-1 leading-tight">
                                            {goals.length > 0
                                                ? `Tiếng Anh ${goals.map(g => goalLabels[g.toLowerCase()] || g).join(", ")}`
                                                : "Tiếng Anh Tổng Quát"}
                                        </h2>
                                        <p className="text-gray-500 text-sm mb-6">Khóa học chính của bạn</p>

                                        {/* Progress */}
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tiến trình</span>
                                                <span className="text-sm font-mono font-bold text-blue-400">{levelInfo.progress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-white/5 overflow-hidden">
                                                <div
                                                    className={`h-full bg-gradient-to-r ${levelInfo.color} transition-all duration-1000`}
                                                    style={{ width: `${levelInfo.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats - spans 2 */}
                                <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
                                    {/* XP */}
                                    <div className="relative bg-gray-900/60 border border-white/10 p-5 group hover:border-blue-500/30 transition-colors">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-colors" />
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Tổng XP</span>
                                                <Trophy className="h-4 w-4 text-blue-500/50" />
                                            </div>
                                            <p className="text-3xl font-mono font-black text-white">{xp.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Streak */}
                                    <div className="relative bg-gray-900/60 border border-white/10 p-5 group hover:border-orange-500/30 transition-colors">
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/5 blur-2xl group-hover:bg-orange-500/10 transition-colors" />
                                        <div className="relative">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Chuỗi học</span>
                                                <Flame className="h-4 w-4 text-orange-500/50" />
                                            </div>
                                            <p className="text-3xl font-mono font-black text-white">{streak}</p>
                                            {longestStreak > 0 && (
                                                <p className="text-[10px] text-gray-600 mt-1">Kỷ lục: {longestStreak} ngày</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats Row */}
                            <div className="grid grid-cols-3 gap-4">
                                <MiniStat icon={<Clock className="h-4 w-4" />} label="Mục tiêu/ngày" value={`${dailyTime}m`} color="cyan" />
                                <MiniStat icon={<TrendingUp className="h-4 w-4" />} label="Level" value={level} color="blue" />
                                <MiniStat icon={<Calendar className="h-4 w-4" />} label="Tham gia" value={daysSinceJoined === 0 ? "Hôm nay" : `${daysSinceJoined}d`} color="indigo" />
                            </div>

                            {/* Goals & Skills */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Goals */}
                                <div className="bg-gray-900/60 border border-white/10 p-5 hover:border-white/20 transition-colors">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                            <Target className="h-3.5 w-3.5 text-blue-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Mục tiêu</h3>
                                    </div>
                                    {goals.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {goals.map((goal) => (
                                                <span key={goal} className="px-3 py-1.5 text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-300">
                                                    {goalLabels[goal.toLowerCase()] || goal}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600 italic">Chưa thiết lập mục tiêu</p>
                                    )}
                                </div>

                                {/* Skills */}
                                <div className="bg-gray-900/60 border border-white/10 p-5 hover:border-white/20 transition-colors">
                                    <div className="flex items-center gap-2.5 mb-4">
                                        <div className="w-7 h-7 bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                                            <Zap className="h-3.5 w-3.5 text-violet-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Kỹ năng</h3>
                                    </div>
                                    {interests.length > 0 ? (
                                        <div className="flex flex-wrap gap-2">
                                            {interests.map((interest) => (
                                                <span key={interest} className="px-3 py-1.5 text-xs font-semibold bg-violet-500/10 border border-violet-500/20 text-violet-300">
                                                    {skillLabels[interest.toLowerCase()] || interest}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-600 italic">Chưa chọn kỹ năng</p>
                                    )}
                                </div>
                            </div>

                            {/* Account Info */}
                            <div className="bg-gray-900/60 border border-white/10 p-5">
                                <div className="flex items-center gap-2.5 mb-5">
                                    <div className="w-7 h-7 bg-white/5 border border-white/10 flex items-center justify-center">
                                        <Award className="h-3.5 w-3.5 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide">Tài khoản</h3>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
                                    <InfoItem label="Email" value={user.email || "—"} />
                                    <InfoItem label="Giới tính" value={
                                        profile?.gender === "male" ? "Nam"
                                            : profile?.gender === "female" ? "Nữ"
                                                : profile?.gender === "other" ? "Khác" : "—"
                                    } />
                                    <InfoItem label="Ngày sinh" value={
                                        profile?.date_of_birth
                                            ? new Date(profile.date_of_birth).toLocaleDateString("vi-VN") : "—"
                                    } />
                                    <InfoItem label="Vai trò" value={
                                        profile?.role === "student" ? "Học viên"
                                            : profile?.role === "teacher" ? "Giảng viên"
                                                : profile?.role === "admin" ? "Quản trị" : "Học viên"
                                    } />
                                    <InfoItem label="Quốc gia" value={profile?.country || "—"} />
                                    <InfoItem label="Hoạt động" value={
                                        lastActiveDate ? new Date(lastActiveDate).toLocaleDateString("vi-VN") : "—"
                                    } />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR */}
                        <div className="w-full xl:w-[300px] flex-shrink-0 space-y-5">
                            {/* Leaderboard */}
                            <div className="bg-gray-900/60 border border-white/10 p-5">
                                <div className="flex items-center justify-between mb-5">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-7 h-7 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                            <Trophy className="h-3.5 w-3.5 text-amber-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-wide">Xếp hạng</h3>
                                    </div>
                                </div>
                                {leaderboard && leaderboard.length > 0 ? (
                                    <div className="space-y-1">
                                        {leaderboard.map((person, index) => (
                                            <LeaderboardItem
                                                key={person.id}
                                                rank={index + 1}
                                                name={person.full_name || "Ẩn danh"}
                                                points={person.xp || 0}
                                                isYou={person.id === user.id}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 text-center py-4">Chưa có dữ liệu</p>
                                )}
                                {userRank >= 0 && (
                                    <div className="mt-4 pt-3 border-t border-white/5 text-center">
                                        <p className="text-xs text-gray-500">
                                            Hạng của bạn: <span className="font-mono font-bold text-blue-400">#{userRank + 1}</span>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Summary Panel */}
                            <div className="relative overflow-hidden border border-white/10">
                                <div className={`absolute inset-0 bg-gradient-to-br ${levelInfo.color} opacity-10`} />
                                <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" />

                                {/* Top accent line */}
                                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${levelInfo.color}`} />

                                <div className="relative p-5">
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-5 flex items-center gap-2">
                                        <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Tóm tắt
                                    </h3>
                                    <div className="space-y-3">
                                        <SummaryRow label="Tổng XP" value={xp.toLocaleString()} />
                                        <SummaryRow label="Streak" value={`${streak} ngày`} />
                                        <SummaryRow label="Kỷ lục" value={`${longestStreak} ngày`} />
                                        <SummaryRow label="Level" value={`${level} · ${levelInfo.label}`} />
                                        <SummaryRow label="Mục tiêu" value={`${dailyTime} phút/ngày`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════ SUB COMPONENTS ═══════ */

function MiniStat({ icon, label, value, color }: {
    icon: React.ReactNode; label: string; value: string; color: string;
}) {
    const colorMap: Record<string, string> = {
        cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
        blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    };
    const c = colorMap[color] || colorMap.blue;

    return (
        <div className="bg-gray-900/60 border border-white/10 p-4 hover:border-white/20 transition-colors">
            <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 flex items-center justify-center border ${c}`}>
                    {icon}
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">{label}</p>
                    <p className="text-lg font-mono font-bold text-white">{value}</p>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="py-2 border-b border-white/5 last:border-0">
            <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-300 truncate">{value}</p>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
            <span className="text-xs text-gray-500">{label}</span>
            <span className="text-xs font-mono font-bold text-white">{value}</span>
        </div>
    );
}

function LeaderboardItem({ rank, name, points, isYou = false }: {
    rank: number; name: string; points: number; isYou?: boolean;
}) {
    const rankColor = rank === 1
        ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
        : rank === 2
            ? "bg-gray-400/20 border-gray-400/30 text-gray-300"
            : rank === 3
                ? "bg-amber-700/20 border-amber-700/30 text-amber-600"
                : "bg-white/5 border-white/10 text-gray-500";

    return (
        <div className={`flex items-center gap-3 p-2.5 transition-all ${isYou ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent"}`}>
            <span className={`w-7 h-7 flex items-center justify-center text-[11px] font-mono font-bold flex-shrink-0 border ${rankColor}`}>
                {rank}
            </span>
            <div className={`w-8 h-8 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isYou ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gray-800 border border-white/10"}`}>
                {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-200 truncate">
                    {name} {isYou && <span className="text-blue-400 text-xs">(Bạn)</span>}
                </p>
                <p className="text-[10px] font-mono text-gray-600">{points.toLocaleString()} XP</p>
            </div>
            {rank === 1 && <span className="text-sm">🏆</span>}
        </div>
    );
}
