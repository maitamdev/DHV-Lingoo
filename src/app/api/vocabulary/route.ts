import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = supabase
    .from('lesson_vocabularies')
    .select('id, word, phonetic, meaning, example, lesson_id', { count: 'exact' });

  if (search) {
    query = query.or('word.ilike.%' + search + '%,meaning.ilike.%' + search + '%');
  }

  const { data, error, count } = await query
    .range(offset, offset + limit - 1)
    .order('word', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data, total: count, page: Math.floor(offset / limit) + 1 });
}