import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "DHVLingoo có thật sự miễn phí không?",
        answer:
            "Có! Gói Miễn phí bao gồm 3 khóa học đầy đủ, trắc nghiệm cơ bản và theo dõi tiến trình — không cần thẻ tín dụng. Bạn có thể nâng cấp lên Pro bất cứ lúc nào để truy cập không giới hạn.",
    },
    {
        question: "Tính năng theo dõi tiến trình thời gian thực hoạt động thế nào?",
        answer:
            "Tiến trình của bạn được đồng bộ thời gian thực trên mọi thiết bị thông qua hệ thống dữ liệu trực tiếp. Khi bạn hoàn thành bài học, làm trắc nghiệm hoặc ôn flashcards, bảng điều khiển cập nhật ngay lập tức — bao gồm XP, độ chính xác và số ngày streak.",
    },
    {
        question: "Nếu tôi quên học một ngày thì sao? Streak có bị mất không?",
        answer:
            "Với gói Miễn phí, bỏ lỡ một ngày sẽ reset streak. Người dùng Pro có \"Bảo vệ Streak\" giúp duy trì streak tối đa 2 ngày nếu bạn bỏ lỡ. Chúng tôi cũng gửi nhắc nhở để bạn không bao giờ quên.",
    },
    {
        question: "Dữ liệu của tôi có được bảo mật không?",
        answer:
            "Hoàn toàn! Chúng tôi tuân thủ tiêu chuẩn bảo mật hàng đầu bao gồm mã hóa dữ liệu, xác thực an toàn và kiểm soát truy cập nghiêm ngặt. Chúng tôi không bao giờ bán dữ liệu cá nhân cho bên thứ ba.",
    },
    {
        question: "Giảng viên hoặc admin có thể tự tạo khóa học không?",
        answer:
            "Có! Gói Nhóm bao gồm Công cụ Quản trị Nội dung nơi giảng viên có thể tạo khóa học, bài học, trắc nghiệm và bộ flashcards. Bạn cũng có thể quản lý nhóm sinh viên và xem thống kê cấp lớp.",
    },
    {
        question: "DHVLingoo cung cấp những loại nội dung gì?",
        answer:
            "Chúng tôi cung cấp khóa học có cấu trúc (IELTS, TOEFL, giao tiếp hàng ngày), trắc nghiệm tương tác với phản hồi tức thì, flashcards với lặp lại ngắt quãng, và bài luyện nói. Nội dung mới được cập nhật hàng tuần.",
    },
];

export default function FAQ() {
    return (
        <section id="faq" className="py-24 bg-muted/30">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">
                        Câu hỏi thường gặp
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                        Bạn thắc mắc?{" "}
                        <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                            Chúng tôi giải đáp
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Những câu hỏi thường gặp nhất về DHVLingoo.
                    </p>
                </div>

                {/* Accordion */}
                <Accordion type="single" collapsible className="w-full space-y-3">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border rounded-xl px-6 bg-card data-[state=open]:shadow-md transition-shadow"
                        >
                            <AccordionTrigger className="text-left font-medium hover:no-underline py-5">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}
