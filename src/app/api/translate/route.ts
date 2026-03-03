import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Free Dictionary API (real dictionary data) ──
async function lookupDictionary(word: string) {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim().toLowerCase())}`);

    if (!res.ok) {
        return null;
    }

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];

    // Extract audio URL
    const audio = entry.phonetics?.find((p: { audio?: string }) => p.audio)?.audio || "";

    // Build structured result
    const meanings = entry.meanings?.map((m: {
        partOfSpeech: string;
        definitions: { definition: string; example?: string }[];
        synonyms?: string[];
        antonyms?: string[];
    }) => ({
        partOfSpeech: m.partOfSpeech,
        definitions: m.definitions?.slice(0, 3).map((d: { definition: string; example?: string }) => ({
            meaning: d.definition,
            example: d.example || "",
        })) || [],
        synonyms: m.synonyms?.slice(0, 5) || [],
        antonyms: m.antonyms?.slice(0, 5) || [],
    })) || [];

    // Collect all synonyms/antonyms
    const allSynonyms = [...new Set(meanings.flatMap((m: { synonyms?: string[] }) => m.synonyms || []))].slice(0, 8);
    const allAntonyms = [...new Set(meanings.flatMap((m: { antonyms?: string[] }) => m.antonyms || []))].slice(0, 5);

    return {
        word: entry.word,
        phonetic: entry.phonetic || entry.phonetics?.[0]?.text || "",
        audio,
        meanings,
        synonyms: allSynonyms,
        antonyms: allAntonyms,
        source: entry.sourceUrls?.[0] || "",
    };
}

export async function POST(req: Request) {
    try {
        const { text, mode, direction } = await req.json();

        if (!text?.trim()) {
            return NextResponse.json({ error: "Vui lòng nhập nội dung" }, { status: 400 });
        }

        // ── DICTIONARY MODE: Real API first, AI fallback ──
        if (mode === "dictionary") {
            // Try real dictionary first (English words)
            const result = await lookupDictionary(text);

            if (result) {
                return NextResponse.json({ result, mode: "dictionary" });
            }

            // Fallback: AI lookup (for Vietnamese words or words not in free API)
            try {
                const aiPrompt = `Bạn là từ điển chuyên nghiệp cho nền tảng học tập. Tra nghĩa của "${text}".
KHÔNG trả về nội dung tục tĩu hay không phù hợp.
Trả về CHÍNH XÁC JSON (không markdown):
{
  "word": "từ tiếng Anh tương ứng",
  "phonetic": "/phiên âm IPA/",
  "meanings": [{"partOfSpeech": "loại từ", "definitions": [{"meaning": "nghĩa", "example": "ví dụ"}], "synonyms": [], "antonyms": []}],
  "synonyms": [],
  "antonyms": [],
  "source": "AI"
}`;

                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: "Trả về JSON thuần, không markdown." },
                        { role: "user", content: aiPrompt },
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.3,
                    max_tokens: 600,
                });

                const reply = completion.choices[0]?.message?.content || "";
                const jsonMatch = reply.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    parsed.source = "AI";
                    return NextResponse.json({ result: parsed, mode: "dictionary" });
                }
            } catch (e) {
                console.error("AI dictionary fallback error:", e);
            }

            return NextResponse.json({
                result: `Không tìm thấy từ "${text}". Hãy kiểm tra chính tả hoặc thử từ khác.`,
                mode: "dictionary",
                raw: true
            });
        }

        // ── TRANSLATE MODE: AI ──
        if (mode === "translate") {
            const fromLang = direction === "en-vi" ? "tiếng Anh" : "tiếng Việt";
            const toLang = direction === "en-vi" ? "tiếng Việt" : "tiếng Anh";
            const systemPrompt = `Bạn là dịch giả chuyên nghiệp. Dịch chính xác từ ${fromLang} sang ${toLang}. Chỉ trả về bản dịch, không giải thích thêm. Giữ nguyên format và xuống dòng.`;

            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: text },
                ],
                model: "llama-3.3-70b-versatile",
                temperature: 0.3,
                max_tokens: 800,
            });

            const reply = chatCompletion.choices[0]?.message?.content || "";
            return NextResponse.json({ result: reply, mode: "translate" });
        }

        return NextResponse.json({ error: "Invalid mode" }, { status: 400 });
    } catch (error: unknown) {
        console.error("Translate error:", error);
        return NextResponse.json(
            { error: "Lỗi xử lý, vui lòng thử lại!" },
            { status: 500 }
        );
    }
}
