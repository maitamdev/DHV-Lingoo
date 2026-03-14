import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import PracticeClient from './PracticeClient';

export const metadata: Metadata = {
  title: 'Luyá»‡n táº­p | DHV-Lingoo',
  description: 'Luyá»‡n táº­p tiáº¿ng Anh vá»›i cÃ¡c bÃ i táº­p tÆ°Æ¡ng tÃ¡c',
};

export default async function PracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-500">
        Vui lÃ²ng Ä‘Äƒng nháº­p Ä‘á»ƒ luyá»‡n táº­p
      </div>
    );
  }

  const { data: vocabularies } = await supabase
    .from('lesson_vocabularies')
    .select('id, word, phonetic, meaning, example, lesson_id')
    .limit(200);

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, streak, level')
    .eq('id', user.id)
    .single();

  return (
    <PracticeClient
      vocabularies={vocabularies || []}
      userXp={profile?.xp || 0}
      userLevel={profile?.level || 'A1'}
      userId={user.id}
    />
  );
}
