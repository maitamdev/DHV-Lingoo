// Dashboard home - user stats, charts, leaderboard, quick actions
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
    Flame, Trophy, Bell, BookOpen, Play, Clock, TrendingUp,
    Calendar, Target, Zap, Award, Sparkles, ChevronRight, GraduationCap,
    BookMarked, Headphones, MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { WeeklyActivityChart, XPProgressChart, SkillsBreakdownChart } from "@/components/dashboard/DashboardCharts";

const goalLabels: Record<string, string> = {
    travel: "Du lịch", toeic: "TOEIC", ielts: "IELTS",
    business: "Kinh doanh", communication: "Giao tiếp",
};
const skillLabels: Record<string, string> = {
    listening: "Nghe", speaking: "Nói", reading: "Đọc",
    writing: "Viết", vocabulary: "Từ vựng", grammar: "Ngữ pháp",
};
const levelConfig: Record<string, { label: string; progress: number; color: string }> = {
    A1: { label: "Người mới bắt đầu", progress: 10, color: "from-blue-600 to-indigo-700" },
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

    // Fetch courses with lesson count
    const { data: courses } = await supabase.from("courses").select("id, title, level, thumbnail_url, description").order("created_at", { ascending: true }).limit(4);

    // Fetch total counts for stats
    const { count: totalLessons } = await supabase.from("lessons").select("id", { count: "exact", head: true });
    const { count: totalVocab } = await supabase.from("lesson_vocabularies").select("id", { count: "exact", head: true });
    const { count: totalCourses } = await supabase.from("courses").select("id", { count: "exact", head: true });

    // Fetch user's lesson progress for charts
    const { data: lessonProgress } = await supabase
        .from("lesson_progress")
        .select("completed_at, xp_earned, score, course_id")
        .eq("user_id", user.id)
        .eq("completed", true)
        .order("completed_at", { ascending: true });

    const progressData = (lessonProgress || []).map(p => ({
        completed_at: p.completed_at || new Date().toISOString(),
        xp_earned: p.xp_earned || 0,
        score: p.score || 0,
        course_id: p.course_id || "",
    }));
    const completedLessons = progressData.length;

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
        <div className="min-h-screen bg-[#f0f2f5]">
            {/* Subtle grid */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

            <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* ── Top Bar ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold font-heading text-gray-900">
                            {getGreeting()},{" "}
                            <span className="text-blue-600">{displayName}</span>
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {streak > 0
                                ? `🔥 Chuỗi ${streak} ngày liên tiếp — Tiếp tục phát huy!`
                                : "Bắt đầu hành trình học tập của bạn ngay hôm nay"}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {streak > 0 && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-white border-l-4 border-l-orange-500 border border-gray-200 shadow-sm">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-bold text-orange-600">{streak} ngày</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ══════ MAIN GRID ══════ */}
                <div className="flex flex-col xl:flex-row gap-5">
                    {/* LEFT */}
                    <div className="flex-1 min-w-0 space-y-5">

                        {/* Hero + Stats */}
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                            {/* Course Card */}
                            <div className={`lg:col-span-3 relative bg-gradient-to-br ${levelInfo.color} text-white p-6 sm:p-7 overflow-hidden shadow-lg`}>
                                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/5 rotate-45" />
                                <div className="absolute right-8 bottom-6 w-20 h-20 border border-white/10 rotate-12" />
                                <div className="relative">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2.5 py-0.5 bg-white/20 backdrop-blur-sm text-[10px] font-bold uppercase tracking-widest">
                                            Level {level}
                                        </span>
                                        <span className="px-2.5 py-0.5 bg-white/10 text-[10px] font-medium uppercase tracking-wider text-white/70">
                                            {levelInfo.label}
                                        </span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-extrabold font-heading mb-1 leading-tight">
                                        {goals.length > 0
                                            ? `Tiếng Anh ${goals.map(g => goalLabels[g.toLowerCase()] || g).join(", ")}`
                                            : "Tiếng Anh Tổng Quát"}
                                    </h2>
                                    <p className="text-white/50 text-sm mb-6">Khóa học chính của bạn</p>
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Tiến trình</span>
                                            <span className="text-sm font-mono font-bold text-white/90">{levelInfo.progress}%</span>
                                        </div>
                                        <div className="h-1.5 bg-black/20 overflow-hidden">
                                            <div className="h-full bg-white/80 transition-all duration-1000" style={{ width: `${levelInfo.progress}%` }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats Column */}
                            <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4">
                                <div className="bg-white border border-gray-200 border-l-4 border-l-blue-500 p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tổng XP</span>
                                        <Trophy className="h-4 w-4 text-blue-400" />
                                    </div>
                                    <p className="text-3xl font-mono font-black text-gray-900">{xp.toLocaleString()}</p>
                                </div>
                                <div className="bg-white border border-gray-200 border-l-4 border-l-orange-500 p-5 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Chuỗi học</span>
                                        <Flame className="h-4 w-4 text-orange-400" />
                                    </div>
                                    <p className="text-3xl font-mono font-black text-gray-900">{streak}</p>
                                    {longestStreak > 0 && <p className="text-[10px] text-gray-400 mt-1">Kỷ lục: {longestStreak} ngày</p>}
                                </div>
                            </div>
                        </div>

                        {/* Platform Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <MiniStat icon={<BookOpen className="h-4 w-4" />} label="Khóa học" value={String(totalCourses || 0)} accent="border-t-blue-500" />
                            <MiniStat icon={<GraduationCap className="h-4 w-4" />} label="Bài học" value={String(totalLessons || 0)} accent="border-t-indigo-500" />
                            <MiniStat icon={<BookMarked className="h-4 w-4" />} label="Từ vựng" value={String(totalVocab || 0)} accent="border-t-violet-500" />
                            <MiniStat icon={<Calendar className="h-4 w-4" />} label="Ngày tham gia" value={daysSinceJoined === 0 ? "Hôm nay" : `${daysSinceJoined}d`} accent="border-t-cyan-500" />
                        </div>

                        {/* ══════ CHARTS ROW ══════ */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <WeeklyActivityChart progressData={progressData} />
                            <XPProgressChart currentXP={xp} progressData={progressData} />
                        </div>

                        {/* ══════ COURSES SECTION ══════ */}
                        <div className="bg-white border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 bg-blue-50 border border-blue-200 flex items-center justify-center">
                                        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
                                    </div>
                                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Khóa học có sẵn</h3>
                                </div>
                                <Link href="/dashboard/courses" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-wider">
                                    Xem tất cả <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>
                            {courses && courses.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {courses.map((course) => {
                                        const cLevel = levelConfig[course.level || "A1"] || levelConfig.A1;
                                        return (
                                            <Link
                                                key={course.id}
                                                href={`/dashboard/courses/${course.id}`}
                                                className="flex items-center gap-4 p-4 border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all group"
                                            >
                                                <div className={`w-12 h-12 flex-shrink-0 bg-gradient-to-br ${cLevel.color} flex items-center justify-center`}>
                                                    <BookOpen className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition truncate">{course.title}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{course.level}</span>
                                                        <span className="w-1 h-1 bg-gray-300" />
                                                        <span className="text-[10px] text-gray-400 truncate">{course.description}</span>
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 transition flex-shrink-0" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-6">Chưa có khóa học nào</p>
                            )}
                        </div>

                        {/* Goals & Skills + Pie Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <TagSection
                                icon={<Target className="h-3.5 w-3.5 text-blue-500" />}
                                title="Mục tiêu"
                                items={goals.map(g => goalLabels[g.toLowerCase()] || g)}
                                emptyText="Chưa thiết lập mục tiêu"
                                tagColor="bg-blue-50 text-blue-700 border-blue-200"
                                iconBg="bg-blue-50 border-blue-200"
                            />
                            <TagSection
                                icon={<Zap className="h-3.5 w-3.5 text-violet-500" />}
                                title="Kỹ năng"
                                items={interests.map(i => skillLabels[i.toLowerCase()] || i)}
                                emptyText="Chưa chọn kỹ năng"
                                tagColor="bg-violet-50 text-violet-700 border-violet-200"
                                iconBg="bg-violet-50 border-violet-200"
                            />
                            <SkillsBreakdownChart progressData={progressData} completedLessons={completedLessons} />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-7 h-7 bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                                    <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Bắt đầu nhanh</h3>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <QuickAction href="/dashboard/courses" icon={<BookOpen className="h-5 w-5" />} label="Khóa học" color="blue" />
                                <QuickAction href="/dashboard/roadmap" icon={<TrendingUp className="h-5 w-5" />} label="Lộ trình AI" color="indigo" />
                                <QuickAction href="/dashboard/flashcards" icon={<BookMarked className="h-5 w-5" />} label="Flashcards" color="violet" />
                                <QuickAction href="/dashboard/practice" icon={<Headphones className="h-5 w-5" />} label="Luyện tập" color="cyan" />
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="bg-white border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-7 h-7 bg-gray-100 border border-gray-200 flex items-center justify-center">
                                    <Award className="h-3.5 w-3.5 text-gray-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tài khoản</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-1">
                                <InfoItem label="Email" value={user.email || "—"} />
                                <InfoItem label="Giới tính" value={profile?.gender === "male" ? "Nam" : profile?.gender === "female" ? "Nữ" : profile?.gender === "other" ? "Khác" : "—"} />
                                <InfoItem label="Ngày sinh" value={profile?.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString("vi-VN") : "—"} />
                                <InfoItem label="Vai trò" value={profile?.role === "student" ? "Học viên" : profile?.role === "teacher" ? "Giảng viên" : profile?.role === "admin" ? "Quản trị" : "Học viên"} />
                                <InfoItem label="Quốc gia" value={profile?.country || "—"} />
                                <InfoItem label="Hoạt động" value={lastActiveDate ? new Date(lastActiveDate).toLocaleDateString("vi-VN") : "—"} />
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="w-full xl:w-[300px] flex-shrink-0 space-y-5">
                        {/* Leaderboard */}
                        <div className="bg-white border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center gap-2.5 mb-5">
                                <div className="w-7 h-7 bg-amber-50 border border-amber-200 flex items-center justify-center">
                                    <Trophy className="h-3.5 w-3.5 text-amber-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Xếp hạng</h3>
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
                                <p className="text-sm text-gray-400 text-center py-4">Chưa có dữ liệu</p>
                            )}
                            {userRank >= 0 && (
                                <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                                    <p className="text-xs text-gray-400">
                                        Hạng: <span className="font-mono font-bold text-blue-600">#{userRank + 1}</span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Summary Panel */}
                        <div className={`relative overflow-hidden bg-gradient-to-br ${levelInfo.color} shadow-lg`}>
                            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/5 rotate-45" />
                            <div className="relative p-5 text-white">
                                <h3 className="text-sm font-bold uppercase tracking-wide mb-5 flex items-center gap-2">
                                    <Sparkles className="w-3.5 h-3.5 text-white/60" /> Tóm tắt
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

                        {/* Daily Tip */}
                        <div className="bg-white border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="w-7 h-7 bg-amber-50 border border-amber-200 flex items-center justify-center">
                                    <MessageCircle className="h-3.5 w-3.5 text-amber-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Mẹo hôm nay</h3>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                💡 Hãy ôn lại từ vựng cũ mỗi ngày. Phương pháp <span className="font-bold text-gray-900">Spaced Repetition</span> giúp bạn nhớ lâu hơn gấp 3 lần so với cách học thông thường!
                            </p>
                        </div>

                        {/* Learning Stats Mini */}
                        <div className="bg-white border border-gray-200 shadow-sm p-5">
                            <div className="flex items-center gap-2.5 mb-4">
                                <div className="w-7 h-7 bg-cyan-50 border border-cyan-200 flex items-center justify-center">
                                    <Clock className="h-3.5 w-3.5 text-cyan-500" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Thiết lập</h3>
                            </div>
                            <div className="space-y-3">
                                <SettingRow label="Mục tiêu/ngày" value={`${dailyTime} phút`} />
                                <SettingRow label="Level hiện tại" value={level} />
                                <SettingRow label="Ngày tham gia" value={createdAt.toLocaleDateString("vi-VN")} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ═══════ SUB COMPONENTS ═══════ */

function MiniStat({ icon, label, value, accent }: {
    icon: React.ReactNode; label: string; value: string; accent: string;
}) {
    return (
        <div className={`bg-white border border-gray-200 border-t-2 ${accent} p-4 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-2.5">
                <span className="text-gray-400">{icon}</span>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                    <p className="text-lg font-mono font-bold text-gray-900">{value}</p>
                </div>
            </div>
        </div>
    );
}

function TagSection({ icon, title, items, emptyText, tagColor, iconBg }: {
    icon: React.ReactNode; title: string; items: string[]; emptyText: string; tagColor: string; iconBg: string;
}) {
    return (
        <div className="bg-white border border-gray-200 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2.5 mb-4">
                <div className={`w-7 h-7 border flex items-center justify-center ${iconBg}`}>{icon}</div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">{title}</h3>
            </div>
            {items.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {items.map((item) => (
                        <span key={item} className={`px-3 py-1.5 text-xs font-semibold border ${tagColor}`}>{item}</span>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400 italic">{emptyText}</p>
            )}
        </div>
    );
}

function QuickAction({ href, icon, label, color }: {
    href: string; icon: React.ReactNode; label: string; color: string;
}) {
    const colorMap: Record<string, string> = {
        blue: "text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300",
        indigo: "text-indigo-500 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300",
        violet: "text-violet-500 bg-violet-50 border-violet-200 hover:bg-violet-100 hover:border-violet-300",
        cyan: "text-cyan-500 bg-cyan-50 border-cyan-200 hover:bg-cyan-100 hover:border-cyan-300",
    };
    return (
        <Link href={href} className={`flex flex-col items-center gap-2 p-4 border transition-all ${colorMap[color] || colorMap.blue}`}>
            {icon}
            <span className="text-xs font-bold text-gray-700">{label}</span>
        </Link>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="py-2.5 border-b border-gray-100 last:border-0">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
            <p className="text-sm font-medium text-gray-800 truncate">{value}</p>
        </div>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0">
            <span className="text-xs text-white/60">{label}</span>
            <span className="text-xs font-mono font-bold">{value}</span>
        </div>
    );
}

function SettingRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
            <span className="text-xs text-gray-400">{label}</span>
            <span className="text-xs font-mono font-bold text-gray-800">{value}</span>
        </div>
    );
}

function LeaderboardItem({ rank, name, points, isYou = false }: {
    rank: number; name: string; points: number; isYou?: boolean;
}) {
    const rankColor = rank === 1 ? "bg-amber-100 text-amber-700 border-amber-200"
        : rank === 2 ? "bg-gray-100 text-gray-500 border-gray-200"
            : rank === 3 ? "bg-orange-100 text-orange-700 border-orange-200"
                : "bg-gray-50 text-gray-400 border-gray-200";

    return (
        <div className={`flex items-center gap-3 p-2.5 transition-all ${isYou ? "bg-blue-50 border border-blue-200" : "hover:bg-gray-50 border border-transparent"}`}>
            <span className={`w-7 h-7 flex items-center justify-center text-[11px] font-mono font-bold flex-shrink-0 border ${rankColor}`}>
                {rank}
            </span>
            <div className={`w-8 h-8 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isYou ? "bg-gradient-to-br from-blue-500 to-indigo-600" : "bg-gray-300"}`}>
                {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                    {name} {isYou && <span className="text-blue-500 text-xs font-bold">(Bạn)</span>}
                </p>
                <p className="text-[10px] font-mono text-gray-400">{points.toLocaleString()} XP</p>
            </div>
            {rank === 1 && <span className="text-sm">🏆</span>}
        </div>
    );
}
