// DashboardCharts - real-time analytics charts using Supabase data
"use client";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

/* ── Types ── */
interface ProgressRecord {
    completed_at: string;
    xp_earned: number;
    score: number;
    course_id: string;
}

/* ── Weekly Activity Chart ── */
export function WeeklyActivityChart({ progressData }: { progressData: ProgressRecord[] }) {
    const dayLabels = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const now = new Date();

    // Calculate lessons completed per day for the past 7 days
    const data = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(now);
        date.setDate(date.getDate() - (6 - i));
        const dateStr = date.toISOString().split("T")[0];
        const dayIndex = date.getDay(); // 0=CN, 1=T2, ...

        const lessonsToday = progressData.filter(p => {
            const pDate = new Date(p.completed_at).toISOString().split("T")[0];
            return pDate === dateStr;
        });

        return {
            day: dayLabels[dayIndex],
            lessons: lessonsToday.length,
            xp: lessonsToday.reduce((sum, p) => sum + (p.xp_earned || 0), 0),
        };
    });

    const totalWeek = data.reduce((s, d) => s + d.lessons, 0);

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-blue-50 border border-blue-200 flex items-center justify-center">
                        <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Hoạt động 7 ngày</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {totalWeek} bài học
                </span>
            </div>
            <div className="h-[180px]">
                {totalWeek === 0 ? (
                    <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                        Chưa có hoạt động nào trong 7 ngày qua
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} barSize={28}>
                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }} />
                            <YAxis hide />
                            <Tooltip
                                cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                                contentStyle={{
                                    background: "#1e293b",
                                    border: "none",
                                    color: "#fff",
                                    fontSize: 12,
                                    fontWeight: 700,
                                    padding: "6px 12px",
                                }}
                                formatter={(value, name) => {
                                    if (name === "lessons") return [`${value ?? 0} bài`, ""];
                                    return [`${value ?? 0} XP`, ""];
                                }}
                                labelStyle={{ color: "#94a3b8", fontSize: 10 }}
                            />
                            <Bar dataKey="lessons" fill="url(#blueGradient)" radius={[2, 2, 0, 0]} />
                            <defs>
                                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#3b82f6" />
                                    <stop offset="100%" stopColor="#6366f1" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

/* ── XP Progress Chart ── */
export function XPProgressChart({ currentXP, progressData }: { currentXP: number; progressData: ProgressRecord[] }) {
    // Group XP earned by date for last 30 days
    const now = new Date();
    const labels: string[] = [];
    const xpByDate: Record<string, number> = {};

    for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const label = `${date.getDate()}/${date.getMonth() + 1}`;
        labels.push(label);
        xpByDate[label] = 0;
    }

    progressData.forEach(p => {
        const d = new Date(p.completed_at);
        const label = `${d.getDate()}/${d.getMonth() + 1}`;
        if (label in xpByDate) {
            xpByDate[label] += p.xp_earned || 0;
        }
    });

    // Cumulative XP
    let cumulative = currentXP - Object.values(xpByDate).reduce((a, b) => a + b, 0);
    if (cumulative < 0) cumulative = 0;

    const data = labels.map(label => {
        cumulative += xpByDate[label];
        return { date: label, xp: cumulative };
    });

    // Show only every 5th label to avoid clutter
    const filteredData = data.filter((_, i) => i % 5 === 0 || i === data.length - 1);

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tiến trình XP (30 ngày)</h3>
                </div>
                <span className="text-lg font-mono font-black text-gray-900">{currentXP.toLocaleString()}</span>
            </div>
            <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 600 }} />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                background: "#1e293b",
                                border: "none",
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: 700,
                                padding: "6px 12px",
                            }}
                            formatter={(value) => [`${(value ?? 0).toLocaleString()} XP`, ""]}
                            labelStyle={{ color: "#94a3b8", fontSize: 10 }}
                        />
                        <Area
                            type="monotone"
                            dataKey="xp"
                            stroke="#10b981"
                            strokeWidth={2}
                            fill="url(#xpGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

/* ── Skills Breakdown Pie Chart ── */
export function SkillsBreakdownChart({ progressData, completedLessons }: { progressData: ProgressRecord[]; completedLessons: number }) {
    // Count lessons completed per course
    const courseCount: Record<string, number> = {};
    progressData.forEach(p => {
        if (p.course_id) {
            courseCount[p.course_id] = (courseCount[p.course_id] || 0) + 1;
        }
    });

    const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981", "#ec4899", "#14b8a6"];

    const totalScore = progressData.reduce((s, p) => s + (p.score || 0), 0);
    const avgScore = progressData.length > 0 ? Math.round(totalScore / progressData.length) : 0;

    const stats = [
        { name: "Đã hoàn thành", value: completedLessons, color: colors[0] },
        { name: "Điểm TB", value: avgScore, color: colors[1] },
        { name: "Tổng XP kiếm được", value: progressData.reduce((s, p) => s + (p.xp_earned || 0), 0), color: colors[2] },
    ];

    // Build pie data from course distribution
    const entries = Object.entries(courseCount);
    const pieData = entries.length > 0
        ? entries.map(([, count], i) => ({
            name: `Khóa ${i + 1}`,
            value: count,
            color: colors[i % colors.length],
        }))
        : [{ name: "Chưa có dữ liệu", value: 1, color: "#e5e7eb" }];

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-violet-50 border border-violet-200 flex items-center justify-center">
                    <PieChartIcon className="h-3.5 w-3.5 text-violet-500" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Thống kê học tập</h3>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-[140px] h-[140px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={65}
                                paddingAngle={2}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2.5">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5" style={{ backgroundColor: stat.color }} />
                                <span className="text-xs text-gray-600 font-medium">{stat.name}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-gray-800">{stat.value.toLocaleString()}</span>
                        </div>
                    ))}
                    {entries.length > 0 && (
                        <div className="pt-1.5 border-t border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">
                                {entries.length} khóa đã học
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
// Achievement chart widget planned
// Achievement unlock timeline
// Practice score trend chart integration planned
