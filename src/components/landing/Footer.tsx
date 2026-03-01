import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Github, Twitter, Youtube } from "lucide-react";

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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
                <div className="grid md:grid-cols-5 gap-10">
                    {/* Brand + description */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                                <Sparkles className="h-5 w-5 text-primary-foreground" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                                DHVLingoo
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mb-6">
                            Nền tảng học tiếng Anh hiện đại được xây dựng cho sự kiên trì.
                            Bài học tương tác, trắc nghiệm thông minh và theo dõi tiến trình
                            thời gian thực.
                        </p>
                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                                    aria-label={social.label}
                                >
                                    <social.icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h4 className="font-semibold text-sm mb-4">{title}</h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-muted-foreground">
                        © 2026 DHVLingoo. Mọi quyền được bảo lưu.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Được xây dựng với ❤️ bởi sinh viên DHV
                    </p>
                </div>
            </div>
        </footer>
    );
}
