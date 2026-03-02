"use client";

import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react";

/* ── Weekly Activity Chart ── */
export function WeeklyActivityChart() {
    const days = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const data = days.map((day) => ({
        day,
        minutes: Math.floor(Math.random() * 45) + 5,
    }));

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-blue-50 border border-blue-200 flex items-center justify-center">
                        <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Hoạt động tuần này</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phút/ngày</span>
            </div>
            <div className="h-[180px]">
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
                            formatter={(value: number) => [`${value} phút`, ""]}
                            labelStyle={{ color: "#94a3b8", fontSize: 10 }}
                        />
                        <Bar dataKey="minutes" fill="url(#blueGradient)" radius={[2, 2, 0, 0]} />
                        <defs>
                            <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3b82f6" />
                                <stop offset="100%" stopColor="#6366f1" />
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

/* ── XP Progress Chart ── */
export function XPProgressChart({ currentXP }: { currentXP: number }) {
    const months = ["T1", "T2", "T3", "T4", "T5", "T6"];
    const data = months.map((month, i) => ({
        month,
        xp: Math.floor((currentXP / 6) * (i + 1) * (0.6 + Math.random() * 0.4)),
    }));
    // Make last point the actual XP
    data[data.length - 1].xp = currentXP;

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Tiến trình XP</h3>
                </div>
                <span className="text-lg font-mono font-black text-gray-900">{currentXP.toLocaleString()}</span>
            </div>
            <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#9ca3af", fontSize: 11, fontWeight: 600 }} />
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
                            formatter={(value: number) => [`${value.toLocaleString()} XP`, ""]}
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
export function SkillsBreakdownChart({ interests }: { interests: string[] }) {
    const skillLabels: Record<string, string> = {
        listening: "Nghe", speaking: "Nói", reading: "Đọc",
        writing: "Viết", vocabulary: "Từ vựng", grammar: "Ngữ pháp",
    };

    const colors = ["#3b82f6", "#8b5cf6", "#06b6d4", "#f59e0b", "#ef4444", "#10b981"];

    const allSkills = interests.length > 0
        ? interests.map((s, i) => ({
            name: skillLabels[s.toLowerCase()] || s,
            value: Math.floor(Math.random() * 40) + 20,
            color: colors[i % colors.length],
        }))
        : [
            { name: "Nghe", value: 25, color: colors[0] },
            { name: "Nói", value: 20, color: colors[1] },
            { name: "Đọc", value: 30, color: colors[2] },
            { name: "Viết", value: 15, color: colors[3] },
            { name: "Từ vựng", value: 10, color: colors[4] },
        ];

    return (
        <div className="bg-white border border-gray-200 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 bg-violet-50 border border-violet-200 flex items-center justify-center">
                    <PieChartIcon className="h-3.5 w-3.5 text-violet-500" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Phân bổ kỹ năng</h3>
            </div>
            <div className="flex items-center gap-4">
                <div className="w-[140px] h-[140px] flex-shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={allSkills}
                                cx="50%"
                                cy="50%"
                                innerRadius={35}
                                outerRadius={65}
                                paddingAngle={2}
                                dataKey="value"
                                strokeWidth={0}
                            >
                                {allSkills.map((entry, index) => (
                                    <Cell key={index} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                    {allSkills.map((skill, i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5" style={{ backgroundColor: skill.color }} />
                                <span className="text-xs text-gray-600 font-medium">{skill.name}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-gray-800">{skill.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
