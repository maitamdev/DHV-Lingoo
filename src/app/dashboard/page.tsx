import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
    Flame,
    Trophy,
    Bell,
    ChevronRight,
    BookOpen,
    Play,
    Clock,
    TrendingUp,
    Calendar,
} from "lucide-react";

const goalLabels: Record<string, string> = {
    travel: "Du lịch",
    toeic: "TOEIC",
    ielts: "IELTS",
    business: "Kinh doanh",
    communication: "Giao tiếp",
};

const levelConfig: Record<string, { label: string; progress: number }> = {
    A1: { label: "Người mới bắt đầu", progress: 10 },
    A2: { label: "Sơ cấp", progress: 25 },
    B1: { label: "Trung cấp", progress: 45 },
    B2: { label: "Trung cấp cao", progress: 65 },
    C1: { label: "Cao cấp", progress: 85 },
    C2: { label: "Thành thạo", progress: 100 },
};

function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Chào buổi sáng";
    if (hour >= 12 && hour < 18) return "Chào buổi chiều";
    return "Chào buổi tối";
}

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch user profile
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    // Fetch real leaderboard data (top 10 users by XP)
    const { data: leaderboard } = await supabase
        .from("profiles")
        .select("id, full_name, xp, avatar_url")
        .order("xp", { ascending: false })
        .limit(10);

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

    // Calculate days since joined
    const daysSinceJoined = Math.floor(
        (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Find user's rank in leaderboard
    const userRank = leaderboard?.findIndex((p) => p.id === user.id) ?? -1;

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px] mx-auto">
            <div className="flex flex-col xl:flex-row gap-6">
                {/* LEFT MAIN CONTENT */}
                <div className="flex-1 min-w-0">
                    {/* Top Section: Greeting + Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                                {getGreeting()},{" "}
                                <span className="text-blue-600">{displayName}</span>
                            </h1>
                            <p className="text-gray-400 mt-1 text-sm">
                                {streak > 0
                                    ? `Bạn đã duy trì chuỗi ${streak} ngày học liên tiếp. Tuyệt vời!`
                                    : "Hãy bắt đầu hành trình học tập của bạn ngay hôm nay!"}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Streak Badge */}
                            {streak > 0 && (
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-50 border border-orange-100">
                                    <Flame className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm font-bold text-orange-600">
                                        {streak} Ngày
                                    </span>
                                </div>
                            )}
                            {/* Bell */}
                            <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                <Bell className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Course Card + Stats Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        {/* Active Course Card */}
                        <div className="lg:col-span-2 rounded-2xl bg-gray-900 text-white p-6 relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500/10" />
                            <div className="absolute -right-5 bottom-0 w-24 h-24 rounded-full bg-blue-500/5" />

                            <div className="relative">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-4">
                                    Trình độ hiện tại
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold mb-1 leading-tight">
                                    {goals.length > 0
                                        ? `Tiếng Anh ${goals.map(g => goalLabels[g.toLowerCase()] || g).join(", ")}`
                                        : "Tiếng Anh Tổng Quát"}
                                </h2>
                                <p className="text-blue-200/60 text-sm mb-6">
                                    {levelInfo.label} ({level})
                                </p>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            Tiến trình level
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-blue-500 transition-all"
                                                    style={{ width: `${levelInfo.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400">{levelInfo.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Column */}
                        <div className="flex flex-col gap-4">
                            {/* Total Points - REAL */}
                            <div className="flex-1 rounded-2xl bg-white border border-gray-100 p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Tổng điểm
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {xp.toLocaleString()}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                                    <Trophy className="h-5 w-5 text-blue-500" />
                                </div>
                            </div>

                            {/* Streak - REAL */}
                            <div className="flex-1 rounded-2xl bg-white border border-gray-100 p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Chuỗi ngày học
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        {streak}
                                    </p>
                                    {longestStreak > 0 && (
                                        <p className="text-[10px] text-gray-400 mt-0.5">
                                            Kỷ lục: {longestStreak} ngày
                                        </p>
                                    )}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                                    <Flame className="h-5 w-5 text-orange-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        {/* Daily Goal - REAL */}
                        <div className="rounded-2xl bg-white border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-xl bg-cyan-50 flex items-center justify-center">
                                    <Clock className="h-4 w-4 text-cyan-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Mục tiêu hàng ngày
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">{dailyTime} phút</p>
                                </div>
                            </div>
                        </div>

                        {/* Level - REAL */}
                        <div className="rounded-2xl bg-white border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                                    <TrendingUp className="h-4 w-4 text-purple-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Level
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">{level}</p>
                                </div>
                            </div>
                        </div>

                        {/* Joined - REAL */}
                        <div className="rounded-2xl bg-white border border-gray-100 p-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
                                    <Calendar className="h-4 w-4 text-green-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        Tham gia
                                    </p>
                                    <p className="text-lg font-bold text-gray-900">
                                        {daysSinceJoined === 0 ? "Hôm nay" : `${daysSinceJoined} ngày`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Goals & Interests */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                        {/* Learning Goals - REAL */}
                        <div className="rounded-2xl bg-white border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="h-5 w-5 text-blue-500" />
                                <h3 className="text-base font-bold text-gray-900">Mục tiêu học tập</h3>
                            </div>
                            {goals.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {goals.map((goal) => (
                                        <span
                                            key={goal}
                                            className="px-3 py-1.5 rounded-full text-sm font-medium bg-blue-50 text-blue-600 border border-blue-100"
                                        >
                                            {goalLabels[goal.toLowerCase()] || goal}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">
                                    Chưa thiết lập mục tiêu
                                </p>
                            )}
                        </div>

                        {/* Interests - REAL */}
                        <div className="rounded-2xl bg-white border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Play className="h-5 w-5 text-purple-500" />
                                <h3 className="text-base font-bold text-gray-900">Kỹ năng quan tâm</h3>
                            </div>
                            {interests.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {interests.map((interest) => {
                                        const labels: Record<string, string> = {
                                            listening: "Nghe", speaking: "Nói", reading: "Đọc",
                                            writing: "Viết", vocabulary: "Từ vựng", grammar: "Ngữ pháp",
                                        };
                                        return (
                                            <span
                                                key={interest}
                                                className="px-3 py-1.5 rounded-full text-sm font-medium bg-purple-50 text-purple-600 border border-purple-100"
                                            >
                                                {labels[interest.toLowerCase()] || interest}
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">
                                    Chưa chọn kỹ năng quan tâm
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Account Info - REAL */}
                    <div className="rounded-2xl bg-white border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Thông tin tài khoản</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InfoItem label="Email" value={user.email || "—"} />
                            <InfoItem
                                label="Giới tính"
                                value={
                                    profile?.gender === "male" ? "Nam"
                                        : profile?.gender === "female" ? "Nữ"
                                            : profile?.gender === "other" ? "Khác"
                                                : "Chưa cập nhật"
                                }
                            />
                            <InfoItem
                                label="Ngày sinh"
                                value={
                                    profile?.date_of_birth
                                        ? new Date(profile.date_of_birth).toLocaleDateString("vi-VN")
                                        : "Chưa cập nhật"
                                }
                            />
                            <InfoItem
                                label="Vai trò"
                                value={
                                    profile?.role === "student" ? "Học viên"
                                        : profile?.role === "teacher" ? "Giảng viên"
                                            : profile?.role === "admin" ? "Quản trị"
                                                : "Học viên"
                                }
                            />
                            <InfoItem label="Quốc gia" value={profile?.country || "Chưa cập nhật"} />
                            <InfoItem
                                label="Hoạt động gần nhất"
                                value={
                                    lastActiveDate
                                        ? new Date(lastActiveDate).toLocaleDateString("vi-VN")
                                        : "Chưa có"
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="w-full xl:w-[300px] flex-shrink-0 space-y-6">
                    {/* Leaderboard - REAL DATA from Supabase */}
                    <div className="rounded-2xl bg-white border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-gray-900">Bảng xếp hạng</h3>
                        </div>
                        {leaderboard && leaderboard.length > 0 ? (
                            <div className="space-y-3">
                                {leaderboard.map((person, index) => (
                                    <LeaderboardItem
                                        key={person.id}
                                        rank={index + 1}
                                        name={person.full_name || "Ẩn danh"}
                                        points={person.xp || 0}
                                        isYou={person.id === user.id}
                                        isGold={index === 0}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic text-center py-4">
                                Chưa có dữ liệu xếp hạng
                            </p>
                        )}
                        {userRank >= 0 && (
                            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
                                <p className="text-xs text-gray-400">
                                    Thứ hạng của bạn: <span className="font-bold text-blue-600">#{userRank + 1}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats Summary - REAL */}
                    <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 relative overflow-hidden">
                        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
                        <div className="absolute right-4 top-4 w-16 h-16 rounded-full bg-white/5" />

                        <h3 className="text-lg font-bold mb-4 relative">Tóm tắt</h3>

                        <div className="space-y-3 relative">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-100">Tổng XP</span>
                                <span className="text-sm font-bold">{xp.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-100">Streak hiện tại</span>
                                <span className="text-sm font-bold">{streak} ngày</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-100">Streak kỷ lục</span>
                                <span className="text-sm font-bold">{longestStreak} ngày</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-100">Level</span>
                                <span className="text-sm font-bold">{level} - {levelInfo.label}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-blue-100">Mục tiêu/ngày</span>
                                <span className="text-sm font-bold">{dailyTime} phút</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="text-sm font-medium text-gray-900 truncate">{value}</span>
        </div>
    );
}

function LeaderboardItem({
    rank,
    name,
    points,
    isGold = false,
    isYou = false,
}: {
    rank: number;
    name: string;
    points: number;
    isGold?: boolean;
    isYou?: boolean;
}) {
    return (
        <div className={`flex items-center gap-3 p-2 rounded-xl ${isYou ? "bg-blue-50 border border-blue-100" : ""}`}>
            <span className={`w-6 text-sm font-bold text-center ${rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : rank === 3 ? "text-amber-700" : "text-gray-300"}`}>
                {rank}
            </span>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${isYou ? "bg-gradient-to-br from-blue-400 to-blue-600" : "bg-gradient-to-br from-gray-300 to-gray-400"}`}>
                {name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                    {name} {isYou && <span className="text-blue-500">(Bạn)</span>}
                </p>
                <p className="text-xs text-gray-400">{points.toLocaleString()} pts</p>
            </div>
            {isGold && (
                <span className="text-yellow-400 text-lg">🏆</span>
            )}
        </div>
    );
}
