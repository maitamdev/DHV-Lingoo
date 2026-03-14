import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { results, totalWords, xpEarned } = body;

  if (xpEarned && xpEarned > 0) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('xp')
      .eq('id', user.id)
      .single();

    await supabase
      .from('profiles')
      .update({ xp: (profile?.xp || 0) + xpEarned })
      .eq('id', user.id);
  }

  return NextResponse.json({ saved: true, totalWords, xpEarned });
}