-- =============================================
-- DHV-Lingoo: Notifications Table
-- =============================================

create table if not exists public.notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('lesson_complete', 'xp_milestone', 'streak', 'system', 'achievement')),
  title text not null,
  message text not null,
  is_read boolean default false,
  data jsonb default '{}',
  created_at timestamptz default now()
);

-- RLS
alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "Users can insert own notifications" on public.notifications for insert with check (auth.uid() = user_id);
create policy "System can insert notifications" on public.notifications for insert with check (true);
