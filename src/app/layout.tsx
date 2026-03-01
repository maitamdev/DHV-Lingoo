import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
});



export const metadata: Metadata = {
  title: "DHV-Lingoo – Học Tiếng Anh Nhanh Hơn, Kiên Trì Mỗi Ngày",
  description:
    "DHV-Lingoo là nền tảng học tiếng Anh hiện đại với bài học tương tác, trắc nghiệm thông minh, flashcards ghi nhớ theo chu kỳ, và theo dõi tiến trình thời gian thực. Bắt đầu miễn phí ngay hôm nay.",
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
    title: "DHV-Lingoo – Học Tiếng Anh Nhanh Hơn, Kiên Trì Mỗi Ngày",
    description:
      "Bài học tương tác, trắc nghiệm thông minh, flashcards và theo dõi tiến trình thời gian thực. Thành thạo tiếng Anh cùng DHV-Lingoo.",
    type: "website",
    siteName: "DHV-Lingoo",
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
        className={`${playfair.variable} ${playfair.className} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
