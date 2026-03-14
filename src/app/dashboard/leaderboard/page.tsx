import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import LeaderboardClient from './LeaderboardClient';

export const metadata: Metadata = {
  title: 'Báº£ng xáº¿p háº¡ng | DHV-Lingoo',
  description: 'Xem thá»© háº¡ng vÃ  so sÃ¡nh tiáº¿n trÃ¬nh vá»›i báº¡n bÃ¨',
};

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: allUsers } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, xp, streak, level')
    .order('xp', { ascending: false })
    .limit(50);

  const currentUserId = user?.id || null;

  return (
    <LeaderboardClient
      users={allUsers || []}
      currentUserId={currentUserId}
    />
  );
}