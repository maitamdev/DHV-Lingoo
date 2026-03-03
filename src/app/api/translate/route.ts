import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
    try {
        const { text, mode, direction } = await req.json();

        if (!text?.trim()) {
            return NextResponse.json({ error: "Vui lòng nhập nội dung" }, { status: 400 });
        }

        let systemPrompt = "";
        let userPrompt = "";

        if (mode === "translate") {
            const fromLang = direction === "en-vi" ? "tiếng Anh" : "tiếng Việt";
            const toLang = direction === "en-vi" ? "tiếng Việt" : "tiếng Anh";
            systemPrompt = `Bạn là dịch giả chuyên nghiệp. Dịch chính xác từ ${fromLang} sang ${toLang}. Chỉ trả về bản dịch, không giải thích thêm. Giữ nguyên format và xuống dòng.`;
            userPrompt = text;
        } else if (mode === "dictionary") {
            systemPrompt = `Bạn là từ điển Anh-Việt chuyên nghiệp. Khi nhận một từ/cụm từ tiếng Anh, trả về CHÍNH XÁC theo format JSON (không markdown, không code block):
{
  "word": "từ gốc",
  "phonetic": "phiên âm IPA",
  "meanings": [
    {
      "partOfSpeech": "loại từ (noun/verb/adj/adv...)",
      "definitions": [
        {
          "meaning": "nghĩa tiếng Việt",
          "example": "câu ví dụ tiếng Anh",
          "exampleVi": "nghĩa câu ví dụ"
        }
      ]
    }
  ],
  "synonyms": ["từ đồng nghĩa 1", "từ đồng nghĩa 2"],
  "antonyms": ["từ trái nghĩa 1"],
  "tips": "mẹo ghi nhớ hoặc ghi chú thêm"
}
Nếu input là tiếng Việt, hãy tra nghĩa Anh và trả về format tương tự nhưng với word là từ tiếng Anh tương ứng.`;
            userPrompt = text;
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 800,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "";

        if (mode === "dictionary") {
            try {
                // Try to parse JSON from response
                const jsonMatch = reply.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const parsed = JSON.parse(jsonMatch[0]);
                    return NextResponse.json({ result: parsed, mode: "dictionary" });
                }
            } catch {
                // If JSON parse fails, return raw text
            }
            return NextResponse.json({ result: reply, mode: "dictionary", raw: true });
        }

        return NextResponse.json({ result: reply, mode: "translate" });
    } catch (error: unknown) {
        console.error("Translate error:", error);
        return NextResponse.json(
            { error: "Lỗi dịch thuật, vui lòng thử lại!" },
            { status: 500 }
        );
    }
}
