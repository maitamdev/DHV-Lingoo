// API: Get daily flashcards for authenticated user
// Uses seeded random to ensure consistent cards per user per day

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getDailySeed, seededRandom, pickRandomItems, getTodayDateString } from "@/lib/flashcard-seed";
import { CARDS_PER_DAY } from "@/lib/flashcard-config";

export const dynamic = "force-dynamic";`n`nexport async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = getTodayDateString();
    const seed = getDailySeed(user.id, today);
    const rng = seededRandom(seed);

    // Fetch all vocabulary
    const { data: allWords, error } = await supabase
      .from("lesson_vocabularies")
      .select("id, word, meaning, phonetic, example, lesson_id");

    if (error || !allWords || allWords.length === 0) {
      return NextResponse.json({ error: "No vocabulary found" }, { status: 404 });
    }

    // Pick 5 random cards using seeded RNG
    const dailyCards = pickRandomItems(allWords, Math.min(CARDS_PER_DAY, allWords.length), rng);

    return NextResponse.json({
      cards: dailyCards,
      date: today,
      userId: user.id,
    });
  } catch (err) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

