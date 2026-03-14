import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [profileRes, lessonsRes, achievementsRes] = await Promise.all([
    supabase.from('profiles').select('xp, streak, longest_streak, level').eq('id', user.id).single(),
    supabase.from('lesson_progress').select('id, score, xp_earned, status').eq('user_id', user.id),
    supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
  ]);

  const profile = profileRes.data;
  const lessons = lessonsRes.data || [];
  const achievements = achievementsRes.data || [];

  const completed = lessons.filter(l => l.status === 'completed');
  const totalXpFromLessons = completed.reduce((s, l) => s + (l.xp_earned || 0), 0);
  const avgScore = completed.length > 0
    ? Math.round(completed.reduce((s, l) => s + (l.score || 0), 0) / completed.length)
    : 0;

  return NextResponse.json({
    profile,
    stats: {
      lessonsCompleted: completed.length,
      totalLessons: lessons.length,
      averageScore: avgScore,
      totalXpFromLessons,
      achievementsCount: achievements.length,
    },
  });
}