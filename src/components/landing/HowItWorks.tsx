import { BookOpen, Clock, Trophy } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: BookOpen,
        title: "Chọn khóa học",
        description:
            "Duyệt thư viện khóa học tiếng Anh — từ luyện thi IELTS đến giao tiếp hàng ngày.",
        color: "from-violet-500 to-purple-600",
    },
    {
        number: "02",
        icon: Clock,
        title: "Học trong 10 phút",
        description:
            "Mỗi bài học ngắn gọn để bạn học mọi lúc mọi nơi. Đọc, nghe và thực hành — không cần ngồi cả giờ.",
        color: "from-sky-500 to-blue-600",
    },
    {
        number: "03",
        icon: Trophy,
        title: "Luyện tập & giữ streak",
        description:
            "Làm trắc nghiệm, ôn flashcards và xem streak tăng dần. Sự kiên trì là chìa khóa thành thạo.",
        color: "from-amber-500 to-orange-600",
    },
];

export default function HowItWorks() {
    return (
        <section id="how" className="py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">
                        Cách hoạt động
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                        Bắt đầu học chỉ với{" "}
                        <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                            3 bước đơn giản
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Không cần cài đặt phức tạp. Chỉ cần chọn khóa học và bắt đầu cải
                        thiện tiếng Anh ngay hôm nay.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connection line (desktop) */}
                    <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-violet-300 via-sky-300 to-amber-300 dark:from-violet-800 dark:via-sky-800 dark:to-amber-800" />

                    {steps.map((step) => (
                        <div key={step.number} className="relative text-center group">
                            {/* Step number circle */}
                            <div className="relative mx-auto mb-6">
                                <div
                                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                    <step.icon className="h-7 w-7 text-white" />
                                </div>
                                <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-xs font-bold text-primary">
                                    {step.number}
                                </span>
                            </div>

                            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                            <p className="text-muted-foreground leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
