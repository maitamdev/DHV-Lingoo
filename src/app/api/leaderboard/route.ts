import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const sortBy = searchParams.get('sort') || 'xp';
  const limit = parseInt(searchParams.get('limit') || '50');

  const orderCol = sortBy === 'streak' ? 'streak' : 'xp';

  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, xp, streak, level')
    .order(orderCol, { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data: data?.map((u, i) => ({ ...u, rank: i + 1 })) || [],
    total: data?.length || 0,
  });
}