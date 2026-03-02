"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, GraduationCap, Star, Clock, BookOpen } from "lucide-react";
import Link from "next/link";

// Thumbnail gradient per level (acts as image placeholder)
const levelThumbnails: Record<string, { bg: string; emoji: string; label: string }> = {
    A1: { bg: "from-emerald-400 via-teal-500 to-cyan-600", emoji: "🌱", label: "Vỡ Lòng" },
    A2: { bg: "from-blue-400 via-indigo-500 to-violet-600", emoji: "📖", label: "Sơ Cấp" },
    B1: { bg: "from-violet-400 via-purple-500 to-pink-600", emoji: "💡", label: "Trung Cấp" },
    B2: { bg: "from-orange-400 via-red-500 to-rose-600", emoji: "🔥", label: "Trên Trung Cấp" },
    C1: { bg: "from-pink-400 via-rose-500 to-purple-600", emoji: "⚡", label: "Cao Cấp" },
    C2: { bg: "from-amber-400 via-yellow-500 to-orange-600", emoji: "👑", label: "Thành Thạo" },
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
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm max-w-sm">
                    <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Chưa có khóa học nào.</p>
                </div>
            ) : (
                <div className="flex flex-wrap gap-6">
                    {courses.map(course => {
                        const thumb = levelThumbnails[course.level] || levelThumbnails["A1"];
                        const lessonCount = lessonCounts[course.id] || 0;
                        const totalXP = lessonCount * 50;
                        const estimatedHours = Math.max(1, Math.round(lessonCount * 0.5));

                        return (
                            <Link
                                key={course.id}
                                href={`/dashboard/courses/${course.id}`}
                                className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 w-full sm:w-72"
                            >
                                {/* Thumbnail */}
                                <div className={`relative h-40 bg-gradient-to-br ${thumb.bg} flex items-center justify-center overflow-hidden`}>
                                    {/* Decorative blobs */}
                                    <div className="absolute -top-6 -right-6 w-28 h-28 bg-white/15 rounded-full blur-sm" />
                                    <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-black/10 rounded-full blur-sm" />
                                    {/* Level badge */}
                                    <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full border border-white/30 uppercase tracking-wide">
                                        {thumb.label}
                                    </span>
                                    {/* Big emoji center */}
                                    <span className="text-6xl drop-shadow-lg">{thumb.emoji}</span>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-heading font-bold text-gray-900 text-base leading-snug mb-1.5 group-hover:text-indigo-700 transition line-clamp-2">
                                        {course.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
                                        {course.description}
                                    </p>
                                </div>

                                {/* Stats bar */}
                                <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-50 pt-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <BookOpen className="w-3.5 h-3.5" />
                                            {lessonCount} bài
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            {estimatedHours}h
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                        {totalXP} XP
                                    </span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
