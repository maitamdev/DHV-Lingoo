// Footer section - navigation links and copyright
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Github, Twitter, Youtube } from "lucide-react";

const footerLinks = {
    "Sản phẩm": [
        { label: "Tính năng", href: "#features" },
        { label: "Bảng giá", href: "#pricing" },
        { label: "Khóa học", href: "/courses" },
        { label: "Câu hỏi", href: "#faq" },
    ],
    "Về chúng tôi": [
        { label: "Giới thiệu", href: "/about" },
        { label: "Blog", href: "/blog" },
        { label: "Tuyển dụng", href: "/careers" },
        { label: "Liên hệ", href: "/contact" },
    ],
    "Pháp lý": [
        { label: "Chính sách bảo mật", href: "/privacy" },
        { label: "Điều khoản sử dụng", href: "/terms" },
        { label: "Chính sách cookie", href: "/cookies" },
    ],
};

const socialLinks = [
    { icon: Github, href: "https://github.com/maitamdev/DHV-Lingoo", label: "GitHub" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
    return (
        <footer className="bg-card border-t">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 sm:gap-10">
                    {/* Brand + description */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <Image
                                src="/images/logo.png"
                                alt="DHV-Lingoo"
                                width={56}
                                height={56}
                                className="h-10 w-10 sm:h-14 sm:w-14 rounded-full object-cover drop-shadow-lg"
                            />
                            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                DHV-Lingoo
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed max-w-xs mb-4 sm:mb-6">
                            Nền tảng học tiếng Anh hiện đại được xây dựng cho sự kiên trì.
                            Bài học tương tác, trắc nghiệm thông minh và theo dõi tiến trình
                            thời gian thực.
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-xs sm:text-sm mb-3 sm:mb-4">{title}</h4>
                            <ul className="space-y-2 sm:space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-6 sm:my-8" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                        © 2026 DHV-Lingoo. Mọi quyền được bảo lưu.
                    </p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                        Được xây dựng với ❤️ bởi sinh viên DHV
                    </p>
                </div>
            </div>
        </footer>
    );
}
