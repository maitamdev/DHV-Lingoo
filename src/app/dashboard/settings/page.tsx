// Settings page - user profile and preferences management
"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Save, Loader2, User, Target, Clock, BookOpen, Camera } from "lucide-react";
import { StudyReminder } from "@/components/dashboard/StudyReminder";

const LEVELS = [
    { value: "A1", label: "A1 - Vỡ lòng", desc: "Mới bắt đầu" },
    { value: "A2", label: "A2 - Sơ cấp", desc: "Giao tiếp cơ bản" },
    { value: "B1", label: "B1 - Trung cấp", desc: "Giao tiếp tốt" },
    { value: "B2", label: "B2 - Trên trung cấp", desc: "Khá thành thạo" },
    { value: "C1", label: "C1 - Cao cấp", desc: "Gần bản ngữ" },
    { value: "C2", label: "C2 - Thành thạo", desc: "Như bản ngữ" },
];

const GOALS = [
    { id: "travel", label: "Du lịch", emoji: "✈️" },
    { id: "work", label: "Công việc", emoji: "💼" },
    { id: "ielts", label: "IELTS", emoji: "🎓" },
    { id: "business", label: "Business", emoji: "📊" },
    { id: "communication", label: "Giao tiếp", emoji: "💬" },
    { id: "academic", label: "Học thuật", emoji: "📚" },
];

const INTERESTS = [
    { id: "listening", label: "Nghe", emoji: "🎧" },
    { id: "speaking", label: "Nói", emoji: "🗣️" },
    { id: "reading", label: "Đọc", emoji: "📖" },
    { id: "writing", label: "Viết", emoji: "✍️" },
    { id: "vocabulary", label: "Từ vựng", emoji: "📝" },
    { id: "grammar", label: "Ngữ pháp", emoji: "📐" },
];

const DAILY_TIMES = [
    { value: 15, label: "15 phút", desc: "Nhẹ nhàng" },
    { value: 30, label: "30 phút", desc: "Vừa phải" },
    { value: 60, label: "1 giờ", desc: "Nghiêm túc" },
    { value: 120, label: "2 giờ", desc: "Chuyên sâu" },
];

