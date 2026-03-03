-- =============================================
-- DHV-Lingoo: Profiles Table
-- =============================================

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
  daily_time integer default 30,
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

-- RLS
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Triggers
create or replace function public.handle_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;

create trigger on_profile_updated before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create or replace function public.handle_new_user()
returns trigger as $$ begin insert into public.profiles (id, email) values (new.id, new.email); return new; end; $$ language plpgsql security definer;

create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();
