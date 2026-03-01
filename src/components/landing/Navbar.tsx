"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet";
import { Menu, Sparkles } from "lucide-react";
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
            <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
                        <Sparkles className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                        DHVLingoo
                    </span>
                </Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex items-center gap-1">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop actions */}
                <div className="hidden md:flex items-center gap-3">
                    <Button variant="ghost" asChild>
                        <Link href="/login">Đăng nhập</Link>
                    </Button>
                    <Button
                        asChild
                        className="bg-gradient-to-r from-primary to-violet-600 hover:from-primary/90 hover:to-violet-600/90 shadow-lg shadow-primary/25"
                    >
                        <Link href="/register">Bắt đầu ngay</Link>
                    </Button>
                </div>

                {/* Mobile menu */}
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-72">
                        <SheetTitle className="flex items-center gap-2 mb-6">
                            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                                <Sparkles className="h-4 w-4 text-primary-foreground" />
                            </div>
                            <span className="font-bold text-lg">DHVLingoo</span>
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
                            <Button asChild className="w-full mt-2 bg-gradient-to-r from-primary to-violet-600">
                                <Link href="/register">Bắt đầu ngay</Link>
                            </Button>
                        </nav>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    );
}
