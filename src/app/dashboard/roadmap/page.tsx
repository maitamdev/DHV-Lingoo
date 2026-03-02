"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Target, Loader2, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";

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

export default function RoadmapPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;

                const { data: profileData, error } = await supabase
                    .from("profiles")
                    .select("full_name, level, goals, daily_time, ai_roadmap")
                    .eq("id", user.id)
                    .single();

                if (error) throw error;
                setProfile(profileData);

                if (profileData.ai_roadmap && Object.keys(profileData.ai_roadmap).length > 0) {
                    setRoadmap(profileData.ai_roadmap as unknown as RoadmapData);
                }
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
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || "Failed to generate roadmap");
            }

            const data = await response.json();
            setRoadmap(data.roadmap as RoadmapData);
            setProfile((prev: any) => ({ ...prev, ai_roadmap: data.roadmap }));
        } catch (err: any) {
            console.error(err);
            alert(`Lỗi: ${err.message || 'Có lỗi xảy ra khi tạo lộ trình.'}`);
        } finally {
            setGenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Đang tải lộ trình...</p>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1200px] mx-auto min-h-screen">
            <div className="mb-10 text-center sm:text-left">
                <h1 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 mb-3">
                    🗺️ Lộ Trình Học Tập
                </h1>
                <p className="text-gray-500 max-w-2xl">
                    Chào {profile?.full_name?.split(" ")[0] || "bạn"}, dựa trên trình độ {profile?.level || "A1"} và mục tiêu học tập, đây là lộ trình được AI cá nhân hóa dành riêng cho bạn.
                </p>
            </div>

            {!roadmap ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-8 sm:p-12 text-center shadow-sm max-w-3xl mx-auto mt-10">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="h-10 w-10 text-blue-500" />
                    </div>
                    <h2 className="text-2xl font-bold font-heading text-gray-900 mb-4">
                        Tạo Lộ Trình Học Cá Nhân Hóa (AI)
                    </h2>
                    <p className="text-gray-600 mb-8 mx-auto max-w-lg leading-relaxed">
                        Hệ thống AI sẽ phân tích trình độ và mục tiêu của bạn để xây dựng một lộ trình học 4 tuần tối ưu nhất.
                    </p>
                    <button
                        onClick={generateRoadmap}
                        disabled={generating}
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>AI Đang Xây Dựng (~5s)...</span>
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
                <div className="space-y-8 animate-fade-in-up">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                        <div className="relative z-10">
                            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-sm font-bold tracking-wider uppercase mb-4 rounded-full border border-white/20">
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
                                <div className="flex items-center gap-4 mb-8 sticky top-14 bg-[#f5f7fb]/90 backdrop-blur-md py-4 z-20">
                                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl font-bold text-2xl flex items-center justify-center shadow-inner flex-shrink-0">
                                        W{week.week_number}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold font-heading text-gray-900">Tuần {week.week_number}</h3>
                                        <p className="text-gray-500 font-medium">{week.focus}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
                                    {week.days.map((day, dIndex) => (
                                        <div key={dIndex} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
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
        </div>
    );
}
