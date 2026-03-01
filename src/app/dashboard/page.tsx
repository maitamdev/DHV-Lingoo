import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";
import {
    Flame,
    Trophy,
    Target,
    Clock,
    BookOpen,
    TrendingUp,
    Star,
    Calendar,
    Sparkles,
} from "lucide-react";

// Map level to color and label
const levelConfig: Record<string, { color: string; label: string; progress: number }> = {
    A1: { color: "from-green-400 to-emerald-500", label: "Người mới bắt đầu", progress: 10 },
    A2: { color: "from-teal-400 to-cyan-500", label: "Sơ cấp", progress: 25 },
    B1: { color: "from-cyan-400 to-blue-500", label: "Trung cấp", progress: 45 },
    B2: { color: "from-blue-400 to-indigo-500", label: "Trung cấp cao", progress: 65 },
    C1: { color: "from-indigo-400 to-purple-500", label: "Cao cấp", progress: 85 },
    C2: { color: "from-purple-400 to-pink-500", label: "Thành thạo", progress: 100 },
};

const goalLabels: Record<string, string> = {
    travel: "Du lịch",
    toeic: "TOEIC",
    ielts: "IELTS",
    business: "Kinh doanh",
    communication: "Giao tiếp",
};

const interestLabels: Record<string, string> = {
    listening: "Nghe",
    speaking: "Nói",
    reading: "Đọc",
    writing: "Viết",
    vocabulary: "Từ vựng",
    grammar: "Ngữ pháp",
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

    // Fetch profile data
    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const displayName = profile?.full_name || user.email?.split("@")[0] || "Học viên";
    const level = profile?.level || "A1";
    const levelInfo = levelConfig[level] || levelConfig.A1;
    const xp = profile?.xp || 0;
    const streak = profile?.streak || 0;
    const longestStreak = profile?.longest_streak || 0;
    const dailyTime = profile?.daily_time || 30;
    const goals = (profile?.goals || []) as string[];
    const interests = (profile?.interests || []) as string[];
    const avatarUrl = profile?.avatar_url;
    const createdAt = profile?.created_at ? new Date(profile.created_at) : new Date();

    // Calculate days since joined
    const daysSinceJoined = Math.floor(
        (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    return (
        <div className="min-h-screen bg-background">
            {/* Background decorations */}
            <div className="fixed inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
            </div>

            {/* Header / Navbar */}
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/dashboard" className="flex items-center gap-2 group">
                            <Image
                                src="/images/logo.png"
                                alt="DHV-Lingoo"
                                width={36}
                                height={36}
                                className="h-9 w-9 rounded-full object-cover drop-shadow-lg group-hover:scale-105 transition-transform"
                            />
                            <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                DHV-Lingoo
                            </span>
                        </Link>

                        <div className="flex items-center gap-3">
                            {/* XP badge in header */}
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                                <Star className="h-3.5 w-3.5 text-amber-400" />
                                <span className="text-xs font-semibold text-amber-400">
                                    {xp.toLocaleString()} XP
                                </span>
                            </div>
                            {/* Streak badge in header */}
                            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20">
                                <Flame className="h-3.5 w-3.5 text-orange-400" />
                                <span className="text-xs font-semibold text-orange-400">
                                    {streak} ngày
                                </span>
                            </div>
                            <SignOutButton />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <section className="mb-8">
                    <div className="flex items-center gap-4 sm:gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${levelInfo.color} p-0.5 shadow-lg`}>
                                <div className="w-full h-full rounded-[14px] sm:rounded-[18px] bg-background flex items-center justify-center overflow-hidden">
                                    {avatarUrl ? (
                                        <Image
                                            src={avatarUrl}
                                            alt={displayName}
                                            width={80}
                                            height={80}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                            {displayName.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                            {/* Level badge */}
                            <div className={`absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-gradient-to-r ${levelInfo.color} text-[10px] font-bold text-white shadow-lg`}>
                                {level}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl sm:text-3xl font-bold">
                                    {getGreeting()},{" "}
                                    <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                        {displayName}
                                    </span>
                                    ! 👋
                                </h1>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground mt-1">
                                {levelInfo.label} • Tham gia {daysSinceJoined === 0 ? "hôm nay" : `${daysSinceJoined} ngày trước`}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats Grid */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {/* XP Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-amber-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-xl bg-amber-500/10">
                                    <Trophy className="h-5 w-5 text-amber-400" />
                                </div>
                                <Sparkles className="h-4 w-4 text-amber-400/50" />
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold">{xp.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground mt-1">Điểm kinh nghiệm</p>
                        </div>
                    </div>

                    {/* Streak Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-orange-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-xl bg-orange-500/10">
                                    <Flame className="h-5 w-5 text-orange-400" />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                    Kỷ lục: {longestStreak}
                                </span>
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold">{streak}</p>
                            <p className="text-xs text-muted-foreground mt-1">Chuỗi ngày học</p>
                        </div>
                    </div>

                    {/* Daily Goal Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-cyan-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-xl bg-cyan-500/10">
                                    <Clock className="h-5 w-5 text-cyan-400" />
                                </div>
                                <Target className="h-4 w-4 text-cyan-400/50" />
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold">{dailyTime}</p>
                            <p className="text-xs text-muted-foreground mt-1">Phút/ngày mục tiêu</p>
                        </div>
                    </div>

                    {/* Level Card */}
                    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-purple-500/30 transition-all duration-300">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="relative">
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2 rounded-xl bg-purple-500/10">
                                    <TrendingUp className="h-5 w-5 text-purple-400" />
                                </div>
                                <BookOpen className="h-4 w-4 text-purple-400/50" />
                            </div>
                            <p className="text-2xl sm:text-3xl font-bold">{level}</p>
                            <p className="text-xs text-muted-foreground mt-1">{levelInfo.label}</p>
                            {/* Level progress bar */}
                            <div className="mt-3 w-full h-1.5 rounded-full bg-muted overflow-hidden">
                                <div
                                    className={`h-full rounded-full bg-gradient-to-r ${levelInfo.color} transition-all duration-1000`}
                                    style={{ width: `${levelInfo.progress}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bottom Section Grid */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Learning Goals */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Target className="h-5 w-5 text-cyan-400" />
                            <h2 className="text-lg font-semibold">Mục tiêu học tập</h2>
                        </div>
                        {goals.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {goals.map((goal) => (
                                    <span
                                        key={goal}
                                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-300"
                                    >
                                        {goalLabels[goal.toLowerCase()] || goal}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Chưa thiết lập mục tiêu. Hãy cập nhật hồ sơ của bạn!
                            </p>
                        )}
                    </div>

                    {/* Learning Interests */}
                    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <BookOpen className="h-5 w-5 text-purple-400" />
                            <h2 className="text-lg font-semibold">Kỹ năng quan tâm</h2>
                        </div>
                        {interests.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {interests.map((interest) => (
                                    <span
                                        key={interest}
                                        className="px-3 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-purple-300"
                                    >
                                        {interestLabels[interest.toLowerCase()] || interest}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground italic">
                                Chưa chọn kỹ năng. Hãy cập nhật hồ sơ của bạn!
                            </p>
                        )}
                    </div>
                </section>

                {/* Profile Info Card */}
                <section className="mt-6">
                    <div className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Calendar className="h-5 w-5 text-blue-400" />
                            <h2 className="text-lg font-semibold">Thông tin tài khoản</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Email</span>
                                <span className="text-sm font-medium truncate">{user.email}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Giới tính</span>
                                <span className="text-sm font-medium">
                                    {profile?.gender === "male"
                                        ? "Nam"
                                        : profile?.gender === "female"
                                            ? "Nữ"
                                            : profile?.gender === "other"
                                                ? "Khác"
                                                : "Chưa cập nhật"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Ngày sinh</span>
                                <span className="text-sm font-medium">
                                    {profile?.date_of_birth
                                        ? new Date(profile.date_of_birth).toLocaleDateString("vi-VN")
                                        : "Chưa cập nhật"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Vai trò</span>
                                <span className="text-sm font-medium capitalize">
                                    {profile?.role === "student"
                                        ? "Học viên"
                                        : profile?.role === "teacher"
                                            ? "Giảng viên"
                                            : profile?.role === "admin"
                                                ? "Quản trị"
                                                : "Học viên"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Quốc gia</span>
                                <span className="text-sm font-medium">
                                    {profile?.country || "Chưa cập nhật"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-muted-foreground">Tham gia từ</span>
                                <span className="text-sm font-medium">
                                    {createdAt.toLocaleDateString("vi-VN")}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Coming Soon Banner */}
                <section className="mt-6 mb-8">
                    <div className="rounded-2xl border border-dashed border-cyan-500/30 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 p-6 text-center">
                        <Sparkles className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold mb-1">Sắp ra mắt!</h3>
                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Bài học tương tác, flashcards, trắc nghiệm và nhiều tính năng hấp dẫn khác đang được phát triển. Hãy quay lại sớm nhé!
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
}
