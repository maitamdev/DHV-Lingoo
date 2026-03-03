-- =============================================
-- DHV-Lingoo: Profiles Table
-- Run this in Supabase SQL Editor
-- =============================================

-- Create profiles table linked to auth.users
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text not null,
  date_of_birth date,
  gender text check (gender in ('male', 'female', 'other')),
  avatar_url text,
  country text,
  timezone text,

  -- Learning preferences
  goals text[] default '{}',
  daily_time integer default 30, -- minutes per day
  level text check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  interests text[] default '{}',

  -- Gamification
  xp integer default 0,
  streak integer default 0,
  longest_streak integer default 0,
  last_active_date date,
  
  -- AI Generation
  ai_roadmap jsonb,

  -- Metadata
  role text default 'student' check (role in ('student', 'teacher', 'admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Policy: Users can read their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Policy: Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-update updated_at on changes
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- =============================================
-- DHV-Lingoo: Courses & Lessons Tables
-- =============================================

-- Table: Courses
create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  level text check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Table: Lessons
create table if not exists public.lessons (
  id uuid default gen_random_uuid() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  topics text[] default '{}',
  order_index integer default 0,
  xp_reward integer default 50,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: Courses
alter table public.courses enable row level security;
create policy "Anyone can view courses" on public.courses for select using (true);
create policy "Admins can manage courses" on public.courses for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- RLS: Lessons
alter table public.lessons enable row level security;
create policy "Anyone can view lessons" on public.lessons for select using (true);
create policy "Admins can manage lessons" on public.lessons for all
  using (
    exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- Table: Lesson Videos
create table if not exists public.lesson_videos (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  url text not null,
  title text,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Table: Lesson Vocabularies
create table if not exists public.lesson_vocabularies (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  word text not null,
  phonetic text,
  meaning text not null,
  example text,
  created_at timestamptz default now()
);

-- Table: Lesson Dialogues
create table if not exists public.lesson_dialogues (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  content jsonb not null default '[]'::jsonb, -- Array of { character, text }
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Table: Lesson Quizzes
create table if not exists public.lesson_quizzes (
  id uuid default gen_random_uuid() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  question text not null,
  options jsonb not null default '[]'::jsonb, -- Array of strings
  correct_answer text not null,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- RLS: Relational Lesson Content (Videos, Vocabs, Dialogues, Quizzes)
-- Enable RLS
alter table public.lesson_videos enable row level security;
alter table public.lesson_vocabularies enable row level security;
alter table public.lesson_dialogues enable row level security;
alter table public.lesson_quizzes enable row level security;

-- SELECT Policies (Anyone can view)
create policy "Anyone can view lesson_videos" on public.lesson_videos for select using (true);
create policy "Anyone can view lesson_vocabularies" on public.lesson_vocabularies for select using (true);
create policy "Anyone can view lesson_dialogues" on public.lesson_dialogues for select using (true);
create policy "Anyone can view lesson_quizzes" on public.lesson_quizzes for select using (true);

-- ALL Policies (Admins can manage)
create policy "Admins can manage lesson_videos" on public.lesson_videos for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can manage lesson_vocabularies" on public.lesson_vocabularies for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can manage lesson_dialogues" on public.lesson_dialogues for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins can manage lesson_quizzes" on public.lesson_quizzes for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
