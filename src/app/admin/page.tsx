"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { BookOpen, FileText, Users, Activity } from "lucide-react";

export default function AdminPage() {
    const supabase = createClient();
    const [stats, setStats] = useState({
        courses: 0,
        lessons: 0,
        users: 0,
    });
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("Admin");

    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                // Fetch user info
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                    const { data: profile } = await supabase
                        .from("profiles")
                        .select("full_name")
                        .eq("id", user.id)
                        .single();
                    if (profile?.full_name) setUserName(profile.full_name);
                }

                // Fetch counts
                const [coursesRes, lessonsRes, usersRes] = await Promise.all([
                    supabase.from("courses").select("id", { count: "exact", head: true }),
                    supabase.from("lessons").select("id", { count: "exact", head: true }),
                    supabase.from("profiles").select("id", { count: "exact", head: true })
                ]);

                setStats({
                    courses: coursesRes.count || 0,
                    lessons: lessonsRes.count || 0,
                    users: usersRes.count || 0,
                });
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, [supabase]);

    const statCards = [
        { label: "Tổng số Khóa học", value: stats.courses, icon: BookOpen, color: "bg-blue-500" },
        { label: "Tổng số Bài học", value: stats.lessons, icon: FileText, color: "bg-emerald-500" },
        { label: "Tổng số Học viên", value: stats.users, icon: Users, color: "bg-purple-500" },
        { label: "Lượt truy cập", value: "---", icon: Activity, color: "bg-orange-500" },
    ];

    if (loading) {
        return <div className="animate-pulse flex space-x-4"><div className="flex-1 space-y-4 py-1"><div className="h-4 bg-slate-200 rounded w-3/4"></div><div className="space-y-2"><div className="h-4 bg-slate-200 rounded"></div><div className="h-4 bg-slate-200 rounded w-5/6"></div></div></div></div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-slate-900">Xin chào, {userName}</h1>
                <p className="text-slate-500 mt-1">Chào mừng bạn đến với Bảng điều khiển Quản trị DHV-Lingoo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                                    <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
                                </div>
                                <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white`}>
                                    <Icon className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mt-8">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Hướng dẫn nhanh</h2>
                <div className="space-y-4 text-slate-600">
                    <p>Để AI (Llama 3) có thể tự động xếp lịch học cho Học viên, bạn cần chuẩn bị Dữ liệu Bài Học theo các bước sau:</p>
                    <ol className="list-decimal list-inside space-y-2">
                        <li>Vào mục <strong>Khóa học</strong> và tạo các Khóa học lớn (Ví dụ: Tiếng Anh Vỡ Lòng A1).</li>
                        <li>Vào mục <strong>Bài học</strong> để tạo chi tiết nội dung (Ví dụ: Bài 1 - Bảng chữ cái). Chọn Khóa học và Level tương ứng.</li>
                        <li>Hệ thống AI sẽ tự động đọc các bài học ở bước 2 dựa trên Level của học viên để tạo Lộ trình 4 tuần.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
