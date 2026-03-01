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
  content text, -- Can be markdown, HTML, or JSON
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
