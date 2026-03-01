import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";

const tiers = [
    {
        name: "Miễn phí",
        price: "0đ",
        period: "mãi mãi",
        description: "Hoàn hảo để bắt đầu hành trình học tiếng Anh.",
        features: [
            "3 khóa học đầy đủ",
            "Trắc nghiệm cơ bản",
            "Bộ flashcards (giới hạn)",
            "Theo dõi tiến trình",
            "Truy cập cộng đồng",
        ],
        cta: "Học miễn phí",
        href: "/register",
        popular: false,
    },
    {
        name: "Pro",
        price: "199K",
        period: "mỗi tháng",
        description: "Mở khóa toàn bộ tính năng và học không giới hạn.",
        features: [
            "Tất cả khóa học không giới hạn",
            "Trắc nghiệm nâng cao & ôn tập",
            "Bộ flashcards không giới hạn",
            "Luyện nói phát âm",
            "Phân tích tiến trình thời gian thực",
            "Hỗ trợ ưu tiên",
            "Bảo vệ streak",
        ],
        cta: "Nâng cấp Pro",
        href: "/register?plan=pro",
        popular: true,
    },
    {
        name: "Nhóm",
        price: "599K",
        period: "mỗi tháng",
        description: "Dành cho giảng viên và tổ chức quản lý học viên.",
        features: [
            "Mọi thứ trong gói Pro",
            "Công cụ quản trị nội dung",
            "Tối đa 50 học viên",
            "Bảng phân tích nhóm",
            "Tùy chỉnh thương hiệu",
            "Nhập / xuất hàng loạt",
            "Hỗ trợ chuyên biệt",
        ],
        cta: "Liên hệ",
        href: "/register?plan=team",
        popular: false,
    },
];

export default function Pricing() {
    return (
        <section id="pricing" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">
                        Bảng giá
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                        Đơn giản,{" "}
                        <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                            minh bạch
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Bắt đầu miễn phí và nâng cấp khi bạn sẵn sàng. Không phí ẩn.
                    </p>
                </div>

                {/* Pricing cards */}
                <div className="grid md:grid-cols-3 gap-6 items-start">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`relative transition-all duration-300 hover:-translate-y-1 ${tier.popular
                                    ? "border-primary shadow-xl shadow-primary/10 scale-[1.02]"
                                    : "border-border/50 hover:shadow-lg"
                                }`}
                        >
                            {tier.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-violet-600 text-white shadow-lg">
                                    Phổ biến nhất
                                </Badge>
                            )}
                            <CardContent className="p-6 pt-8">
                                <h3 className="text-xl font-bold mb-1">{tier.name}</h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                    {tier.description}
                                </p>

                                <div className="flex items-baseline gap-1 mb-6">
                                    <span className="text-4xl font-extrabold">{tier.price}</span>
                                    <span className="text-muted-foreground text-sm">
                                        /{tier.period}
                                    </span>
                                </div>

                                <Button
                                    asChild
                                    className={`w-full mb-6 ${tier.popular
                                            ? "bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/25"
                                            : ""
                                        }`}
                                    variant={tier.popular ? "default" : "outline"}
                                >
                                    <Link href={tier.href}>{tier.cta}</Link>
                                </Button>

                                <Separator className="mb-6" />

                                <ul className="space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-3 text-sm">
                                            <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
