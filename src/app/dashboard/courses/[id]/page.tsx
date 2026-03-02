"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { Loader2, ArrowLeft, BookOpen, Star, Lock, CheckCircle } from "lucide-react";
import Link from "next/link";

const levelColors: Record<string, { gradient: string; text: string }> = {
    A1: { gradient: "from-emerald-500 to-teal-600", text: "text-emerald-600" },
    A2: { gradient: "from-blue-500 to-indigo-600", text: "text-blue-600" },
    B1: { gradient: "from-violet-500 to-purple-600", text: "text-violet-600" },
    B2: { gradient: "from-orange-500 to-red-600", text: "text-orange-600" },
    C1: { gradient: "from-pink-500 to-rose-600", text: "text-pink-600" },
    C2: { gradient: "from-amber-500 to-yellow-600", text: "text-amber-600" },
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

    return (
        <div className="min-h-screen">
            {/* Hero Header */}
            <div className={`bg-gradient-to-br ${colors.gradient} px-6 py-10 lg:px-12 relative overflow-hidden`}>
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-sm"></div>
                <div className="absolute -bottom-8 left-20 w-28 h-28 bg-white/10 rounded-full blur-sm"></div>

                <div className="max-w-4xl mx-auto relative z-10">
                    <button onClick={() => router.push("/dashboard/courses")} className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition text-sm">
                        <ArrowLeft className="w-4 h-4" /> Quay lại Thư viện
                    </button>
                    <span className="inline-block px-3 py-1 bg-white/20 text-white text-xs font-bold rounded-full mb-4">
                        Level {course.level}
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-3">
                        {course.title}
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl">
                        {course.description}
                    </p>
                    <div className="flex items-center gap-6 mt-6 text-white/70 text-sm">
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" /> {lessons.length} bài học
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {lessons.reduce((sum, l) => sum + (l.xp_reward || 50), 0)} XP
                        </span>
                    </div>
                </div>
            </div>

            {/* Lesson List */}
            <div className="max-w-4xl mx-auto px-4 py-10 lg:px-0">
                <h2 className="text-xl font-heading font-bold text-gray-900 mb-6">Danh sách bài học</h2>

                {lessons.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                        <p className="text-gray-400">Khóa học này chưa có bài học nào.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {lessons.map((lesson, index) => (
                            <Link
                                key={lesson.id}
                                href={`/dashboard/courses/lessons/${lesson.id}`}
                                className="flex items-center gap-5 bg-white rounded-2xl border border-gray-100 px-6 py-5 hover:border-indigo-200 hover:shadow-md transition-all duration-300 group"
                            >
                                {/* Lesson Number */}
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm`}>
                                    {index + 1}
                                </div>

                                {/* Lesson Info */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition truncate">
                                        {lesson.title}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        {lesson.topics?.map((topic: string, ti: number) => (
                                            <span key={ti} className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                                                {topic}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* XP + Arrow */}
                                <div className="flex items-center gap-4 flex-shrink-0">
                                    <span className="text-sm font-bold text-amber-500 hidden sm:block">
                                        +{lesson.xp_reward} XP
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