export default function SettingsPage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [profile, setProfile] = useState({
        full_name: "",
        date_of_birth: "",
        gender: "",
        level: "A1",
        goals: [] as string[],
        interests: [] as string[],
        daily_time: 30,
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("profiles")
            .select("full_name, date_of_birth, gender, level, goals, interests, daily_time, avatar_url")
            .eq("id", user.id)
            .single();

        if (data) {
            setProfile({
                full_name: data.full_name || "",
                date_of_birth: data.date_of_birth || "",
                gender: data.gender || "",
                level: data.level || "A1",
                goals: data.goals || [],
                interests: data.interests || [],
                daily_time: data.daily_time || 30,
            });
            setAvatarUrl(data.avatar_url || null);
        }
        setLoading(false);
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingAvatar(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setUploadingAvatar(false); return; }

        const fileExt = file.name.split(".").pop();
        const filePath = `${user.id}/avatar.${fileExt}`;

        const { error: uploadError } = await supabase.storage
            .from("avatars")
            .upload(filePath, file, { upsert: true });

        if (uploadError) {
            alert("Lỗi upload: " + uploadError.message);
            setUploadingAvatar(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage
            .from("avatars")
            .getPublicUrl(filePath);

        await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
        setAvatarUrl(publicUrl);
        setUploadingAvatar(false);
    }

    async function handleSave() {
        setSaving(true);
        setSaved(false);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setSaving(false); return; }

        const { error } = await supabase.from("profiles").update({
            full_name: profile.full_name,
            date_of_birth: profile.date_of_birth || null,
            gender: profile.gender || null,
            level: profile.level,
            goals: profile.goals,
            interests: profile.interests,
            daily_time: profile.daily_time,
        }).eq("id", user.id);

        setSaving(false);
        if (!error) {
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
    }

    function toggleItem(key: "goals" | "interests", item: string) {
        setProfile(prev => ({
            ...prev,
            [key]: prev[key].includes(item)
                ? prev[key].filter(i => i !== item)
                : [...prev[key], item],
        }));
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-6 h-6 text-blue-500" />
                    Cài đặt hồ sơ
                </h1>
                <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân và tùy chỉnh trải nghiệm học tập</p>
            </div>

            <div className="space-y-6">

                {/* Avatar & Personal Info */}
                <section className="bg-white border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            Thông tin cá nhân
                        </h2>
                    </div>
                    <div className="p-6 space-y-4">
                        {/* Avatar Upload */}
                        <div className="flex items-center gap-5 pb-4 border-b border-gray-100">
                            <div className="relative group">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-2xl overflow-hidden flex-shrink-0">
                                    {avatarUrl ? (
                                        <Image src={avatarUrl} alt="Avatar" width={80} height={80} className="w-full h-full object-cover" />
                                    ) : (
                                        profile.full_name ? profile.full_name.charAt(0).toUpperCase() : "?"
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploadingAvatar}
                                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                >
                                    {uploadingAvatar ? (
                                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                                    ) : (
                                        <Camera className="w-5 h-5 text-white" />
                                    )}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-900">Ảnh đại diện</p>
                                <p className="text-xs text-gray-400 mt-0.5">Nhấn vào ảnh để thay đổi</p>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs text-blue-600 hover:underline mt-1 font-medium"
                                >
                                    {uploadingAvatar ? "Đang tải lên..." : "Chọn ảnh mới"}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                            <input
                                type="text"
                                value={profile.full_name}
                                onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                placeholder="Nhập họ và tên"
                            />
                            <p className="text-xs text-gray-400 mt-1">💡 Tên này sẽ hiển thị ở Dashboard thay vì email</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                                <input
                                    type="date"
                                    value={profile.date_of_birth}
                                    onChange={e => setProfile(p => ({ ...p, date_of_birth: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                                <select
                                    value={profile.gender}
                                    onChange={e => setProfile(p => ({ ...p, gender: e.target.value }))}
                                    className="w-full px-4 py-2.5 border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                                >
                                    <option value="">Chọn</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Level */}
                <section className="bg-white border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            Trình độ hiện tại
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {LEVELS.map(level => (
                                <button
                                    key={level.value}
                                    onClick={() => setProfile(p => ({ ...p, level: level.value }))}
                                    className={`p-3 border text-left transition-all ${profile.level === level.value
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <p className="font-bold text-sm text-gray-900">{level.label}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{level.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Goals */}
                <section className="bg-white border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500" />
                            Mục tiêu học tập
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {GOALS.map(goal => (
                                <button
                                    key={goal.id}
                                    onClick={() => toggleItem("goals", goal.id)}
                                    className={`p-3 border text-left transition-all flex items-center gap-2 ${profile.goals.includes(goal.id)
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-lg">{goal.emoji}</span>
                                    <span className="font-medium text-sm text-gray-800">{goal.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Interests */}
                <section className="bg-white border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-blue-500" />
                            Kỹ năng quan tâm
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {INTERESTS.map(interest => (
                                <button
                                    key={interest.id}
                                    onClick={() => toggleItem("interests", interest.id)}
                                    className={`p-3 border text-left transition-all flex items-center gap-2 ${profile.interests.includes(interest.id)
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <span className="text-lg">{interest.emoji}</span>
                                    <span className="font-medium text-sm text-gray-800">{interest.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Daily Time */}
                <section className="bg-white border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            Thời gian học mỗi ngày
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {DAILY_TIMES.map(dt => (
                                <button
                                    key={dt.value}
                                    onClick={() => setProfile(p => ({ ...p, daily_time: dt.value }))}
                                    className={`p-3 border text-center transition-all ${profile.daily_time === dt.value
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
                                        }`}
                                >
                                    <p className="font-bold text-sm text-gray-900">{dt.label}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{dt.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Study Reminder */}
                <StudyReminder />

                {/* Save Button */}
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`w-full py-3.5 font-bold text-white flex items-center justify-center gap-2 transition-all ${saved
                        ? "bg-emerald-500"
                        : saving
                            ? "bg-gray-400 cursor-wait"
                            : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
                        }`}
                >
                    {saved ? (
                        <>✓ Đã lưu thành công!</>
                    ) : saving ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Đang lưu...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Lưu thay đổi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
