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
    .select('streak, longest_streak, last_activity')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const now = new Date();
  const lastActivity = profile.last_activity ? new Date(profile.last_activity) : null;
  let newStreak = 1;

  if (lastActivity) {
    const diffHours = (now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60);
    if (diffHours < 48 && diffHours > 20) {
      newStreak = (profile.streak || 0) + 1;
    } else if (diffHours < 20) {
      newStreak = profile.streak || 1;
    }
  }

  const longestStreak = Math.max(newStreak, profile.longest_streak || 0);

  const { error } = await supabase
    .from('profiles')
    .update({ streak: newStreak, longest_streak: longestStreak, last_activity: now.toISOString() })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ streak: newStreak, longestStreak });
}