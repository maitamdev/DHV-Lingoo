"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Flame, Star, Clock, Target, Loader2, Sparkles, BookOpen, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";


// Interface for the Roadmap JSON from Groq
interface RoadmapDay {
    day_number: number;
    topic: string;
    tasks: string[];
}

interface RoadmapWeek {
    week_number: number;
    focus: string;
    days: RoadmapDay[];
}

interface RoadmapData {
    title: string;
    description: string;
    weeks: RoadmapWeek[];
}

export default function CoursesPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
    const [profile, setProfile] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [lessons, setLessons] = useState<any[]>([]);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profileData, error } = await supabase
                    .from("profiles")
                    .select("full_name, level, goals, ai_roadmap")
                    .eq("id", user.id)
                    .single();

                if (error) throw error;

                setProfile(profileData);

                if (profileData.ai_roadmap && Object.keys(profileData.ai_roadmap).length > 0) {
                    setRoadmap(profileData.ai_roadmap as unknown as RoadmapData);
                }

                // Fetch courses and their lessons
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
                console.error("Error fetching user data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const generateRoadmap = async () => {
        setGenerating(true);
        try {
            const response = await fetch("/api/generate-roadmap", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                console.error("API Error Response:", errorData);
                throw new Error(errorData?.error || "Failed to generate roadmap");
            }

            const data = await response.json();
            setRoadmap(data.roadmap as RoadmapData);

            // Re-fetch profile to update local state if needed
            setProfile((prev: any) => ({ ...prev, ai_roadmap: data.roadmap }));

        } catch (err: any) {
            console.error(err);
            alert(`Lỗi: ${err.message || 'Có lỗi xảy ra khi tạo lộ trình. Vui lòng thử lại sau.'}`);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải dữ liệu học tập...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">
            {/* Header Section */}
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-3">
                    Lộ Trình Của Bạn
                </h1>
                <p className="text-gray-500 max-w-2xl">
                    Chào {profile?.full_name?.split(" ")[0] || "bạn"}, dựa trên trình độ {profile?.level || "A1"} và mục tiêu học tập, đây là lộ trình được cá nhân hóa dành riêng cho bạn.
                </p>
            </div>

            {!roadmap ? (
                /* Empty State / Generate Button */
                <div className="bg-white rounded-none border border-gray-100 p-8 sm:p-12 text-center shadow-sm max-w-3xl mx-auto mt-10">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="h-10 w-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">
                        Tạo Lộ Trình Học Cá Nhân Hóa (AI)
                    </h2>
                    <p className="text-gray-600 mb-8 mx-auto max-w-lg leading-relaxed">
                        Hệ thống AI của chúng tôi sẽ phân tích trình độ và mục tiêu của bạn để xây dựng một lộ trình học 4 tuần tối ưu nhất, giúp bạn học nhanh và hiệu quả hơn.
                    </p>
                    <button
                        onClick={generateRoadmap}
                        disabled={generating}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>AI Đang Xây Dựng (Mất ~5s)...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="h-5 w-5" />
                                <span>Phân Tích & Tạo Lộ Trình Ngay</span>
                            </>
                        )}
                    </button>
                </div>
            ) : (
                /* Roadmap Timeline Display */
                <div className="space-y-8 animate-fade-in-up">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-none p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-sm font-bold tracking-wider uppercase mb-4 border border-white/20">
                                Lộ trình 4 Tuần
                            </span>
                            <h2 className="text-3xl font-bold font-heading mb-3">{roadmap.title}</h2>
                            <p className="text-blue-50 text-lg max-w-3xl leading-relaxed opacity-90">
                                {roadmap.description}
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 space-y-16">
                        {roadmap.weeks.map((week, wIndex) => (
                            <div key={wIndex} className="relative">
                                {/* Week Header */}
                                <div className="flex items-center gap-4 mb-8 sticky top-14 bg-[#f5f7fb]/90 backdrop-blur-md py-4 z-20">
                                    <div className="w-14 h-14 bg-blue-100 text-blue-600 font-bold text-2xl flex items-center justify-center shadow-inner flex-shrink-0">
                                        W{week.week_number}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold font-heading text-gray-900">Tuần {week.week_number}</h3>
                                        <p className="text-gray-500 font-medium">{week.focus}</p>
                                    </div>
                                </div>

                                {/* Days Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10 pl-4 sm:pl-0">
                                    {/* Timeline Line for Desktop */}
                                    <div className="hidden sm:block absolute left-[27px] top-6 bottom-0 w-0.5 bg-gray-200 -z-10"></div>

                                    {week.days.map((day, dIndex) => (
                                        <div key={dIndex} className="bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group">
                                            {/* Day Indicator Dot */}
                                            <div className="hidden sm:block absolute -left-[23px] top-8 w-4 h-4 rounded-full bg-white border-4 border-gray-300 group-hover:border-blue-500 transition-colors"></div>

                                            <div className="flex items-baseline justify-between mb-4">
                                                <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">Ngày {day.day_number}</span>
                                                <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-green-500 transition-colors">
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <h4 className="text-lg font-bold font-heading text-gray-900 mb-4 line-clamp-2" title={day.topic}>
                                                {day.topic}
                                            </h4>
                                            <div className="space-y-3">
                                                {day.tasks.map((task, tIndex) => (
                                                    <div key={tIndex} className="flex items-start gap-3">
                                                        <Target className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                                                        <p className="text-sm text-gray-600 leading-relaxed">{task}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                                                <span className="text-xs text-gray-400 font-medium">~ {profile?.daily_time || 30} phút</span>
                                                <button className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 group/btn">
                                                    Học ngay
                                                    <BookOpen className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* COURSE LIBRARY SECTION */}
            {courses.length > 0 && (
                <div className="mt-16">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold font-heading text-gray-900">📚 Thư Viện Khóa Học</h2>
                            <p className="text-gray-500 mt-1">Học theo khóa học — bấm vào bài học bất kỳ để bắt đầu.</p>
                        </div>
                    </div>
                    <div className="space-y-8">
                        {courses.map(course => {
                            const courseLessons = lessons.filter(l => l.course_id === course.id);
                            return (
                                <div key={course.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5 text-white">
                                        <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded-full">{course.level}</span>
                                        <h3 className="text-xl font-heading font-bold mt-2">{course.title}</h3>
                                        <p className="text-blue-100 text-sm mt-1 opacity-90">{course.description}</p>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {courseLessons.length === 0 ? (
                                            <p className="p-6 text-gray-400 text-sm">Khóa học này chưa có bài học nào.</p>
                                        ) : courseLessons.map((lesson, li) => (
                                            <div key={lesson.id} className="flex items-center justify-between px-6 py-4 hover:bg-indigo-50 transition group">
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
                                                <Link
                                                    href={`/dashboard/courses/lessons/${lesson.id}`}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition opacity-0 group-hover:opacity-100"
                                                >
                                                    Vào Học <ArrowRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
