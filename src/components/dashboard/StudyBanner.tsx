// StudyBanner - motivational study streak banner
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Bell, X } from "lucide-react";

export function StudyBanner() {
    const supabase = createClient();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("dhv-reminder");
        if (!saved) return;
        const settings = JSON.parse(saved);
        if (!settings.enabled) return;

        async function check() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("profiles")
                .select("last_active_date")
                .eq("id", user.id)
                .single();

            const today = new Date().toISOString().split("T")[0];
            if (data?.last_active_date !== today) {
                setShow(true);
            }
        }
        check();
    }, []);

    if (!show) return null;

    return (
        <div className="fixed bottom-24 right-6 z-40 max-w-sm">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-2xl shadow-blue-500/30 border border-blue-400/20 relative">
                <button
                    onClick={() => setShow(false)}
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
    );
}
