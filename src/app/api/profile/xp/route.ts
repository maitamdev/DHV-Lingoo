import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { xpAmount, source } = body;

  if (!xpAmount || typeof xpAmount !== 'number' || xpAmount <= 0) {
    return NextResponse.json({ error: 'Invalid XP amount' }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('xp')
    .eq('id', user.id)
    .single();

  const currentXp = profile?.xp || 0;
  const newXp = currentXp + xpAmount;

  const { error } = await supabase
    .from('profiles')
    .update({ xp: newXp })
    .eq('id', user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ xp: newXp, added: xpAmount, source });
}