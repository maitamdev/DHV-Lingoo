import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak, longest_streak')
    .eq('id', user.id)
    .single();

  const { data: unlockedIds } = await supabase
    .from('user_achievements')
    .select('achievement_id')
    .eq('user_id', user.id);

  const alreadyUnlocked = new Set((unlockedIds || []).map(a => a.achievement_id));
  const newUnlocks: string[] = [];

  const xp = profile?.xp || 0;
  const streak = profile?.streak || 0;
  const xpMilestones = [
    { id: 'xp-100', target: 100 },
    { id: 'xp-500', target: 500 },
    { id: 'xp-1000', target: 1000 },
    { id: 'xp-5000', target: 5000 },
  ];

  for (const m of xpMilestones) {
    if (xp >= m.target && !alreadyUnlocked.has(m.id)) {
      newUnlocks.push(m.id);
    }
  }

  const streakMilestones = [
    { id: 'streak-3', target: 3 },
    { id: 'streak-7', target: 7 },
    { id: 'streak-30', target: 30 },
  ];

  for (const m of streakMilestones) {
    if (streak >= m.target && !alreadyUnlocked.has(m.id)) {
      newUnlocks.push(m.id);
    }
  }

  if (newUnlocks.length > 0) {
    const inserts = newUnlocks.map(id => ({ user_id: user.id, achievement_id: id }));
    await supabase.from('user_achievements').insert(inserts);
  }

  return NextResponse.json({ newUnlocks, total: alreadyUnlocked.size + newUnlocks.length });
}