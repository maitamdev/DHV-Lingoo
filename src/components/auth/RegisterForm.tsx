"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    ArrowLeft,
    ArrowRight,
    Eye,
    EyeOff,
    Upload,
    User,
    Sparkles,
    CheckCircle2,
} from "lucide-react";

const STEPS = [
    { label: "Tài khoản", description: "Email & mật khẩu" },
    { label: "Cá nhân", description: "Thông tin cá nhân" },
    { label: "Mục tiêu", description: "Tùy chỉnh học tập" },
];

const GOALS = [
    { id: "travel", label: "Du lịch", emoji: "✈️" },
    { id: "toeic", label: "TOEIC", emoji: "📊" },
    { id: "ielts", label: "IELTS", emoji: "🎓" },
    { id: "business", label: "Business", emoji: "💼" },
    { id: "communication", label: "Giao tiếp", emoji: "💬" },
    { id: "academic", label: "Học thuật", emoji: "📚" },
];

const DAILY_TIMES = [
    { value: "15", label: "15 phút", desc: "Nhẹ nhàng" },
    { value: "30", label: "30 phút", desc: "Vừa phải" },
    { value: "60", label: "1 giờ", desc: "Nghiêm túc" },
    { value: "90", label: "1.5 giờ+", desc: "Chuyên sâu" },
];

const LEVELS = [
    { value: "A1", label: "A1 – Mới bắt đầu", color: "from-green-400 to-green-500" },
    { value: "A2", label: "A2 – Sơ cấp", color: "from-lime-400 to-lime-500" },
    { value: "B1", label: "B1 – Trung cấp", color: "from-yellow-400 to-yellow-500" },
    { value: "B2", label: "B2 – Trung cao", color: "from-orange-400 to-orange-500" },
    { value: "C1", label: "C1 – Nâng cao", color: "from-red-400 to-red-500" },
    { value: "C2", label: "C2 – Thành thạo", color: "from-purple-400 to-purple-500" },
];

const INTERESTS = [
    { id: "listening", label: "Nghe", emoji: "👂" },
    { id: "speaking", label: "Nói", emoji: "🗣️" },
    { id: "reading", label: "Đọc", emoji: "📖" },
    { id: "writing", label: "Viết", emoji: "✍️" },
    { id: "vocabulary", label: "Từ vựng", emoji: "📝" },
    { id: "grammar", label: "Ngữ pháp", emoji: "📐" },
];

