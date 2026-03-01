import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
            {/* Animated background blobs */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-300 dark:bg-cyan-900 rounded-full mix-blend-multiply dark:mix-blend-screen blur-xl opacity-40 animate-blob" />
                <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen blur-xl opacity-40 animate-blob animation-delay-2000" />
                <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-teal-300 dark:bg-teal-900 rounded-full mix-blend-multiply dark:mix-blend-screen blur-xl opacity-40 animate-blob animation-delay-4000" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 w-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left content */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary font-medium">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                            </span>
                            Theo dõi tiến trình thời gian thực
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]">
                            Học tiếng Anh nhanh hơn.{" "}
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
                                Kiên trì mỗi ngày.
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed">
                            Bài học tương tác, trắc nghiệm thông minh, flashcards ghi nhớ
                            theo chu kỳ, và theo dõi tiến trình thời gian thực — tất cả
                            trong một nền tảng duy nhất.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button
                                size="lg"
                                asChild
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-500/90 hover:to-blue-600/90 shadow-lg shadow-cyan-500/25 text-base h-12 px-8"
                            >
                                <Link href="/register">
                                    Học miễn phí
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                asChild
                                className="text-base h-12 px-8 group"
                            >
                                <Link href="/courses">
                                    <Play className="mr-2 h-4 w-4 group-hover:text-cyan-500 transition-colors" />
                                    Xem khóa học
                                </Link>
                            </Button>
                        </div>

                        {/* Social proof */}
                        <div className="flex items-center gap-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className="h-10 w-10 rounded-full border-2 border-background overflow-hidden"
                                    >
                                        <Image
                                            src={`/images/avatar-${i}.svg`}
                                            alt={`Học viên ${i}`}
                                            width={40}
                                            height={40}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="text-sm">
                                <p className="font-semibold">Được 10,000+ học viên tin dùng</p>
                                <div className="flex items-center gap-1 text-amber-500">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="h-3.5 w-3.5 fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="text-muted-foreground ml-1">4.9/5</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right hero image */}
                    <div className="relative flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-lg">
                            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 to-blue-500/20 rounded-3xl blur-2xl" />
                            <Image
                                src="/images/hero-illustration.svg"
                                alt="DHV-Lingoo - Nền tảng học tiếng Anh tương tác"
                                width={600}
                                height={500}
                                priority
                                className="relative z-10 drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
