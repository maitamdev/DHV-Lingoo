<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Flutter-3.27-02569B?style=for-the-badge&logo=flutter" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase" />
  <img src="https://img.shields.io/badge/Groq-AI-FF6B35?style=for-the-badge" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript" />
</p>

# 🦊 DHV-Lingoo

> **Nền tảng học tiếng Anh hiện đại** — Kết hợp AI, Flashcards thông minh và Gamification để mang lại trải nghiệm học tập thú vị và hiệu quả.

**DHV-Lingoo** là đồ án chuyên ngành được phát triển bởi sinh viên Đại học Hùng Vương TPHCM, với mục tiêu xây dựng một hệ thống học tiếng Anh toàn diện trên cả nền tảng **Web** và **Mobile**.

---

## ✨ Tính năng chính

### 📚 Hệ thống bài học

- **Khóa học A1 → C2** với lộ trình học rõ ràng
- **Bài học tương tác** với Text-to-Speech (TTS) phát âm chuẩn
- **Từ vựng theo chủ đề** — bảng chữ cái, số đếm, chào hỏi, và nhiều hơn nữa
- **Roadmap trực quan** — theo dõi tiến trình học tập dễ dàng

### 🎴 Flashcard "Túi Mù" hàng ngày _(Daily Mystery Bag)_

- **5 thẻ flashcard mỗi ngày** — ngẫu nhiên theo từng người dùng
- **Thuật toán Seeded Random** — đảm bảo mỗi user nhận thẻ khác nhau
- **5 độ hiếm**: Common (45%) · Uncommon (25%) · Rare (15%) · Epic (10%) · Legendary (5%)
- **Animation 3D** — lật thẻ, mở túi, hiệu ứng particles, confetti celebration
- **XP Rewards** — 2-15 XP theo độ hiếm của thẻ
- **Dark mode, Accessibility, Responsive** — hỗ trợ đầy đủ

### 🤖 AI Chatbot — Lingoo Fox

- **Trợ lý AI** sử dụng Groq LPU cho tốc độ phản hồi cực nhanh
- **Giải đáp ngữ pháp**, dịch thuật, giải thích từ vựng
- **Giao diện chat** thân thiện, dễ sử dụng

### 📊 Gamification & Theo dõi tiến trình

- **Hệ thống XP** — tích điểm qua bài học và flashcards
- **Leaderboard** — bảng xếp hạng toàn trường
- **Achievements** — hệ thống thành tựu
- **Streak tracking** — theo dõi chuỗi ngày học liên tiếp
- **Biểu đồ tiến trình** với Recharts

### 📖 Từ điển Anh-Việt

- **Tra cứu nhanh** với kết quả chính xác
- **Phát âm TTS** cho từng từ
- **Ví dụ sử dụng** trong ngữ cảnh thực tế

### 🔔 Thông báo & Nhắc nhở

- **Push Notifications** — nhắc nhở học tập hàng ngày
- **Web Push API** với service worker

### 👨‍💼 Admin Dashboard

- **Quản lý khóa học** — CRUD đầy đủ
- **Quản lý bài học & từ vựng**
- **Thống kê người dùng**

---

## 🛠️ Tech Stack

### Web Application

| Layer             | Technology                        |
| ----------------- | --------------------------------- |
| **Framework**     | Next.js 16 (App Router, React 19) |
| **Language**      | TypeScript 5                      |
| **Styling**       | Tailwind CSS 4, Radix UI          |
| **Database**      | Supabase (PostgreSQL)             |
| **Auth**          | Supabase Auth (Email/Password)    |
| **AI**            | Groq SDK (LLaMA)                  |
| **Charts**        | Recharts                          |
| **Icons**         | Lucide React                      |
| **Notifications** | Web Push API                      |
| **Deployment**    | Vercel                            |

### Mobile Application

| Layer                | Technology               |
| -------------------- | ------------------------ |
| **Framework**        | Flutter 3.27 (Dart)      |
| **State Management** | StatefulWidget, GoRouter |
| **Backend**          | Supabase Flutter SDK     |
| **Charts**           | fl_chart                 |
| **TTS**              | flutter_tts              |
| **Images**           | cached_network_image     |
| **Fonts**            | Google Fonts             |

---

## 📁 Cấu trúc dự án

