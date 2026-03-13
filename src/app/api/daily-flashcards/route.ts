// API: Get daily flashcards for authenticated user
// Reads from AI-generated daily_flashcards, falls back to seeded random

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getDailySeed, seededRandom, pickRandomItems, getTodayDateString, getCardRarity } from "@/lib/flashcard-seed";
import { CARDS_PER_DAY } from "@/lib/flashcard-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = getTodayDateString();

    // Try AI-generated flashcards first
    const { data: dailyData } = await supabase
      .from("daily_flashcards")
      .select("*")
      .eq("date", today)
      .single();

    if (dailyData && dailyData.cards && Array.isArray(dailyData.cards) && dailyData.cards.length > 0) {
      const aiCards = (dailyData.cards as Array<Record<string, string>>).map((card, index) => ({
        id: `ai-${today}-${index}`,
        word: card.word || "",
        meaning: card.meaning || "",
        phonetic: card.phonetic || null,
        example: card.example || null,
        category: card.category || "",
        difficulty: card.difficulty || "medium",
        rarity: getCardRarity(seededRandom(getDailySeed(`ai-${index}`, today))),
      }));

      return NextResponse.json({
        cards: aiCards,
        date: today,
        userId: user.id,
        source: "ai",
        topic: dailyData.topic || "",
        model: dailyData.model || "",
      });
    }

    // Fallback: seeded random from lesson_vocabularies
    const seed = getDailySeed(user.id, today);
    const rng = seededRandom(seed);

    const { data: allWords, error } = await supabase
      .from("lesson_vocabularies")
      .select("id, word, meaning, phonetic, example, lesson_id");

    if (error || !allWords || allWords.length === 0) {
      return NextResponse.json({ error: "No vocabulary found" }, { status: 404 });
    }

    const dailyCards = pickRandomItems(allWords, Math.min(CARDS_PER_DAY, allWords.length), rng);

    return NextResponse.json({
      cards: dailyCards,
      date: today,
      userId: user.id,
      source: "fallback",
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
// AI-first data source
// Source field for render
// Metadata for analytics