export default function RegisterForm() {
    const [step, setStep] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        dateOfBirth: "",
        gender: "",
        country: "",
        timezone: "",
        avatarPreview: "",
        goals: [] as string[],
        dailyTime: "",
        level: "",
        interests: [] as string[],
        agreeTerms: false,
    });

    const updateForm = (key: string, value: string | boolean | string[]) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const toggleArrayItem = (key: "goals" | "interests", item: string) => {
        setForm((prev) => {
            const arr = prev[key];
            return {
                ...prev,
                [key]: arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item],
            };
        });
    };

    const progress = ((step + 1) / STEPS.length) * 100;

    const canNext = () => {
        if (step === 0) return form.email && form.password && form.password === form.confirmPassword;
        if (step === 1) return form.fullName && form.dateOfBirth && form.gender;
        if (step === 2) return form.goals.length > 0 && form.dailyTime && form.level && form.interests.length > 0 && form.agreeTerms;
        return false;
    };

    const handleSubmit = () => {
        console.log("Registration data:", form);
        // TODO: Call Supabase auth + insert profile
        alert("Đăng ký thành công! 🎉 (Sẽ kết nối Supabase sau)");
    };

    return (
        <Card className="w-full max-w-lg border-border/50 shadow-2xl shadow-cyan-500/5">
            <CardContent className="p-6 sm:p-8">
                {/* Header */}
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                        <Image
                            src="/images/logo.png"
                            alt="DHV-Lingoo"
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full object-cover drop-shadow-lg group-hover:scale-105 transition-transform"
                        />
                        <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            DHV-Lingoo
                        </span>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-1">Tạo tài khoản</h1>
                    <p className="text-sm text-muted-foreground">
                        {STEPS[step].description} — Bước {step + 1}/{STEPS.length}
                    </p>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <Progress value={progress} className="h-2 mb-3" />
                    <div className="flex justify-between">
                        {STEPS.map((s, i) => (
                            <button
                                key={s.label}
                                onClick={() => i < step && setStep(i)}
                                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${i <= step ? "text-primary" : "text-muted-foreground"
                                    } ${i < step ? "cursor-pointer hover:text-primary/80" : "cursor-default"}`}
                            >
                                {i < step ? (
                                    <CheckCircle2 className="h-4 w-4" />
                                ) : (
                                    <span
                                        className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${i === step ? "border-primary bg-primary text-white" : "border-muted-foreground/30"
                                            }`}
                                    >
                                        {i + 1}
                                    </span>
                                )}
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Step 1: Account */}
                {step === 0 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => updateForm("email", e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Mật khẩu</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Tối thiểu 8 ký tự"
                                    value={form.password}
                                    onChange={(e) => updateForm("password", e.target.value)}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                value={form.confirmPassword}
                                onChange={(e) => updateForm("confirmPassword", e.target.value)}
                            />
                            {form.confirmPassword && form.password !== form.confirmPassword && (
                                <p className="text-xs text-destructive">Mật khẩu không khớp</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 2: Personal Info */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Họ và tên đầy đủ</Label>
                            <Input
                                id="fullName"
                                placeholder="Nguyễn Văn A"
                                value={form.fullName}
                                onChange={(e) => updateForm("fullName", e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="dob">Ngày sinh</Label>
                                <Input
                                    id="dob"
                                    type="date"
                                    value={form.dateOfBirth}
                                    onChange={(e) => updateForm("dateOfBirth", e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Giới tính</Label>
                                <Select value={form.gender} onValueChange={(v) => updateForm("gender", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">Nam</SelectItem>
                                        <SelectItem value="female">Nữ</SelectItem>
                                        <SelectItem value="other">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Avatar upload */}
                        <div className="space-y-2">
                            <Label>Ảnh đại diện (tùy chọn)</Label>
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center overflow-hidden border-2 border-dashed border-border">
                                    {form.avatarPreview ? (
                                        <Image src={form.avatarPreview} alt="Avatar" width={64} height={64} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-6 w-6 text-muted-foreground" />
                                    )}
                                </div>
                                <Button variant="outline" size="sm" className="gap-2" asChild>
                                    <label htmlFor="avatar-upload" className="cursor-pointer">
                                        <Upload className="h-4 w-4" />
                                        Tải ảnh lên
                                        <input
                                            id="avatar-upload"
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    updateForm("avatarPreview", url);
                                                }
                                            }}
                                        />
                                    </label>
                                </Button>
                            </div>
                        </div>

                        {/* Country & Timezone (optional) */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Quốc gia (tùy chọn)</Label>
                                <Select value={form.country} onValueChange={(v) => updateForm("country", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VN">🇻🇳 Việt Nam</SelectItem>
                                        <SelectItem value="US">🇺🇸 Hoa Kỳ</SelectItem>
                                        <SelectItem value="UK">🇬🇧 Anh</SelectItem>
                                        <SelectItem value="JP">🇯🇵 Nhật Bản</SelectItem>
                                        <SelectItem value="KR">🇰🇷 Hàn Quốc</SelectItem>
                                        <SelectItem value="other">Khác</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Múi giờ (tùy chọn)</Label>
                                <Select value={form.timezone} onValueChange={(v) => updateForm("timezone", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Asia/Ho_Chi_Minh">UTC+7 (Việt Nam)</SelectItem>
                                        <SelectItem value="Asia/Tokyo">UTC+9 (Nhật)</SelectItem>
                                        <SelectItem value="Europe/London">UTC+0 (London)</SelectItem>
                                        <SelectItem value="America/New_York">UTC-5 (New York)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Learning Preferences */}
                {step === 2 && (
                    <div className="space-y-5">
                        {/* Goals */}
                        <div className="space-y-2">
                            <Label>Mục tiêu học (chọn nhiều)</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {GOALS.map((g) => (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() => toggleArrayItem("goals", g.id)}
                                        className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-xs font-medium transition-all ${form.goals.includes(g.id)
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <span className="text-lg">{g.emoji}</span>
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Daily time */}
                        <div className="space-y-2">
                            <Label>Thời gian học mỗi ngày</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {DAILY_TIMES.map((t) => (
                                    <button
                                        key={t.value}
                                        type="button"
                                        onClick={() => updateForm("dailyTime", t.value)}
                                        className={`flex flex-col items-center gap-0.5 p-2.5 rounded-xl border-2 text-xs font-medium transition-all ${form.dailyTime === t.value
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <span className="font-bold text-sm">{t.label}</span>
                                        <span className="text-[10px] opacity-70">{t.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Level */}
                        <div className="space-y-2">
                            <Label>Cấp độ hiện tại</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {LEVELS.map((l) => (
                                    <button
                                        key={l.value}
                                        type="button"
                                        onClick={() => updateForm("level", l.value)}
                                        className={`p-2.5 rounded-xl border-2 text-xs font-medium transition-all text-center ${form.level === l.value
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <span className={`font-bold text-sm bg-gradient-to-r ${l.color} bg-clip-text text-transparent`}>
                                            {l.value}
                                        </span>
                                        <p className="text-[10px] mt-0.5 opacity-70">{l.label.split(" – ")[1]}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Interests */}
                        <div className="space-y-2">
                            <Label>Sở thích học (chọn nhiều)</Label>
                            <div className="grid grid-cols-3 gap-2">
                                {INTERESTS.map((i) => (
                                    <button
                                        key={i.id}
                                        type="button"
                                        onClick={() => toggleArrayItem("interests", i.id)}
                                        className={`flex items-center gap-1.5 p-2.5 rounded-xl border-2 text-xs font-medium transition-all ${form.interests.includes(i.id)
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <span>{i.emoji}</span>
                                        {i.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-2 pt-2">
                            <Checkbox
                                id="terms"
                                checked={form.agreeTerms}
                                onCheckedChange={(checked) => updateForm("agreeTerms", !!checked)}
                                className="mt-0.5"
                            />
                            <Label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed cursor-pointer">
                                Tôi đồng ý với{" "}
                                <Link href="/terms" className="text-primary hover:underline">Điều khoản sử dụng</Link>
                                {" "}và{" "}
                                <Link href="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link>
                                {" "}của DHV-Lingoo.
                            </Label>
                        </div>
                    </div>
                )}

                {/* Navigation buttons */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    {step > 0 ? (
                        <Button
                            variant="ghost"
                            onClick={() => setStep(step - 1)}
                            className="gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Quay lại
                        </Button>
                    ) : (
                        <Button variant="ghost" asChild>
                            <Link href="/">← Trang chủ</Link>
                        </Button>
                    )}

                    {step < STEPS.length - 1 ? (
                        <Button
                            onClick={() => setStep(step + 1)}
                            disabled={!canNext()}
                            className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-500/90 hover:to-blue-600/90 shadow-lg shadow-cyan-500/25"
                        >
                            Tiếp tục
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={!canNext()}
                            className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-500/90 hover:to-blue-600/90 shadow-lg shadow-cyan-500/25"
                        >
                            <Sparkles className="h-4 w-4" />
                            Đăng ký ngay
                        </Button>
                    )}
                </div>

                {/* Login link */}
                <p className="text-center text-xs text-muted-foreground mt-4">
                    Đã có tài khoản?{" "}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Đăng nhập
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
