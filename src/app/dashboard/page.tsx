import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
    Flame,
    Trophy,
    Bell,
    ChevronRight,
    BookOpen,
    Play,
} from "lucide-react";

const goalLabels: Record<string, string> = {
    travel: "Du lịch",
    toeic: "TOEIC",
    ielts: "IELTS",
    business: "Kinh doanh",
    communication: "Giao tiếp",
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

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const displayName = profile?.full_name || user.email?.split("@")[0] || "Học viên";
    const level = profile?.level || "A1";
    const xp = profile?.xp || 0;
    const streak = profile?.streak || 0;
    const dailyTime = profile?.daily_time || 30;
    const goals = (profile?.goals || []) as string[];

    // Simulated weekly activity data (will be replaced with real data later)
    const weeklyData = [
        { day: "T2", value: 25, max: 60 },
        { day: "T3", value: 40, max: 60 },
        { day: "T4", value: 35, max: 60 },
        { day: "T5", value: 50, max: 60 },
        { day: "T6", value: 45, max: 60 },
        { day: "T7", value: 30, max: 60 },
        { day: "CN", value: 20, max: 60 },
    ];

    // Daily goal progress (simulated based on profile data)
    const dailyProgress = 75;

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
                                Tiến trình của bạn rất ấn tượng. Tiếp tục học nào!
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Streak Badge */}
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-orange-50 border border-orange-100">
                                <Flame className="h-4 w-4 text-orange-500" />
                                <span className="text-sm font-bold text-orange-600">
                                    {streak} Ngày
                                </span>
                            </div>
                            {/* Bell */}
                            <button className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                <Bell className="h-4 w-4" />
                            </button>
                            {/* Start Lesson */}
                            <button className="px-5 py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/25">
                                Bắt đầu học
                            </button>
                        </div>
                    </div>

                    {/* Course Card + Stats Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        {/* Active Course Card */}
                        <div className="lg:col-span-2 rounded-2xl bg-gray-900 text-white p-6 relative overflow-hidden">
                            {/* Decorative circles */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500/10" />
                            <div className="absolute -right-5 bottom-0 w-24 h-24 rounded-full bg-blue-500/5" />

                            <div className="relative">
                                <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wider mb-4">
                                    Khóa học đang học
                                </span>
                                <h2 className="text-xl sm:text-2xl font-bold mb-1 leading-tight">
                                    {goals.length > 0
                                        ? `Tiếng Anh ${goalLabels[goals[0]?.toLowerCase()] || goals[0]}`
                                        : "Tiếng Anh Giao Tiếp"}
                                </h2>
                                <p className="text-blue-200/60 text-sm mb-6">
                                    Nền tảng & Kỹ năng cơ bản
                                </p>

                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">
                                            Trình độ hiện tại: <span className="text-white font-medium">{level}</span>
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-32 h-1.5 rounded-full bg-white/10 overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-blue-500 transition-all"
                                                    style={{ width: "35%" }}
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400">35%</span>
                                        </div>
                                    </div>
                                    <button className="px-5 py-2 rounded-xl bg-white text-gray-900 text-sm font-semibold hover:bg-gray-100 transition-colors">
                                        Tiếp tục
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Column */}
                        <div className="flex flex-col gap-4">
                            {/* Total Points */}
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

                            {/* Words Mastered */}
                            <div className="flex-1 rounded-2xl bg-white border border-gray-100 p-5 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                        Từ đã thuộc
                                    </p>
                                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                                        0
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                                    <BookOpen className="h-5 w-5 text-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Weekly Activity + Daily Goal Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                        {/* Weekly Activity */}
                        <div className="lg:col-span-2 rounded-2xl bg-white border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-base font-bold text-gray-900">Hoạt động tuần</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">Phút học mỗi ngày</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    <span className="text-xs text-gray-400 font-medium">Đã học</span>
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="flex items-end justify-between gap-2 sm:gap-4 h-40 px-2">
                                {weeklyData.map((item) => (
                                    <div key={item.day} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full max-w-[40px] relative flex items-end h-28">
                                            {/* Background bar */}
                                            <div className="absolute inset-0 rounded-lg bg-blue-50" />
                                            {/* Value bar */}
                                            <div
                                                className="relative w-full rounded-lg bg-gradient-to-t from-blue-600 to-blue-400 transition-all duration-700"
                                                style={{ height: `${(item.value / item.max) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Daily Goal */}
                        <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
                            <div className="absolute right-4 top-4 w-16 h-16 rounded-full bg-white/5" />

                            <h3 className="text-lg font-bold mb-1 relative">Mục tiêu</h3>
                            <p className="text-xs text-blue-100 mb-4 relative">hàng ngày</p>

                            {/* Circular Progress */}
                            <div className="relative w-24 h-24 mb-4">
                                <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.15)"
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="50"
                                        cy="50"
                                        r="42"
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${2 * Math.PI * 42}`}
                                        strokeDashoffset={`${2 * Math.PI * 42 * (1 - dailyProgress / 100)}`}
                                        className="transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-xl font-bold">{dailyProgress}%</span>
                                </div>
                            </div>

                            <p className="text-xs text-blue-100 text-center relative max-w-[140px]">
                                Còn {Math.round(dailyTime * (1 - dailyProgress / 100))} phút nữa để đạt mục tiêu {dailyTime} phút!
                            </p>
                        </div>
                    </div>

                    {/* Scheduled Reviews */}
                    <div className="rounded-2xl bg-white border border-gray-100 p-6">
                        <h3 className="text-base font-bold text-gray-900 mb-4">Ôn tập đã lên lịch</h3>
                        <div className="space-y-3">
                            <ReviewItem
                                tag="Q1"
                                tagColor="bg-blue-50 text-blue-600"
                                title="Thành ngữ thông dụng"
                                subtitle="Bắt đầu trong 2 giờ"
                            />
                            <ReviewItem
                                tag="Q2"
                                tagColor="bg-purple-50 text-purple-600"
                                title="Từ vựng hàng ngày"
                                subtitle="Bắt đầu trong 5 giờ"
                            />
                            <ReviewItem
                                tag="Q3"
                                tagColor="bg-green-50 text-green-600"
                                title="Ngữ pháp cơ bản"
                                subtitle="Ngày mai lúc 9:00"
                            />
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="w-full xl:w-[300px] flex-shrink-0 space-y-6">
                    {/* Leaderboard */}
                    <div className="rounded-2xl bg-white border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-base font-bold text-gray-900">Bảng xếp hạng</h3>
                            <button className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors">
                                Xem tất cả
                            </button>
                        </div>
                        <div className="space-y-4">
                            <LeaderboardItem rank={1} name="Minh Anh" points={14200} isGold />
                            <LeaderboardItem rank={2} name="Hoàng Long" points={13850} />
                            <LeaderboardItem
                                rank={3}
                                name={displayName}
                                points={xp}
                                isYou
                            />
                        </div>
                    </div>

                    {/* Weekly Challenge */}
                    <div className="rounded-2xl bg-gray-900 text-white p-6 relative overflow-hidden">
                        <div className="absolute right-4 top-4 opacity-20">
                            <Trophy className="h-12 w-12" />
                        </div>

                        <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                            Thử thách tuần
                        </span>
                        <h3 className="text-lg font-bold mb-2">Chinh phục từ vựng</h3>
                        <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                            Học 50 từ vựng mới trong tuần này để nhận huy hiệu &ldquo;Bậc thầy từ vựng&rdquo;.
                        </p>
                        <button className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-semibold hover:bg-blue-600 transition-colors">
                            Tham gia ngay
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ReviewItem({
    tag,
    tagColor,
    title,
    subtitle,
}: {
    tag: string;
    tagColor: string;
    title: string;
    subtitle: string;
}) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold ${tagColor}`}>
                {tag}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{title}</p>
                <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
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
            <span className={`w-6 text-sm font-bold text-center ${rank === 1 ? "text-yellow-500" : rank === 2 ? "text-gray-400" : "text-blue-500"}`}>
                {rank}
            </span>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                    {name} {isYou && <span className="text-blue-500">(Bạn)</span>}
                </p>
                <p className="text-xs text-gray-400">{points.toLocaleString()} pts</p>
            </div>
            {isGold && (
                <div className="text-yellow-400">
                    <Play className="h-4 w-4 fill-current" />
                </div>
            )}
        </div>
    );
}
