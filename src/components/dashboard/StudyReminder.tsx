// StudyReminder - daily study reminder configuration
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, BellOff, Clock, X } from "lucide-react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export function StudyReminder() {
    const supabase = createClient();
    const [enabled, setEnabled] = useState(false);
    const [reminderTime, setReminderTime] = useState("20:00");
    const [showBanner, setShowBanner] = useState(false);
    const [permission, setPermission] = useState<string>("default");
    const [swSupported, setSwSupported] = useState(false);

    useEffect(() => {
        setSwSupported("serviceWorker" in navigator && "PushManager" in window);
        if ("Notification" in window) {
            setPermission(Notification.permission);
        }
        loadSettings();
    }, []);

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

    async function subscribePush() {
        try {
            // Register Service Worker
            const registration = await navigator.serviceWorker.register("/sw.js");
            await navigator.serviceWorker.ready;

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });

            // Save to server
            await fetch("/api/push-subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subscription: subscription.toJSON(),
                    reminderTime,
                }),
            });

            return true;
        } catch (err) {
            console.error("Push subscription failed:", err);
            return false;
        }
    }

    async function unsubscribePush() {
        try {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                const subscription = await registration.pushManager.getSubscription();
                if (subscription) await subscription.unsubscribe();
            }

            await fetch("/api/push-subscribe", { method: "DELETE" });
        } catch (err) {
            console.error("Unsubscribe failed:", err);
        }
    }

    async function toggleReminder() {
        if (!enabled) {
            // Turning on
            if ("Notification" in window && Notification.permission === "default") {
                const perm = await Notification.requestPermission();
                setPermission(perm);
                if (perm !== "granted") return;
            }

            if (swSupported) {
                const success = await subscribePush();
                if (!success) return;
            }

            setEnabled(true);
            saveSettings(true, reminderTime);
        } else {
            // Turning off
            if (swSupported) {
                await unsubscribePush();
            }
            setEnabled(false);
            saveSettings(false, reminderTime);
            setShowBanner(false);
        }
    }

    async function updateTime(time: string) {
        setReminderTime(time);
        saveSettings(enabled, time);

        // Update server-side reminder time
        if (enabled && swSupported) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
                const subscription = await registration.pushManager.getSubscription();
                if (subscription) {
                    await fetch("/api/push-subscribe", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            subscription: subscription.toJSON(),
                            reminderTime: time,
                        }),
                    });
                }
            }
        }
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
                            <p className="text-xs text-gray-400 mt-0.5">
                                {swSupported
                                    ? "Nhận thông báo đẩy ngay cả khi không mở web"
                                    : "Nhận thông báo khi mở web"}
                            </p>
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
                            {permission === "granted" && swSupported && (
                                <p className="text-xs text-emerald-600 mt-2">
                                    ✅ Push notification đã bật — nhắc bạn lúc {reminderTime} mỗi ngày (kể cả khi tắt web)
                                </p>
                            )}
                            {permission === "granted" && !swSupported && (
                                <p className="text-xs text-amber-600 mt-2">
                                    ⚠️ Trình duyệt không hỗ trợ push — chỉ nhắc khi mở web
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Floating Study Reminder Banner */}
            {showBanner && (
                <div className="fixed bottom-24 right-6 z-40 max-w-sm">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-2xl shadow-blue-500/30 border border-blue-400/20 relative">
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
                                <p className="text-xs text-blue-100 mt-0.5">Dành vài phút để duy trì streak nhé</p>
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
