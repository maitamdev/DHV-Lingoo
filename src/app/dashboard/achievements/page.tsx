// Full achievements page with gamification UI
import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import AchievementsClient from './AchievementsClient';

export const metadata: Metadata = { title: 'Thành tựu | DHV-Lingoo' };

export default async function AchievementsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return <div className="p-6 text-center text-gray-500">Vui lòng đăng nhập</div>;

  // Fetch user stats
  const { data: profile } = await supabase.from('profiles').select('xp, streak, longest_streak, created_at').eq('id', user.id).single();
  const { data: progress } = await supabase.from('lesson_progress').select('id, score').eq('user_id', user.id);
  const { data: courses } = await supabase.from('courses').select('id');
  const { count: wordCount } = await supabase.from('lesson_vocabularies').select('id', { count: 'exact', head: true });
  const { data: userAchievements } = await supabase.from('user_achievements').select('*').eq('user_id', user.id);

  const lessonsCompleted = progress?.length || 0;
  const perfectScores = progress?.filter((p: { score: number }) => p.score >= 100).length || 0;
  const totalScore = progress?.reduce((s: number, p: { score: number }) => s + (p.score || 0), 0) || 0;
  const daysActive = profile?.created_at
    ? Math.floor((Date.now() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const stats = {
    xp: profile?.xp || 0,
    streak: profile?.streak || 0,
    longestStreak: profile?.longest_streak || 0,
    lessonsCompleted,
    coursesCompleted: courses?.length || 0,
    wordsLearned: wordCount || 0,
    daysActive,
    perfectScores,
    totalScore,
    flashcardsRevealed: lessonsCompleted * 5,
    chatMessages: 0,
  };

  return <AchievementsClient stats={stats} userAchievements={userAchievements || []} />;
}
// Server-side stat aggregation
