import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import ReviewClient from './ReviewClient';

export const metadata: Metadata = {
  title: 'On tap tu vung | DHV-Lingoo',
  description: 'On tap tu vung bang phuong phap lap lai cach quang',
};

export default async function ReviewPage() {
  const supabase = await createClient();

  const { data: words } = await supabase
    .from('lesson_vocabularies')
    .select('id, word, phonetic, meaning, example')
    .limit(100);

  return <ReviewClient words={words || []} />;
}