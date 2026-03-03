-- =============================================
-- DHV-Lingoo: Lesson Progress Tracking
-- =============================================

create table if not exists public.lesson_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  course_id uuid references public.courses(id) on delete cascade,
  completed boolean default false,
  score integer default 0,
  xp_earned integer default 0,
  completed_at timestamptz default now(),
  created_at timestamptz default now(),
  
  unique(user_id, lesson_id)
);

-- RLS
alter table public.lesson_progress enable row level security;
create policy "Users can view own progress" on public.lesson_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.lesson_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.lesson_progress for update using (auth.uid() = user_id);

-- Allow all users to read progress for leaderboard
create policy "Users can view all progress for leaderboard" on public.lesson_progress for select using (true);
