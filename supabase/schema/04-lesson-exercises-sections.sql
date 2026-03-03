-- =============================================
-- BẢNG BỔ SUNG: lesson_exercises + lesson_sections
-- Chạy file này trong Supabase SQL Editor TRƯỚC KHI seed data
-- =============================================

-- Bảng lesson_exercises: Bài tập Listening / Speaking / Practice
create table if not exists public.lesson_exercises (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  type text not null check (type in ('listening', 'speaking', 'practice')),
  title text not null,
  instruction text,
  content jsonb not null default '{}'::jsonb,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Bảng lesson_sections: Tóm tắt kiến thức / Homework / Ghi chú
create table if not exists public.lesson_sections (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  type text not null check (type in ('summary', 'homework', 'note', 'tip')),
  title text not null,
  content jsonb not null default '{}'::jsonb,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- RLS
alter table public.lesson_exercises enable row level security;
alter table public.lesson_sections enable row level security;

create policy "Anyone can view lesson_exercises" on public.lesson_exercises for select using (true);
create policy "Anyone can view lesson_sections" on public.lesson_sections for select using (true);
create policy "Admins can manage lesson_exercises" on public.lesson_exercises for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can manage lesson_sections" on public.lesson_sections for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
