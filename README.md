# 🎓 DHV-Lingoo

Nền tảng học tiếng Anh hiện đại với AI, flashcards và theo dõi tiến trình.

## 🚀 Tech Stack

### Web (Next.js)
- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **AI**: Groq LLM (Llama 3.3)
- **Charts**: Recharts
- **Styling**: CSS Modules + Google Fonts
- **Auth**: Supabase Auth

### Mobile (Flutter)
- **Framework**: Flutter 3.27
- **Backend**: Supabase Flutter SDK
- **Charts**: fl_chart
- **Navigation**: GoRouter
- **TTS**: flutter_tts

## 📁 Project Structure

```
├── src/                    # Next.js web app
│   ├── app/               # Pages and API routes
│   ├── components/        # React components
│   └── lib/              # Utilities and Supabase client
├── dhv_lingoo_app/        # Flutter mobile app
│   ├── lib/
│   │   ├── config/       # Theme, routes, Supabase config
│   │   ├── screens/      # All app screens
│   │   └── services/     # Auth service
│   └── pubspec.yaml
├── supabase/              # Database seeds and config
└── public/               # Static assets
```

## 🏃 Getting Started

### Web
```bash
npm install
npm run dev
```

### Flutter
```bash
cd dhv_lingoo_app
flutter pub get
flutter run
```

## 📱 Features
- 📖 Interactive lessons with vocabulary and TTS
- 📊 Real-time progress tracking and XP system
- 🏆 Leaderboard and achievements
- 🔍 EN-VI Dictionary (Free Dictionary API + AI)
- 🤖 AI Chatbot (Lingoo Fox)
- 🔔 Push notification study reminders
- 📱 Flutter mobile app

## 👥 Team
- DHV University - Software Engineering Project
