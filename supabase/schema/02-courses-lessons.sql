-- =============================================
-- DHV-Lingoo: Courses & Lessons Tables
-- =============================================

create table if not exists public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  level text check (level in ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  thumbnail_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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

-- RLS
alter table public.courses enable row level security;
create policy "Anyone can view courses" on public.courses for select using (true);
create policy "Admins can manage courses" on public.courses for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

alter table public.lessons enable row level security;
create policy "Anyone can view lessons" on public.lessons for select using (true);
create policy "Admins can manage lessons" on public.lessons for all
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
