// Courses page - browse and enroll in language courses
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Search, SlidersHorizontal, Star, Clock, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Tất cả", "Giao tiếp", "Ngữ pháp", "Từ vựng", "IELTS / TOEIC", "Phát âm", "Trẻ em"];

const levelConfig: Record<string, { bg: string; emoji: string; tag: string; stars: number }> = {
    A1: { bg: "from-emerald-400 to-teal-600", emoji: "🌱", tag: "Cơ Bản", stars: 4.8 },
    A2: { bg: "from-blue-400 to-indigo-600", emoji: "📖", tag: "Sơ Cấp", stars: 4.7 },
    B1: { bg: "from-violet-400 to-purple-600", emoji: "💡", tag: "Trung Cấp", stars: 4.9 },
    B2: { bg: "from-orange-400 to-red-600", emoji: "🔥", tag: "Trên TC", stars: 4.6 },
    C1: { bg: "from-pink-400 to-rose-600", emoji: "⚡", tag: "Cao Cấp", stars: 4.8 },
    C2: { bg: "from-amber-400 to-yellow-600", emoji: "👑", tag: "Thành Thạo", stars: 5.0 },
};

export default function CoursesPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [courses, setCourses] = useState<any[]>([]);
    const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({});
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("Tất cả");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [{ data: coursesData }, { data: lessonsData }] = await Promise.all([
                supabase.from("courses").select("*").order("created_at", { ascending: true }),
                supabase.from("lessons").select("id, course_id"),
            ]);
            if (coursesData) setCourses(coursesData);
            if (lessonsData) {
                const counts: Record<string, number> = {};
                lessonsData.forEach(l => { counts[l.course_id] = (counts[l.course_id] || 0) + 1; });
                setLessonCounts(counts);
            }
            setLoading(false);
        };
        fetchData();
    }, []);

    const filtered = useMemo(() => {
        return courses.filter(c => {
            const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
                c.description?.toLowerCase().includes(search.toLowerCase());
            return matchSearch;
        });
    }, [courses, search]);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Header */}
            <div className="text-center pt-14 pb-10 px-6 border-b border-gray-100">
                <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-3 tracking-tight">
                    Explore Courses
                </h1>
                <p className="text-gray-400 text-base mb-8">
                    Discover premium language courses designed for fluency.
                </p>

                {/* Search Bar */}
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    <div className="flex-1 flex items-center gap-3 bg-gray-50 border border-gray-200 px-4 py-3 hover:border-gray-300 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all shadow-sm">
                        <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input
                            type="text"
                            placeholder="Search for courses, topics, or skills"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
                        />
                    </div>
                    <button className="p-3 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition text-gray-500 shadow-sm flex-shrink-0">
                        <SlidersHorizontal className="w-4 h-4" />
                    </button>
                </div>

                {/* Category Pills */}
                <div className="flex items-center justify-center gap-2 flex-wrap mt-6">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 py-1.5 text-sm font-medium transition-all duration-200 ${activeCategory === cat
                                ? "bg-gray-900 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Cards */}
            <div className="max-w-[1200px] mx-auto px-6 py-10">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-3" />
                        <p className="text-gray-400 text-sm">Đang tải khóa học...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">Không tìm thấy khóa học nào.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-400">
                                Hiển thị <span className="font-semibold text-gray-700">{filtered.length}</span> khóa học
                            </p>
                            <button className="text-sm text-gray-400 hover:text-gray-700 flex items-center gap-1 transition">
                                Sắp xếp <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filtered.map(course => {
                                const cfg = levelConfig[course.level] || levelConfig["A1"];
                                const count = lessonCounts[course.id] || 0;
                                const hours = Math.max(1, Math.round(count * 0.5));

                                return (
                                    <Link
                                        key={course.id}
                                        href={`/dashboard/courses/${course.id}`}
                                        className="group bg-white border border-gray-200 overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-1"
                                    >
                                        {/* Thumbnail */}
                                        <div className={`relative h-44 bg-gradient-to-br ${cfg.bg} flex items-center justify-center overflow-hidden`}>
                                            {course.thumbnail_url ? (
                                                <img src={course.thumbnail_url} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 opacity-20"
                                                        style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)" }} />
                                                    <span className="text-7xl drop-shadow-xl">{cfg.emoji}</span>
                                                </>
                                            )}
                                            {/* Top badges */}
                                            <span className="absolute top-3 left-3 text-[10px] font-bold bg-black/30 backdrop-blur-sm text-white px-2 py-0.5 uppercase tracking-widest">
                                                {cfg.tag}
                                            </span>
                                            <span className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/40 transition cursor-pointer">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                            </span>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-4">
                                            <h3 className="font-heading font-bold text-gray-900 text-sm leading-snug mb-1.5 group-hover:text-indigo-700 transition line-clamp-2">
                                                {course.title}
                                            </h3>
                                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mb-4">
                                                {course.description}
                                            </p>

                                            {/* Stars */}
                                            <div className="flex items-center gap-1.5 mb-3">
                                                <span className="text-xs font-bold text-amber-600">{cfg.stars}</span>
                                                <div className="flex">
                                                    {[1, 2, 3, 4, 5].map(s => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= Math.floor(cfg.stars) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-gray-400">({(count * 12) + 8})</span>
                                            </div>

                                            {/* Bottom Stats */}
                                            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                                <div className="flex items-center gap-3 text-xs text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <BookOpen className="w-3.5 h-3.5" /> {count} bài
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" /> {hours}h
                                                    </span>
                                                </div>
                                                <span className="text-sm font-extrabold text-indigo-600">
                                                    Miễn phí
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
