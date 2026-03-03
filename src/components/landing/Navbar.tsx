// Navbar - responsive navigation bar with auth links
"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
    { label: "Tính năng", href: "#features" },
    { label: "Cách hoạt động", href: "#how" },
    { label: "Bảng giá", href: "#pricing" },
    { label: "Câu hỏi", href: "#faq" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? "bg-background/80 backdrop-blur-lg border-b shadow-sm"
                : "bg-transparent"
                }`}
        >
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16 sm:h-20 overflow-hidden">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0">
                    <Image
                        src="/images/logo.png"
                        alt="DHV-Lingoo"
                        width={56}
                        height={56}
                        className="h-10 w-10 sm:h-14 sm:w-14 rounded-full transition-transform group-hover:scale-110 object-cover drop-shadow-lg"
                    />
                    <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent whitespace-nowrap">
                        DHV-Lingoo
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden lg:flex items-center gap-1 flex-shrink min-w-0">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="px-3 xl:px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent whitespace-nowrap"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden lg:flex items-center gap-2 xl:gap-3 flex-shrink-0">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button
                        asChild
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-500/90 hover:to-blue-600/90 shadow-lg shadow-cyan-500/25"
                    >
                        <Link href="/register">Bắt đầu ngay</Link>
                    </Button>
                </div>

                {/* Mobile menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                        <SheetTitle className="flex items-center gap-3 mb-6">
                            <Image
                                src="/images/logo.png"
                                alt="DHV-Lingoo"
                                width={48}
                                height={48}
                                className="h-12 w-12 rounded-full object-cover drop-shadow-lg"
                            />
                            <span className="font-bold text-lg">DHV-Lingoo</span>
                        </SheetTitle>
                        <nav className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className="px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <div className="border-t my-4" />
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/login">Đăng nhập</Link>
                            </Button>
                            <Button asChild className="w-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-600">
                                <Link href="/register">Bắt đầu ngay</Link>
                            </Button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
