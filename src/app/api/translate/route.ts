// Translation API - Free Dictionary API + AI Vietnamese translation via Groq
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Free Dictionary API (real dictionary data) ──
async function lookupDictionary(word: string) {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word.trim().toLowerCase())}`);

    if (!res.ok) return null;

    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;

    const entry = data[0];
    const audio = entry.phonetics?.find((p: { audio?: string }) => p.audio)?.audio || "";

    const meanings = entry.meanings?.map((m: {
        partOfSpeech: string;
        definitions: { definition: string; example?: string }[];
        synonyms?: string[];
        antonyms?: string[];
    }) => ({
        partOfSpeech: m.partOfSpeech,
        definitions: m.definitions?.slice(0, 3).map((d: { definition: string; example?: string }) => ({
            meaning: d.definition,
            meaningVi: "",
            example: d.example || "",
        })) || [],
        synonyms: m.synonyms?.slice(0, 5) || [],
        antonyms: m.antonyms?.slice(0, 5) || [],
    })) || [];

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

// ── AI: Translate English definitions to Vietnamese ──
async function translateMeanings(word: string, dictResult: ReturnType<typeof lookupDictionary> extends Promise<infer T> ? NonNullable<T> : never) {
    try {
        // Collect all English definitions
        const allDefs: string[] = [];
        dictResult.meanings.forEach((m: { definitions: { meaning: string }[] }) => {
            m.definitions.forEach((d: { meaning: string }) => {
                allDefs.push(d.meaning);
            });
        });

        if (allDefs.length === 0) return dictResult;

        const prompt = `Dịch các nghĩa tiếng Anh sau của từ "${word}" sang tiếng Việt. Trả về CHÍNH XÁC một JSON array, mỗi phần tử là nghĩa tiếng Việt tương ứng theo thứ tự. Không thêm giải thích. Không markdown.
Ví dụ input: ["to succeed", "to finish"]
Ví dụ output: ["thành công", "hoàn thành"]

Input: ${JSON.stringify(allDefs)}`;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "Trả về JSON array thuần. Không markdown. Không giải thích." },
                { role: "user", content: prompt },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.2,
            max_tokens: 400,
        });

        const reply = completion.choices[0]?.message?.content || "";
        const jsonMatch = reply.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            const viMeanings: string[] = JSON.parse(jsonMatch[0]);
            let idx = 0;
            dictResult.meanings.forEach((m: { definitions: { meaningVi: string }[] }) => {
                m.definitions.forEach((d: { meaningVi: string }) => {
                    if (idx < viMeanings.length) {
                        d.meaningVi = viMeanings[idx];
                        idx++;
                    }
                });
            });
        }
    } catch (e) {
        console.error("Translation error:", e);
    }

    return dictResult;
}

export async function POST(req: Request) {
    try {
        const { text, mode, direction } = await req.json();

        if (!text?.trim()) {
            return NextResponse.json({ error: "Vui lòng nhập nội dung" }, { status: 400 });
        }

        // ── DICTIONARY MODE ──
        if (mode === "dictionary") {
            // Try real dictionary first
            const dictResult = await lookupDictionary(text);

            if (dictResult) {
                // Add Vietnamese translations
                const enriched = await translateMeanings(text, dictResult);
                return NextResponse.json({ result: enriched, mode: "dictionary" });
            }

            // Fallback: AI lookup (Vietnamese words or not in free API)
            try {
                const aiPrompt = `Bạn là từ điển Anh-Việt. Tra nghĩa của "${text}".
KHÔNG trả về nội dung tục tĩu. Chỉ nội dung phù hợp học tập.
Trả về CHÍNH XÁC JSON (không markdown):
{
  "word": "từ tiếng Anh tương ứng",
  "phonetic": "/phiên âm IPA/",
  "meanings": [{"partOfSpeech": "loại từ", "definitions": [{"meaning": "English definition", "meaningVi": "nghĩa tiếng Việt", "example": "ví dụ"}], "synonyms": [], "antonyms": []}],
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
                console.error("AI fallback error:", e);
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
