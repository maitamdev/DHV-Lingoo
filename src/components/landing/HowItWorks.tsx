// HowItWorks section - step-by-step platform guide
import { BookOpen, Clock, Trophy } from "lucide-react";

const steps = [
    {
        number: "01",
        icon: BookOpen,
        title: "Chọn khóa học",
        description:
            "Duyệt thư viện khóa học tiếng Anh — từ luyện thi IELTS đến giao tiếp hàng ngày.",
        color: "from-cyan-500 to-blue-600",
    },
    {
        number: "02",
        icon: Clock,
        title: "Học trong 10 phút",
        description:
            "Mỗi bài học ngắn gọn để bạn học mọi lúc mọi nơi. Đọc, nghe và thực hành — không cần ngồi cả giờ.",
        color: "from-blue-500 to-indigo-600",
    },
    {
        number: "03",
        icon: Trophy,
        title: "Luyện tập & giữ streak",
        description:
            "Làm trắc nghiệm, ôn flashcards và xem streak tăng dần. Sự kiên trì là chìa khóa thành thạo.",
        color: "from-teal-500 to-cyan-600",
    },
];

export default function HowItWorks() {
    return (
        <section id="how" className="py-16 sm:py-24 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
                    <p className="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase mb-2 sm:mb-3">
                        Cách hoạt động
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                        Bắt đầu học chỉ với{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            3 bước đơn giản
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-lg">
                        Không cần cài đặt phức tạp. Chỉ cần chọn khóa học và bắt đầu cải
                        thiện tiếng Anh ngay hôm nay.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">
                    {/* Connection line (desktop) */}
                    <div className="hidden md:block absolute top-20 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-cyan-300 via-blue-300 to-teal-300 dark:from-cyan-800 dark:via-blue-800 dark:to-teal-800" />

                    {/* Vertical line (mobile) */}
                    <div className="md:hidden absolute top-0 bottom-0 left-8 w-0.5 bg-gradient-to-b from-cyan-300 via-blue-300 to-teal-300 dark:from-cyan-800 dark:via-blue-800 dark:to-teal-800" />

                    {steps.map((step) => (
                        <div key={step.number} className="relative text-center md:text-center group">
                            {/* Mobile row layout */}
                            <div className="flex md:block items-start gap-5 md:gap-0">
                                {/* Step icon */}
                                <div className="relative mx-0 md:mx-auto mb-0 md:mb-6 shrink-0">
                                    <div
                                        className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center md:mx-auto shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <step.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                                    </div>
                                    <span className="absolute -top-2 -right-2 h-6 w-6 sm:h-7 sm:w-7 rounded-full bg-background border-2 border-primary flex items-center justify-center text-[10px] sm:text-xs font-bold text-primary">
                                        {step.number}
                                    </span>
                                </div>

                                <div className="text-left md:text-center flex-1">
                                    <h3 className="text-lg sm:text-xl font-semibold mb-1.5 sm:mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed max-w-xs md:mx-auto">
                                        {step.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
