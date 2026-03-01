import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DHVLingoo – Học Tiếng Anh Nhanh Hơn, Kiên Trì Mỗi Ngày",
  description:
    "DHVLingoo là nền tảng học tiếng Anh hiện đại với bài học tương tác, trắc nghiệm thông minh, flashcards ghi nhớ theo chu kỳ, và theo dõi tiến trình thời gian thực. Bắt đầu miễn phí ngay hôm nay.",
  keywords: [
    "học tiếng Anh",
    "khóa học tiếng Anh",
    "luyện thi IELTS",
    "flashcards",
    "trắc nghiệm",
    "DHV",
    "học ngôn ngữ",
  ],
  openGraph: {
    title: "DHVLingoo – Học Tiếng Anh Nhanh Hơn, Kiên Trì Mỗi Ngày",
    description:
      "Bài học tương tác, trắc nghiệm thông minh, flashcards và theo dõi tiến trình thời gian thực. Thành thạo tiếng Anh cùng DHVLingoo.",
    type: "website",
    siteName: "DHVLingoo",
    locale: "vi_VN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
