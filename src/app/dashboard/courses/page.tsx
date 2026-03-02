"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import Link from "next/link";

const levelColors: Record<string, { gradient: string; badge: string; glow: string }> = {
    A1: { gradient: "from-emerald-500 to-teal-600", badge: "bg-emerald-400/20 text-emerald-100", glow: "shadow-emerald-500/20" },
    A2: { gradient: "from-blue-500 to-indigo-600", badge: "bg-blue-400/20 text-blue-100", glow: "shadow-blue-500/20" },
    B1: { gradient: "from-violet-500 to-purple-600", badge: "bg-violet-400/20 text-violet-100", glow: "shadow-violet-500/20" },
    B2: { gradient: "from-orange-500 to-red-600", badge: "bg-orange-400/20 text-orange-100", glow: "shadow-orange-500/20" },
    C1: { gradient: "from-pink-500 to-rose-600", badge: "bg-pink-400/20 text-pink-100", glow: "shadow-pink-500/20" },
    C2: { gradient: "from-amber-500 to-yellow-600", badge: "bg-amber-400/20 text-amber-100", glow: "shadow-amber-500/20" },
};

const levelEmojis: Record<string, string> = {
    A1: "🌱", A2: "🌿", B1: "🌳", B2: "🔥", C1: "⚡", C2: "👑",
};

export default function CoursesPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: coursesData } = await supabase
                    .from("courses")
                    .select("*")
                    .order("created_at", { ascending: true });

                const { data: lessonsData } = await supabase
                    .from("lessons")
                    .select("id, course_id");

                if (coursesData) setCourses(coursesData);
                if (lessonsData) {
                    const counts: Record<string, number> = {};
                    lessonsData.forEach(l => {
                        counts[l.course_id] = (counts[l.course_id] || 0) + 1;
                    });
                    setLessonCounts(counts);
                }
            } catch (err) {
                console.error("Error fetching courses:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải khóa học...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-3">
                    📚 Thư Viện Khóa Học
                </h1>
                <p className="text-gray-500 max-w-2xl">
                    Chọn khóa học phù hợp với trình độ của bạn để bắt đầu hành trình chinh phục tiếng Anh.
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm max-w-3xl mx-auto">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Chưa có khóa học nào được tạo.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map(course => {
                        const colors = levelColors[course.level] || levelColors["A1"];
                        const emoji = levelEmojis[course.level] || "📘";
                        const count = lessonCounts[course.id] || 0;

                        return (
                            <Link
                                key={course.id}
                                href={`/dashboard/courses/${course.id}`}
                                className={`group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl ${colors.glow} transition-all duration-300 hover:-translate-y-2`}
                            >
                                {/* Gradient Header */}
                                <div className={`bg-gradient-to-br ${colors.gradient} px-6 py-8 relative overflow-hidden`}>
                                    {/* Decorative circles */}
                                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
                                    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full"></div>

                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${colors.badge} mb-4`}>
                                        {emoji} Level {course.level}
                                    </span>
                                    <h3 className="text-xl font-heading font-bold text-white leading-tight">
                                        {course.title}
                                    </h3>
                                </div>

                                {/* Body */}
                                <div className="px-6 py-5">
                                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 min-h-[40px]">
                                        {course.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1.5 text-sm text-gray-400">
                                            <BookOpen className="w-4 h-4" />
                                            <span className="font-medium">{count} bài học</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm font-bold text-indigo-600 group-hover:gap-2 transition-all duration-300">
                                            Xem khóa học <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
