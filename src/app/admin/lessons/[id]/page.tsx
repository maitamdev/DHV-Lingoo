"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, BookOpen, Star, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLessonViewerPage() {
    const params = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [lesson, setLesson] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchLesson(params.id as string);
        }
    }, [params.id]);

    async function fetchLesson(id: string) {
        setLoading(true);
        const { data, error } = await supabase
            .from("lessons")
            .select("*, courses(title, level)")
            .eq("id", id)
            .single();

        if (data) setLesson(data);
        if (error) console.error("Error fetching lesson:", error);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-slate-500">Đang tải nội dung bài học...</p>
            </div>
        );
    }

    if (!lesson) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-500 mb-4">Không tìm thấy bài học này.</p>
                <Link href="/admin/lessons" className="text-indigo-600 hover:underline">
                    Quay lại danh sách
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto pb-20">
            {/* Header / Nav */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>

            {/* Lesson Info Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                        {lesson.courses?.level || "A1"}
                    </span>
                    <span className="text-sm font-medium text-slate-500 flex items-center gap-1">
                        <BookOpen className="w-4 h-4" /> {lesson.courses?.title}
                    </span>
                </div>

                <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4 leading-tight">
                    {lesson.title}
                </h1>

                <p className="text-lg text-slate-600 mb-6">
                    {lesson.description}
                </p>

                <div className="flex items-center gap-6 pt-6 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg font-bold text-sm">
                        <Star className="w-4 h-4 fill-amber-500" />
                        +{lesson.xp_reward || 50} XP
                    </div>
                    {lesson.topics && lesson.topics.length > 0 && (
                        <div className="flex gap-2">
                            {lesson.topics.map((topic: string, i: number) => (
                                <span key={i} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                    {topic}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Lesson Content Render */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
                {/* 
                  Sử dụng dangerouslySetInnerHTML để rander HTML được lưu từ Admin.
                  Code HTML đã được bao bọc cẩn thận với Tailwind Typography (prose) để hiển thị đẹp mặc định.
                */}
                <div
                    className="prose prose-indigo max-w-none prose-headings:font-heading prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-indigo-600 hover:prose-a:text-indigo-500"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                />
            </div>

            {/* Simulated Action (For Admin View) */}
            <div className="mt-12 flex justify-center">
                <button className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-1 transition-all">
                    <CheckCircle className="w-6 h-6" />
                    Hoàn Thành Bài Học
                </button>
            </div>
            <p className="text-center text-sm text-slate-400 mt-4">
                (Giao diện học viên cũng sẽ hiển thị y hệt như trang này)
            </p>
        </div>
    );
}
