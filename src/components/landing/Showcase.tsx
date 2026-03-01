"use client";

import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, BookOpen, HelpCircle } from "lucide-react";

const previews = [
    {
        id: "dashboard",
        label: "Bảng điều khiển",
        shortLabel: "Dashboard",
        icon: BarChart3,
        src: "/images/dashboard-preview.svg",
        caption:
            "Theo dõi tiến trình với biểu đồ tuần, XP, streaks và tiến độ hoàn thành khóa học — tất cả ở một nơi.",
    },
    {
        id: "lesson",
        label: "Bài học",
        shortLabel: "Bài học",
        icon: BookOpen,
        src: "/images/lesson-preview.svg",
        caption:
            "Bài học tương tác với nội dung phong phú, từ điển trợ giúp, mẹo và ví dụ có hướng dẫn.",
    },
    {
        id: "quiz",
        label: "Trắc nghiệm",
        shortLabel: "Quiz",
        icon: HelpCircle,
        src: "/images/quiz-preview.svg",
        caption:
            "Trắc nghiệm thông minh với tính giờ, phản hồi tức thì và theo dõi điểm số từng phiên.",
    },
];

export default function Showcase() {
    return (
        <section className="py-16 sm:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
                    <p className="text-xs sm:text-sm font-semibold text-primary tracking-wide uppercase mb-2 sm:mb-3">
                        Xem trước sản phẩm
                    </p>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
                        Trải nghiệm{" "}
                        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            DHV-Lingoo
                        </span>{" "}
                        ngay
                    </h2>
                    <p className="text-muted-foreground text-sm sm:text-lg">
                        Khám phá giao diện thực tế — từ bảng điều khiển đến bài học và
                        trắc nghiệm.
                    </p>
                </div>

                {/* Tabs preview */}
                <Tabs defaultValue="dashboard" className="w-full">
                    <TabsList className="grid w-full max-w-sm sm:max-w-md mx-auto grid-cols-3 mb-6 sm:mb-10 h-10 sm:h-12">
                        {previews.map((p) => (
                            <TabsTrigger
                                key={p.id}
                                value={p.id}
                                className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:shadow-sm px-2 sm:px-3"
                            >
                                <p.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                <span className="hidden xs:inline sm:inline">{p.shortLabel}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {previews.map((p) => (
                        <TabsContent key={p.id} value={p.id}>
                            <div className="relative rounded-xl sm:rounded-2xl overflow-hidden border bg-card shadow-xl sm:shadow-2xl shadow-cyan-500/5">
                                <Image
                                    src={p.src}
                                    alt={`${p.label} preview`}
                                    width={800}
                                    height={500}
                                    className="w-full h-auto"
                                />
                            </div>
                            <p className="text-center text-muted-foreground text-xs sm:text-base mt-4 sm:mt-6 max-w-xl mx-auto px-2">
                                {p.caption}
                            </p>
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}
