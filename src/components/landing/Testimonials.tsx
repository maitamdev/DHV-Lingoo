import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
    {
        name: "Minh Trần",
        role: "Học viên IELTS",
        avatar: "/images/avatar-1.svg",
        quote:
            "DHV-Lingoo giúp mình tăng điểm IELTS Writing từ 5.5 lên 7.0 chỉ trong 3 tháng. Bài học ngắn gọn rất phù hợp với lịch trình hàng ngày.",
    },
    {
        name: "Linh Nguyễn",
        role: "Giảng viên Đại học",
        avatar: "/images/avatar-2.svg",
        quote:
            "Với vai trò giảng viên, mình rất thích công cụ quản trị. Tạo trắc nghiệm và bài học cho sinh viên chỉ trong vài phút — và theo dõi tiến trình thời gian thực.",
    },
    {
        name: "Huy Phạm",
        role: "Lập trình viên",
        avatar: "/images/avatar-3.svg",
        quote:
            "Hệ thống flashcards với lặp lại ngắt quãng thực sự là bước ngoặt. Cuối cùng mình nhớ được từ vựng thay vì quên ngay ngày hôm sau.",
    },
];

export default function Testimonials() {
    return (
        <section className="py-16 sm:py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
                    <p className="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase mb-2 sm:mb-3">
                        Đánh giá
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                        Được yêu thích bởi{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            học viên & giảng viên
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-lg">
                        Xem cộng đồng nói gì về trải nghiệm học tập với DHV-Lingoo.
                    </p>
                </div>

                {/* Testimonial cards — horizontal scroll on mobile */}
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0 -mx-4 px-4 sm:-mx-0 sm:px-0">
                    {testimonials.map((t) => (
                        <Card
                            key={t.name}
                            className="border-border/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 min-w-[280px] sm:min-w-[300px] md:min-w-0 snap-center shrink-0 md:shrink"
                        >
                            <CardContent className="p-5 sm:p-6">
                                <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-primary/20 mb-3 sm:mb-4" />
                                <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-6">
                                    &quot;{t.quote}&quot;
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full overflow-hidden shrink-0">
                                        <Image
                                            src={t.avatar}
                                            alt={t.name}
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.role}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