```
DHV-Lingoo/
├── src/                          # Next.js Web Application
│   ├── app/                      # App Router pages
│   │   ├── admin/                # Admin dashboard
│   │   ├── api/                  # API routes
│   │   │   ├── ai-chat/          # Groq AI chatbot endpoint
│   │   │   ├── daily-flashcards/ # Daily flashcard API
│   │   │   └── send-push/        # Push notification endpoint
│   │   ├── auth/                 # Auth callback
│   │   ├── dashboard/            # Main user dashboard
│   │   │   ├── achievements/     # Achievements page
│   │   │   ├── courses/          # Course & lesson pages
│   │   │   ├── flashcards/       # Daily Flashcard Mystery Bag
│   │   │   ├── practice/         # Practice exercises
│   │   │   ├── roadmap/          # Learning roadmap
│   │   │   ├── settings/         # User settings
│   │   │   └── subscription/     # Subscription plans
│   │   ├── login/                # Login page
│   │   └── register/             # Register page
│   ├── components/               # Reusable React components
│   │   ├── auth/                 # Auth components
│   │   ├── dashboard/            # Dashboard UI components
│   │   ├── flashcard/            # 12 Flashcard components
│   │   ├── landing/              # Landing page sections
│   │   └── ui/                   # Base UI components (shadcn)
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities & config
│   │   ├── supabase/             # Supabase client (server/client)
│   │   ├── flashcard-*.ts        # Flashcard logic
│   │   └── ...                   # Other utilities
│   └── types/                    # TypeScript type definitions
│
├── dhv_lingoo_app/               # Flutter Mobile Application
│   ├── lib/
│   │   ├── config/               # App configuration
│   │   ├── models/               # Data models
│   │   ├── screens/              # App screens
│   │   │   ├── auth/             # Login/Register
│   │   │   ├── courses/          # Course screens
│   │   │   ├── dashboard/        # Dashboard
│   │   │   └── flashcard/        # Flashcard feature
│   │   └── utils/                # Utility functions
│   └── test/                     # Flutter tests
│
├── supabase/                     # Supabase configuration
│   ├── schema/                   # Database schema (SQL)
│   └── seeds/                    # Seed data (A1 course)
│
└── public/                       # Static assets
```

---

## 🚀 Bắt đầu

### Yêu cầu hệ thống

- **Node.js** ≥ 18
- **Flutter** ≥ 3.27
- **Supabase** account (free tier OK)

### 1. Clone repository

```bash
git clone https://github.com/maitamdev/DHV-Lingoo.git
cd DHV-Lingoo
```

### 2. Web Application

```bash
# Cài đặt dependencies
npm install

# Tạo file .env.local
cp .env.example .env.local
# Cập nhật NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY

# Chạy development server
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

### 3. Flutter Mobile App

```bash
cd dhv_lingoo_app

# Cài đặt dependencies
flutter pub get

# Tạo file .env
cp .env.example .env
# Cập nhật SUPABASE_URL và SUPABASE_ANON_KEY

# Chạy ứng dụng
flutter run
```

---

## 🗃️ Biến môi trường

Tạo file `.env.local` (Web) hoặc `.env` (Flutter):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GROQ_API_KEY=your-groq-api-key
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

---

## 📊 Database Schema

Dự án sử dụng **Supabase PostgreSQL** với các bảng chính:

| Table                 | Mô tả                            |
| --------------------- | -------------------------------- |
| `profiles`            | Thông tin người dùng, XP, streak |
| `courses`             | Khóa học (A1, A2, B1...)         |
| `lessons`             | Bài học trong khóa học           |
| `lesson_vocabularies` | Từ vựng theo bài học             |
| `user_progress`       | Tiến trình học của user          |
| `achievements`        | Hệ thống thành tựu               |
| `user_achievements`   | Thành tựu đã đạt được            |
| `push_subscriptions`  | Đăng ký push notification        |

---

## 🧪 Testing

```bash
# Web - TypeScript check
npx tsc --noEmit

# Web - ESLint
npm run lint

# Web - Build production
npm run build

# Flutter - Unit tests
cd dhv_lingoo_app && flutter test
```

---

## 📦 Deployment

### Web (Vercel)

Dự án được deploy tự động trên **Vercel** khi push lên nhánh `main`.

### Mobile (Flutter)

```bash
# Build APK
flutter build apk --release

# Build iOS (requires macOS)
flutter build ios --release
```

---

## 👥 Tác giả

| Vai trò       | Tên                      |
| ------------- | ------------------------ |
| **Developer** | Mai Tâm                  |
| **Trường**    | Đại học Hùng Vương TPHCM |
| **Môn học**   | Đồ án chuyên ngành       |

---

## 📄 License

Dự án này được phát triển cho mục đích học tập tại Đại học Hùng Vương TPHCM.

---

<p align="center">
  Made with ❤️ by <b>Mai Tâm</b> — Đại học Hùng Vương TPHCM
</p>
