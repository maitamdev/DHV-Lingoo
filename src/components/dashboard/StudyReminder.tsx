"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, BellOff, Clock, X } from "lucide-react";

export function StudyReminder() {
    const supabase = createClient();
    const [enabled, setEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState("20:00");
    const [showBanner, setShowBanner] = useState(false);
    const [permission, setPermission] = useState<NotificationPermission>("default");

    useEffect(() => {
        if ("Notification" in window) {
            setPermission(Notification.permission);
        }
        loadSettings();
    }, []);

    // Daily check - show study banner if inactive
    useEffect(() => {
        if (!enabled) return;

        async function checkStudyToday() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("profiles")
                .select("last_active_date")
                .eq("id", user.id)
                .single();

            const today = new Date().toISOString().split("T")[0];
            if (data?.last_active_date !== today) {
                setShowBanner(true);
            }
        }

        checkStudyToday();
    }, [enabled]);

    // Schedule browser notification
    useEffect(() => {
        if (!enabled || permission !== "granted") return;

        const checkInterval = setInterval(() => {
            const now = new Date();
            const [hours, mins] = reminderTime.split(":").map(Number);
            if (now.getHours() === hours && now.getMinutes() === mins) {
                new Notification("DHV-Lingoo 📚", {
                    body: "Đến giờ học rồi! Hãy dành vài phút luyện tập tiếng Anh nhé 🔥",
                    icon: "/images/logo.png",
                    tag: "study-reminder",
                });
            }
        }, 60000); // Check every minute

        return () => clearInterval(checkInterval);
    }, [enabled, permission, reminderTime]);

    function loadSettings() {
        const saved = localStorage.getItem("dhv-reminder");
        if (saved) {
            const settings = JSON.parse(saved);
            setEnabled(settings.enabled || false);
            setReminderTime(settings.time || "20:00");
        }
    }

    function saveSettings(newEnabled: boolean, newTime: string) {
        localStorage.setItem("dhv-reminder", JSON.stringify({ enabled: newEnabled, time: newTime }));
    }

    async function toggleReminder() {
        if (!enabled) {
            // Turning on
            if ("Notification" in window && Notification.permission === "default") {
                const perm = await Notification.requestPermission();
                setPermission(perm);
                if (perm !== "granted") return;
            }
            setEnabled(true);
            saveSettings(true, reminderTime);
        } else {
            setEnabled(false);
            saveSettings(false, reminderTime);
            setShowBanner(false);
        }
    }

    function updateTime(time: string) {
        setReminderTime(time);
        saveSettings(enabled, time);
    }

    return (
        <>
            {/* Settings Section */}
            <section className="bg-white border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <Bell className="w-4 h-4 text-blue-500" />
                        Nhắc nhở học tập
                    </h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Thông báo nhắc nhở hàng ngày</p>
                            <p className="text-xs text-gray-400 mt-0.5">Nhận thông báo nhắc bạn học mỗi ngày</p>
                        </div>
                        <button
                            onClick={toggleReminder}
                            className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? "bg-blue-500" : "bg-gray-300"}`}
                        >
                            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-6" : "translate-x-0"}`} />
                        </button>
                    </div>

                    {enabled && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-3">
                                <Clock className="w-4 h-4 text-gray-400" />
                                <label className="text-sm text-gray-600">Giờ nhắc nhở:</label>
                                <input
                                    type="time"
                                    value={reminderTime}
                                    onChange={(e) => updateTime(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                />
                            </div>
                            {permission === "denied" && (
                                <p className="text-xs text-red-500 mt-2">
                                    ⚠️ Bạn đã chặn thông báo. Vui lòng bật lại trong cài đặt trình duyệt.
                                </p>
                            )}
                            {permission === "granted" && (
                                <p className="text-xs text-emerald-600 mt-2">
                                    ✅ Thông báo đã được bật — sẽ nhắc bạn lúc {reminderTime} mỗi ngày
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Floating Study Reminder Banner */}
            {showBanner && (
                <div className="fixed bottom-24 right-6 z-40 max-w-sm animate-in slide-in-from-bottom-4">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-2xl shadow-blue-500/30 border border-blue-400/20">
                        <button
                            onClick={() => setShowBanner(false)}
                            className="absolute top-2 right-2 text-white/60 hover:text-white"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Bell className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Hôm nay bạn chưa học! 📚</p>
                                <p className="text-xs text-blue-100 mt-0.5">Dành vài phút để duy trì streak và tiến bộ nhé</p>
                                <a
                                    href="/dashboard/courses"
                                    className="inline-block mt-2 px-3 py-1.5 bg-white text-blue-600 text-xs font-bold hover:bg-blue-50 transition"
                                >
                                    Học ngay →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
