"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck, BookOpen, Star, Flame, Trophy, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

const typeIcons: Record<string, { icon: React.ReactNode; color: string }> = {
    lesson_complete: { icon: <BookOpen className="w-4 h-4" />, color: "bg-blue-100 text-blue-600" },
    xp_milestone: { icon: <Star className="w-4 h-4" />, color: "bg-amber-100 text-amber-600" },
    streak: { icon: <Flame className="w-4 h-4" />, color: "bg-orange-100 text-orange-600" },
    achievement: { icon: <Trophy className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-600" },
    system: { icon: <Info className="w-4 h-4" />, color: "bg-gray-100 text-gray-600" },
};

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    return `${days} ngày trước`;
}

export function NotificationBell() {
    const supabase = createClient();
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    async function fetchNotifications() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data } = await supabase
            .from("notifications")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20);

        if (data) setNotifications(data);
        setLoading(false);
    }

    async function markAllRead() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", user.id)
            .eq("is_read", false);

        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    }

    async function markRead(id: string) {
        await supabase.from("notifications").update({ is_read: true }).eq("id", id);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    }

    return (
        <div ref={dropdownRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={() => { setOpen(!open); if (!open) fetchNotifications(); }}
                className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
                aria-label="Thông báo"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-200 shadow-xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50">
                        <h3 className="font-bold text-sm text-gray-900">Thông báo</h3>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    <CheckCheck className="w-3 h-3" />
                                    Đọc tất cả
                                </button>
                            )}
                            <button onClick={() => setOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-80 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400 text-sm">Đang tải...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">Chưa có thông báo nào</p>
                            </div>
                        ) : (
                            notifications.map(notif => {
                                const typeInfo = typeIcons[notif.type] || typeIcons.system;
                                return (
                                    <button
                                        key={notif.id}
                                        onClick={() => markRead(notif.id)}
                                        className={`w-full text-left px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition flex items-start gap-3 ${!notif.is_read ? "bg-blue-50/50" : ""
                                            }`}
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${typeInfo.color}`}>
                                            {typeInfo.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{notif.title}</p>
                                                {!notif.is_read && (
                                                    <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-gray-300 mt-1">{timeAgo(notif.created_at)}</p>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
