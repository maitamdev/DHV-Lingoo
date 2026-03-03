-- =============================================
-- DHV-Lingoo: Push Subscriptions Table
-- =============================================

create table if not exists public.push_subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  endpoint text not null,
  keys_p256dh text not null,
  keys_auth text not null,
  reminder_time text default '20:00',
  enabled boolean default true,
  created_at timestamptz default now(),
  
  unique(user_id, endpoint)
);

-- RLS
alter table public.push_subscriptions enable row level security;
create policy "Users can manage own subscriptions" on public.push_subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
