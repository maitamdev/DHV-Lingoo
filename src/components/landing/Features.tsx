// Features section - showcases platform capabilities
import { Card, CardContent } from "@/components/ui/card";
import {
    BookOpen,
    BrainCircuit,
    Layers,
    Mic,
    BarChart3,
    Settings2,
} from "lucide-react";

const features = [
    {
        icon: BookOpen,
        title: "Khóa học & bài học ngắn gọn",
        description:
            "Khóa học có cấu trúc rõ ràng, chia thành bài nhỏ để bạn hoàn thành trong 10 phút hoặc ít hơn.",
    },
    {
        icon: BrainCircuit,
        title: "Trắc nghiệm chấm điểm tức thì",
        description:
            "Kiểm tra kiến thức với trắc nghiệm thông minh và nhận giải thích chi tiết cho mỗi câu trả lời.",
    },
    {
        icon: Layers,
        title: "Flashcards & lặp lại ngắt quãng",
        description:
            "Thẻ ghi nhớ thông minh tự điều chỉnh theo trí nhớ, xuất hiện đúng lúc bạn cần ôn tập.",
    },
    {
        icon: Mic,
        title: "Luyện nói phát âm",
        description:
            "Luyện tập phát âm với bài nói có hướng dẫn và phản hồi âm thanh tích hợp.",
    },
    {
        icon: BarChart3,
        title: "Bảng điều khiển & thời gian thực",
        description:
            "Theo dõi streak, XP, độ chính xác và mục tiêu tuần — tất cả cập nhật real-time.",
    },
    {
        icon: Settings2,
        title: "Công cụ quản trị nội dung",
        description:
            "Giảng viên và admin có thể tạo, chỉnh sửa và xuất bản khóa học dễ dàng với CMS trực quan.",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
                    <p className="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase mb-2 sm:mb-3">
                        Tính năng
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                        Mọi thứ bạn cần để{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            thành thạo tiếng Anh
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-lg">
                        Nền tảng kết hợp phương pháp học đã được chứng minh cùng công nghệ
                        hiện đại giúp bạn học hiệu quả và luôn có động lực.
                    </p>
                </div>

                {/* Feature grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {features.map((feature) => (
                        <Card
                            key={feature.title}
                            className="group border-border/50 hover:border-primary/30 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 hover:-translate-y-1"
                        >
                            <CardContent className="p-5 sm:p-6">
                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-primary/15 transition-colors">
                                    <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                                </div>
                                <h3 className="font-semibold text-base sm:text-lg mb-1.5 sm:mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
