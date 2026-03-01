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
        <section id="pricing" className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
                    <p className="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase mb-2 sm:mb-3">
                        Bảng giá
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                        Đơn giản,{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            minh bạch
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-lg">
                        Bắt đầu miễn phí và nâng cấp khi bạn sẵn sàng. Không phí ẩn.
                    </p>
                </div>

                {/* Pricing cards — scrollable on mobile, grid on md+ */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 md:items-start -mx-4 px-4 sm:-mx-0 sm:px-0">
                    {tiers.map((tier) => (
                        <Card
                            key={tier.name}
                            className={`relative transition-all duration-300 hover:-translate-y-1 min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-center shrink-0 md:shrink ${tier.popular
                                    ? "border-primary shadow-xl shadow-cyan-500/10 md:scale-[1.02]"
                                    : "border-border/50 hover:shadow-lg"
                                }`}
                        >
                            {tier.popular && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg text-[10px] sm:text-xs">
                                    Phổ biến nhất
                                </Badge>
                            )}
                            <CardContent className="p-5 sm:p-6 pt-7 sm:pt-8">
                                <h3 className="text-lg sm:text-xl font-bold mb-1">{tier.name}</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                                    {tier.description}
                                </p>

                                <div className="flex items-baseline gap-1 mb-4 sm:mb-6">
                                    <span className="text-3xl sm:text-4xl font-extrabold">{tier.price}</span>
                                    <span className="text-muted-foreground text-xs sm:text-sm">
                                        /{tier.period}
                                    </span>
                                </div>

                                <Button
                                    asChild
                                    className={`w-full mb-4 sm:mb-6 text-sm ${tier.popular
                                            ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-500/90 hover:to-blue-600/90 shadow-lg shadow-cyan-500/25"
                                            : ""
                                        }`}
                                    variant={tier.popular ? "default" : "outline"}
                                >
                                    <Link href={tier.href}>{tier.cta}</Link>
                                </Button>

                                <Separator className="mb-4 sm:mb-6" />

                                <ul className="space-y-2.5 sm:space-y-3">
                                    {tier.features.map((feature) => (
                                        <li key={feature} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm">
                                            <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0 mt-0.5" />
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
