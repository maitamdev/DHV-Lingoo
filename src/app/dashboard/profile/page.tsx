import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from './ProfileClient';

export const metadata: Metadata = {
  title: 'Há»“ sÆ¡ cá»§a tÃ´i | DHV-Lingoo',
  description: 'Xem thÃ´ng tin cÃ¡ nhÃ¢n vÃ  tiáº¿n trÃ¬nh há»c táº­p',
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Vui lÃ²ng Ä‘Äƒng nháº­p Ä‘á»ƒ xem há»“ sÆ¡
      </div>
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, avatar_url, xp, streak, longest_streak, level, goals, interests, daily_time, created_at')
    .eq('id', user.id)
    .single();

  const { data: progress } = await supabase
    .from('lesson_progress')
    .select('id, score, xp_earned, completed_at, lesson_id')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false });

  const { data: courses } = await supabase
    .from('courses')
    .select('id, title');

  const { count: wordCount } = await supabase
    .from('lesson_vocabularies')
    .select('id', { count: 'exact', head: true });

  const { data: userAchievements } = await supabase
    .from('user_achievements')
    .select('achievement_id, unlocked_at')
    .eq('user_id', user.id);

  return (
    <ProfileClient
      profile={{
        fullName: profile?.full_name || user.email?.split('@')[0] || 'User',
        email: user.email || '',
        avatarUrl: profile?.avatar_url || null,
        xp: profile?.xp || 0,
        streak: profile?.streak || 0,
        longestStreak: profile?.longest_streak || 0,
        level: profile?.level || 'A1',
        goals: profile?.goals || [],
        interests: profile?.interests || [],
        dailyTime: profile?.daily_time || 30,
        createdAt: profile?.created_at || user.created_at || new Date().toISOString(),
      }}
      progress={progress || []}
      courses={courses || []}
      wordCount={wordCount || 0}
      achievementCount={userAchievements?.length || 0}
    />
  );
}
// Fetches profile, progress, courses, vocab count, achievements
// Profile page uses 5 parallel Supabase queries
