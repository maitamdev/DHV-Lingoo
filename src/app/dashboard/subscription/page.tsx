"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Check, Crown, Zap, Star, Shield, Loader2 } from "lucide-react";

const PLANS = [
    {
        id: "free",
        name: "Miễn phí",
        price: "0đ",
        period: "mãi mãi",
        description: "Bắt đầu hành trình học tập",
        features: [
            "3 khóa học cơ bản",
            "Fox AI chatbot (giới hạn 10 câu/ngày)",
            "Quiz cơ bản",
            "Bảng xếp hạng",
        ],
        limits: [
            "Không có lộ trình AI",
            "Không có flashcards",
            "Không có chứng chỉ",
        ],
        icon: Star,
        color: "gray",
        gradient: "from-gray-400 to-gray-600",
        popular: false,
    },
    {
        id: "premium",
        name: "Premium",
        price: "199.000đ",
        period: "/tháng",
        description: "Trải nghiệm học tập hoàn chỉnh",
        features: [
            "Tất cả khóa học (A1 → C2)",
            "Lộ trình AI cá nhân hóa",
            "Fox AI chatbot không giới hạn",
            "Flashcards thông minh",
            "Bài tập speaking & listening",
            "Chứng chỉ hoàn thành",
            "Hỗ trợ ưu tiên",
        ],
        limits: [],
        icon: Crown,
        color: "blue",
        gradient: "from-blue-500 to-indigo-600",
        popular: true,
    },
    {
        id: "lifetime",
        name: "Trọn đời",
        price: "1.999.000đ",
        period: "một lần",
        description: "Đầu tư dài hạn cho tương lai",
        features: [
            "Tất cả tính năng Premium",
            "Truy cập vĩnh viễn",
            "Cập nhật khóa học mới miễn phí",
            "1-on-1 với giáo viên (2 lần/tháng)",
            "Tài liệu độc quyền",
            "Badge VIP đặc biệt",
            "Ưu tiên tính năng mới",
        ],
        limits: [],
        icon: Shield,
        color: "amber",
        gradient: "from-amber-500 to-orange-600",
        popular: false,
    },
];

export default function SubscriptionPage() {
    const supabase = createClient();
    const [currentPlan, setCurrentPlan] = useState("free");
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPlan() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data } = await supabase
                    .from("profiles")
                    .select("role")
                    .eq("id", user.id)
                    .single();
                // For now, all users are on free plan
                setCurrentPlan("free");
            }
            setLoading(false);
        }
        fetchPlan();
    }, []);

    function handleUpgrade(planId: string) {
        setProcessing(planId);
        // Simulated payment flow
        setTimeout(() => {
            alert(`Tính năng thanh toán cho gói "${PLANS.find(p => p.id === planId)?.name}" sẽ sớm được cập nhật! 🚀`);
            setProcessing(null);
        }, 1500);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                    <Crown className="w-8 h-8 text-amber-500" />
                    Nâng cấp tài khoản
                </h1>
                <p className="text-gray-500 mt-2 max-w-lg mx-auto">
                    Mở khóa toàn bộ tính năng và tăng tốc hành trình học tiếng Anh của bạn
                </p>
            </div>

            {/* Current Plan Badge */}
            <div className="text-center mb-8">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 text-sm font-medium">
                    <Zap className="w-4 h-4" />
                    Gói hiện tại: <strong>{PLANS.find(p => p.id === currentPlan)?.name}</strong>
                </span>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6">
                {PLANS.map(plan => {
                    const Icon = plan.icon;
                    const isCurrent = plan.id === currentPlan;
                    return (
                        <div
                            key={plan.id}
                            className={`relative bg-white border overflow-hidden transition-all hover:shadow-lg ${plan.popular
                                ? "border-blue-500 shadow-lg shadow-blue-500/10 scale-[1.02]"
                                : "border-gray-200"
                                }`}
                        >
                            {/* Popular badge */}
                            {plan.popular && (
                                <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                                    Phổ biến
                                </div>
                            )}

                            {/* Header */}
                            <div className={`p-6 bg-gradient-to-br ${plan.gradient} text-white`}>
                                <Icon className="w-8 h-8 mb-3 opacity-90" />
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <p className="text-sm opacity-80 mt-1">{plan.description}</p>
                                <div className="mt-4">
                                    <span className="text-3xl font-bold">{plan.price}</span>
                                    <span className="text-sm opacity-70 ml-1">{plan.period}</span>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="p-6">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm">
                                            <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.color === "gray" ? "text-gray-400" : plan.color === "blue" ? "text-blue-500" : "text-amber-500"}`} />
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                    {plan.limits.map((limit, i) => (
                                        <li key={`l-${i}`} className="flex items-start gap-2 text-sm text-gray-400">
                                            <span className="w-4 text-center flex-shrink-0 mt-0.5">✕</span>
                                            <span className="line-through">{limit}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button */}
                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={isCurrent || processing === plan.id}
                                    className={`w-full mt-6 py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all ${isCurrent
                                        ? "bg-gray-100 text-gray-400 cursor-default"
                                        : plan.popular
                                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
                                            : plan.color === "amber"
                                                ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/30 hover:-translate-y-0.5"
                                                : "bg-gray-900 text-white hover:bg-gray-800"
                                        }`}
                                >
                                    {processing === plan.id ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Đang xử lý...
                                        </>
                                    ) : isCurrent ? (
                                        "Gói hiện tại"
                                    ) : (
                                        <>
                                            <Zap className="w-4 h-4" />
                                            {plan.id === "free" ? "Downgrade" : "Nâng cấp ngay"}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* FAQ section */}
            <div className="mt-12 bg-white border border-gray-200 p-6">
                <h2 className="font-bold text-lg text-gray-900 mb-4">Câu hỏi thường gặp</h2>
                <div className="space-y-4">
                    {[
                        { q: "Tôi có thể hủy gói bất kỳ lúc nào không?", a: "Có, bạn có thể hủy gói Premium bất kỳ lúc nào. Bạn vẫn sử dụng được đến hết kỳ thanh toán." },
                        { q: "Phương thức thanh toán nào được hỗ trợ?", a: "Chúng tôi hỗ trợ thẻ Visa/Mastercard, Momo, ZaloPay và chuyển khoản ngân hàng." },
                        { q: "Gói Trọn đời có được cập nhật khóa học mới?", a: "Có! Bạn sẽ nhận được tất cả các khóa học mới hoàn toàn miễn phí." },
                    ].map((faq, i) => (
                        <div key={i} className="border-b border-gray-100 pb-3 last:border-0">
                            <p className="font-medium text-sm text-gray-900">{faq.q}</p>
                            <p className="text-xs text-gray-500 mt-1">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
