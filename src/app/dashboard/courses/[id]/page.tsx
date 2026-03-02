"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, BookOpen, Star, Clock, Users, Award, ChevronRight, Play, TrendingUp, Target } from "lucide-react";
import Link from "next/link";

const levelColors: Record<string, { gradient: string; text: string; bg: string; badge: string }> = {
    A1: { gradient: "from-emerald-500 to-teal-600", text: "text-emerald-600", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
    A2: { gradient: "from-blue-500 to-indigo-600", text: "text-blue-600", bg: "bg-blue-50", badge: "bg-blue-100 text-blue-700" },
    B1: { gradient: "from-violet-500 to-purple-600", text: "text-violet-600", bg: "bg-violet-50", badge: "bg-violet-100 text-violet-700" },
    B2: { gradient: "from-orange-500 to-red-600", text: "text-orange-600", bg: "bg-orange-50", badge: "bg-orange-100 text-orange-700" },
    C1: { gradient: "from-pink-500 to-rose-600", text: "text-pink-600", bg: "bg-pink-50", badge: "bg-pink-100 text-pink-700" },
    C2: { gradient: "from-amber-500 to-yellow-600", text: "text-amber-600", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" },
};

const levelLabel: Record<string, string> = {
    A1: "Cơ Bản", A2: "Sơ Cấp", B1: "Trung Cấp", B2: "Trên Trung Cấp", C1: "Cao Cấp", C2: "Thành Thạo"
};

export default function CourseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();

    const [course, setCourse] = useState<any>(null);
    const [lessons, setLessons] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) fetchCourseData(params.id as string);
    }, [params.id]);

    async function fetchCourseData(courseId: string) {
        setLoading(true);
        const [courseRes, lessonsRes] = await Promise.all([
            supabase.from("courses").select("*").eq("id", courseId).single(),
            supabase.from("lessons").select("id, title, description, order_index, xp_reward, topics").eq("course_id", courseId).order("order_index"),
        ]);

        if (courseRes.data) setCourse(courseRes.data);
        if (lessonsRes.data) setLessons(lessonsRes.data);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải khóa học...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-20">
                <p className="text-gray-500 mb-4">Không tìm thấy khóa học này.</p>
                <Link href="/dashboard/courses" className="text-indigo-600 hover:underline">Quay lại</Link>
            </div>
        );
    }

    const colors = levelColors[course.level] || levelColors["A1"];
    const totalXP = lessons.reduce((sum, l) => sum + (l.xp_reward || 50), 0);
    const estimatedHours = Math.max(1, Math.round(lessons.length * 0.5));

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ===== HERO ===== */}
            <div className={`relative bg-gradient-to-br ${colors.gradient} overflow-hidden`}>
                {course.thumbnail_url && (
                    <img src={course.thumbnail_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 lg:px-8">
                    {/* Breadcrumb */}
                    <button onClick={() => router.push("/dashboard/courses")} className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition text-sm group">
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" /> Quay lại Thư viện
                    </button>

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                                    Level {course.level}
                                </span>
                                <span className="px-3 py-1 bg-white/10 backdrop-blur-sm text-white/80 text-xs font-medium rounded-full">
                                    {levelLabel[course.level] || "Cơ Bản"}
                                </span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-extrabold text-white mb-4 leading-tight">
                                {course.title}
                            </h1>
                            <p className="text-white/80 text-lg leading-relaxed">
                                {course.description}
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex items-center gap-5 text-white/90 flex-shrink-0">
                            <div className="text-center">
                                <p className="text-2xl font-bold">{lessons.length}</p>
                                <p className="text-xs text-white/60 mt-0.5">Bài học</p>
                            </div>
                            <div className="w-px h-10 bg-white/20" />
                            <div className="text-center">
                                <p className="text-2xl font-bold">{totalXP}</p>
                                <p className="text-xs text-white/60 mt-0.5">Tổng XP</p>
                            </div>
                            <div className="w-px h-10 bg-white/20" />
                            <div className="text-center">
                                <p className="text-2xl font-bold">~{estimatedHours}h</p>
                                <p className="text-xs text-white/60 mt-0.5">Thời lượng</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== CONTENT ===== */}
            <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left: Lesson List */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-heading font-bold text-gray-900 flex items-center gap-2">
                                <BookOpen className="w-5 h-5 text-indigo-500" />
                                Nội dung khóa học
                            </h2>
                            <span className="text-sm text-gray-400">{lessons.length} bài</span>
                        </div>

                        {lessons.length === 0 ? (
                            <div className="bg-white border border-gray-200 p-10 text-center">
                                <p className="text-gray-400">Khóa học này chưa có bài học nào.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {lessons.map((lesson, index) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/dashboard/courses/lessons/${lesson.id}`}
                                        className="flex items-center gap-4 bg-white border border-gray-200 hover:border-indigo-300 hover:shadow-md px-5 py-4 transition-all duration-300 group"
                                    >
                                        {/* Number */}
                                        <div className={`w-11 h-11 flex-shrink-0 bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                                            {String(index + 1).padStart(2, "0")}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition text-[15px] truncate">
                                                {lesson.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                {lesson.topics?.slice(0, 3).map((topic: string, ti: number) => (
                                                    <span key={ti} className="text-[11px] text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5">
                                                        {topic}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Right side */}
                                        <div className="flex items-center gap-3 flex-shrink-0">
                                            <div className="hidden sm:flex items-center gap-1 text-amber-500">
                                                <Star className="w-3.5 h-3.5 fill-amber-400" />
                                                <span className="text-xs font-bold">+{lesson.xp_reward || 50}</span>
                                            </div>
                                            <div className="w-9 h-9 bg-gray-100 group-hover:bg-indigo-600 flex items-center justify-center text-gray-400 group-hover:text-white transition-all rounded-full">
                                                <Play className="w-4 h-4 ml-0.5" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Sidebar */}
                    <div className="lg:w-[320px] flex-shrink-0 space-y-5">
                        {/* Start Learning Card */}
                        <div className="bg-white border border-gray-200 overflow-hidden">
                            <div className={`bg-gradient-to-br ${colors.gradient} px-6 py-5 text-center`}>
                                <p className="text-white font-bold text-lg">Bắt đầu học ngay!</p>
                                <p className="text-white/70 text-sm mt-1">Miễn phí • Không giới hạn</p>
                            </div>
                            <div className="p-5">
                                {lessons.length > 0 ? (
                                    <Link href={`/dashboard/courses/lessons/${lessons[0].id}`}
                                        className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${colors.gradient} text-white font-bold py-3.5 hover:opacity-90 transition text-sm`}
                                    >
                                        <Play className="w-4 h-4" /> Bắt đầu Bài 1
                                    </Link>
                                ) : (
                                    <button disabled className="w-full py-3.5 bg-gray-100 text-gray-400 font-medium text-sm">
                                        Chưa có bài học
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Course Info */}
                        <div className="bg-white border border-gray-200 p-5 space-y-4">
                            <h3 className="font-bold text-gray-900 text-sm">Thông tin khóa học</h3>
                            <div className="space-y-3">
                                <InfoRow icon={<Target className="w-4 h-4" />} label="Trình độ" value={`${course.level} — ${levelLabel[course.level]}`} />
                                <InfoRow icon={<BookOpen className="w-4 h-4" />} label="Số bài học" value={`${lessons.length} bài`} />
                                <InfoRow icon={<Clock className="w-4 h-4" />} label="Thời lượng" value={`~${estimatedHours} giờ`} />
                                <InfoRow icon={<Award className="w-4 h-4" />} label="Tổng XP" value={`${totalXP} XP`} />
                                <InfoRow icon={<TrendingUp className="w-4 h-4" />} label="Tiến độ" value="0%" />
                            </div>
                        </div>

                        {/* What you'll learn */}
                        <div className="bg-white border border-gray-200 p-5">
                            <h3 className="font-bold text-gray-900 text-sm mb-3">Bạn sẽ học được gì?</h3>
                            <ul className="space-y-2.5">
                                {lessons.slice(0, 5).map((lesson, i) => (
                                    <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600">
                                        <span className={`w-5 h-5 flex-shrink-0 flex items-center justify-center text-[10px] font-bold ${colors.badge} mt-0.5`}>✓</span>
                                        {lesson.title}
                                    </li>
                                ))}
                                {lessons.length > 5 && (
                                    <li className="text-sm text-gray-400 pl-7">
                                        + {lessons.length - 5} bài nữa...
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2 text-gray-400">
                {icon}
                <span className="text-sm">{label}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800">{value}</span>
        </div>
    );
}
