// API: Generate daily flashcards using AI (Groq + HuggingFace fallback)
// Called by Vercel Cron at 0h Vietnam time (17:00 UTC previous day)
// Also callable manually for testing

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createClient } from "@/lib/supabase/server";
import { generateFlashcardPrompt, getDailyTopic, parseAIResponse } from "@/lib/flashcard-ai";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // Allow up to 30s for AI generation

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ===== Groq AI Generation =====
async function generateWithGroq(prompt: string): Promise<{ content: string; model: string }> {
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a professional English vocabulary teacher. Always respond with valid JSON arrays only, no additional text.",
      },
      { role: "user", content: prompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.8,
    max_tokens: 1000,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content || "";
  return { content, model: "llama-3.3-70b-versatile" };
}

// ===== HuggingFace Fallback =====
async function generateWithHuggingFace(prompt: string): Promise<{ content: string; model: string }> {
  const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
  if (!HF_TOKEN) throw new Error("No HuggingFace API key");

  const res = await fetch("https://router.huggingface.co/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${HF_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        {
          role: "system",
          content: "You are a professional English vocabulary teacher. Always respond with valid JSON arrays only.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 1000,
      temperature: 0.8,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HuggingFace error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim() || "";
  return { content, model: "Qwen/Qwen2.5-72B-Instruct" };
}

export async function GET(req: Request) {
  try {
    // Verify cron secret (optional, for production security)
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow access without secret in development
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Get today's date in Vietnam timezone (UTC+7)
    const now = new Date();
    const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
    const today = vnTime.toISOString().split("T")[0];

    const supabase = await createClient();

    // Check if today's flashcards already exist
    const { data: existing } = await supabase
      .from("daily_flashcards")
      .select("id")
      .eq("date", today)
      .single();

    if (existing) {
      return NextResponse.json({
        message: "Daily flashcards already generated",
        date: today,
        status: "skipped",
      });
    }

    // Get today's topic
    const topic = getDailyTopic(today);
    const prompt = generateFlashcardPrompt(topic, today);

    let aiContent = "";
    let model = "";

    // Try Groq first, fallback to HuggingFace
    try {
      const result = await generateWithGroq(prompt);
      aiContent = result.content;
      model = result.model;
    } catch (groqError) {
      console.warn("Groq failed, trying HuggingFace:", groqError);
      try {
        const result = await generateWithHuggingFace(prompt);
        aiContent = result.content;
        model = result.model;
      } catch (hfError) {
        console.error("Both AI providers failed:", hfError);
        return NextResponse.json(
          { error: "All AI providers failed", date: today },
          { status: 503 }
        );
      }
    }

    // Parse and validate AI response
    const cards = parseAIResponse(aiContent);

    if (cards.length === 0) {
      return NextResponse.json(
        { error: "AI generated no valid cards", date: today },
        { status: 500 }
      );
    }

    // Save to database
    const { data: inserted, error: insertError } = await supabase
      .from("daily_flashcards")
      .insert({
        date: today,
        cards: cards,
        generated_by: "ai",
        model: model,
        topic: topic,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Failed to save flashcards:", insertError);
      return NextResponse.json(
        { error: "Failed to save flashcards", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Daily flashcards generated successfully",
      date: today,
      topic: topic,
      model: model,
      cards: cards.length,
      id: inserted.id,
      status: "created",
    });
  } catch (error) {
    console.error("Generate daily flashcards error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
// Endpoint: /api/generate-daily-flashcards
// Method: GET triggered by Vercel Cron
// Auth: CRON_SECRET in production
// Timezone: UTC+7 Vietnam
// Idempotent: skips if generated
