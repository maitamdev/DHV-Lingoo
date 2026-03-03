-- =============================================
-- 1. Xóa cột HTML cũ (VÌ CHÚNG TA ĐÃ NÂNG CẤP LÊN RELATIONAL DB DO BẠN ĐỀ XUẤT)
-- =============================================
ALTER TABLE public.lessons DROP COLUMN IF EXISTS content;

-- =============================================
-- 2. TẠO CÁC BẢNG LƯU TRỮ NỘI DUNG BÀI HỌC VỆ TINH
-- =============================================

-- Bảng lưu Video/Audio
create table if not exists public.lesson_videos (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  url text not null,
  title text,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Bảng lưu Từ Vựng
create table if not exists public.lesson_vocabularies (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  word text not null,
  phonetic text,
  meaning text not null,
  example text,
  created_at timestamptz default now()
);

-- Bảng lưu Hội Thoại (JSON)
create table if not exists public.lesson_dialogues (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  content jsonb not null default '[]'::jsonb, -- Array of { character, text }
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Bảng lưu Câu hỏi Trắc Nghiệm (Quizzes)
create table if not exists public.lesson_quizzes (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb, -- Array of strings
  correct_answer text not null,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- =============================================
-- 3. BẬT BẢO MẬT RLS (ROW LEVEL SECURITY)
-- =============================================

alter table public.lesson_videos enable row level security;
alter table public.lesson_vocabularies enable row level security;
alter table public.lesson_dialogues enable row level security;
alter table public.lesson_quizzes enable row level security;

-- Ai đăng nhập cũng được XEM BÀI HỌC
create policy "Anyone can view lesson_videos" on public.lesson_videos for select using (true);
create policy "Anyone can view lesson_vocabularies" on public.lesson_vocabularies for select using (true);
create policy "Anyone can view lesson_dialogues" on public.lesson_dialogues for select using (true);
create policy "Anyone can view lesson_quizzes" on public.lesson_quizzes for select using (true);

-- CHỈ ADMIN MỚI ĐƯỢC QUYỀN THÊM/SỬA/XÓA BÀI HỌC
create policy "Admins can manage lesson_videos" on public.lesson_videos for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can manage lesson_vocabularies" on public.lesson_vocabularies for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can manage lesson_dialogues" on public.lesson_dialogues for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can manage lesson_quizzes" on public.lesson_quizzes for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
