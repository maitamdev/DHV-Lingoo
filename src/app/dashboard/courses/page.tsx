"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);

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
                    .select("id, title, description, course_id, order_index, xp_reward, topics")
                    .order("order_index", { ascending: true });

                if (coursesData) setCourses(coursesData);
                if (lessonsData) setLessons(lessonsData);
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
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-3">
                    📚 Thư Viện Khóa Học
                </h1>
                <p className="text-gray-500 max-w-2xl">
                    Tất cả khóa học trong hệ thống — bấm vào bài học bất kỳ để bắt đầu học ngay.
                </p>
            </div>

            {courses.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm max-w-3xl mx-auto">
                    <p className="text-gray-500 text-lg">Chưa có khóa học nào được tạo.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {courses.map(course => {
                        const courseLessons = lessons.filter(l => l.course_id === course.id);
                        return (
                            <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white">
                                    <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{course.level}</span>
                                    <h3 className="text-xl font-heading font-bold mt-2">{course.title}</h3>
                                    <p className="text-blue-100 text-sm mt-1 opacity-90">{course.description}</p>
                                    <p className="text-blue-200 text-xs mt-2">{courseLessons.length} bài học</p>
                                </div>
                                <div className="divide-y divide-gray-50">
                                    {courseLessons.length === 0 ? (
                                        <p className="p-6 text-gray-400 text-sm">Khóa học này chưa có bài học nào.</p>
                                    ) : courseLessons.map((lesson, li) => (
                                        <Link
                                            key={lesson.id}
                                            href={`/dashboard/courses/lessons/${lesson.id}`}
                                            className="flex items-center justify-between px-6 py-4 hover:bg-indigo-50 transition-all duration-200 group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600 flex-shrink-0">
                                                    {li + 1}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900 group-hover:text-indigo-700 transition">{lesson.title}</p>
                                                    <p className="text-xs text-gray-400 mt-0.5">
                                                        {lesson.topics?.join(", ")} • ⭐ {lesson.xp_reward} XP
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition opacity-0 group-hover:opacity-100">
                                                Vào Học <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
