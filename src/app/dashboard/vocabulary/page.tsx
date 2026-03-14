import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import VocabularyClient from './VocabularyClient';

export const metadata: Metadata = {
  title: 'So tay tu vung | DHV-Lingoo',
  description: 'Quan ly va on luyen tu vung ca nhan',
};

export default async function VocabularyPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <div className=\"p-6 text-center text-gray-500\">Vui long dang nhap</div>;
  }

  const { data: vocabularies } = await supabase
    .from('lesson_vocabularies')
    .select('id, word, phonetic, meaning, example, lesson_id')
    .limit(500);

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level')
    .eq('id', user.id)
    .single();

  return (
    <VocabularyClient
      words={vocabularies || []}
      userLevel={profile?.level || 'A1'}
      userId={user.id}
    />
  );
}