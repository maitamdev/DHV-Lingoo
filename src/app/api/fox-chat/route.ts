import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Bạn là Lingoo 🦊, trợ lý AI dạy tiếng Anh chuyên nghiệp của nền tảng DHV-Lingoo. Bạn có kiến thức sâu rộng về ngôn ngữ học tiếng Anh.

## NGUYÊN TẮC BẮT BUỘC:
1. **Phiên âm chuẩn IPA** — LUÔN dùng ký hiệu IPA quốc tế (ví dụ: /təˈmɒr.əʊ/), TUYỆT ĐỐI KHÔNG viết kiểu phiên âm Việt hóa như "tơ-mô-rô", "hê-lô", "oát-đờ-phắc". Đây là sai lầm nghiêm trọng.
2. **Trả lời bằng tiếng Việt**, giải thích rõ ràng, có cấu trúc.
3. **Khi giải thích từ vựng**, dùng format:
   - **Từ** (loại từ) /phiên âm IPA/: nghĩa tiếng Việt
   - Ví dụ: "Câu ví dụ tiếng Anh" → Nghĩa tiếng Việt
4. **Khi giải thích ngữ pháp**, cho công thức + 2-3 ví dụ cụ thể.
5. **Giữ câu trả lời ngắn gọn** (dưới 200 từ), đi thẳng vào vấn đề.
6. Dùng emoji phù hợp để dễ đọc nhưng không lạm dụng.
7. Nếu người dùng viết tiếng Anh, trả lời bằng tiếng Anh rồi giải thích bằng tiếng Việt bên dưới.
8. Khi người dùng hỏi cách phát âm, mô tả vị trí lưỡi, cách đặt môi cụ thể.

## VÍ DỤ ĐÚNG:
Q: "tomorrow nghĩa là gì?"
A: **tomorrow** (adv.) /təˈmɒr.əʊ/ 🇬🇧 hoặc /təˈmɑːr.oʊ/ 🇺🇸: ngày mai
📝 Ví dụ: "I will see you tomorrow" → Tôi sẽ gặp bạn ngày mai.
💡 Mẹo nhớ: "to" + "morrow" (morrow là từ cổ nghĩa là "buổi sáng ngày kế tiếp").`;

interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

// ===== GROQ =====
async function callGroq(messages: any[]): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
        messages,
        model: "llama-3.3-70b-versatile",
        temperature: 0.7,
        max_tokens: 400,
    });
    return chatCompletion.choices[0]?.message?.content || "";
}

// ===== HUGGINGFACE (fallback) =====
async function callHuggingFace(messages: any[]): Promise<string> {
    const HF_TOKEN = process.env.HUGGINGFACE_API_KEY;
    if (!HF_TOKEN) throw new Error("No HuggingFace API key");

    const res = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "Qwen/Qwen2.5-72B-Instruct",
                messages: messages,
                max_tokens: 400,
                temperature: 0.7,
            }),
        }
    );

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`HuggingFace error ${res.status}: ${errText}`);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || "";
}

export async function POST(req: Request) {
    try {
        const { message, history = [] }: { message: string; history: ChatMessage[] } = await req.json();

        if (!message?.trim()) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const messages = [
            { role: "system" as const, content: SYSTEM_PROMPT },
            ...history.slice(-10).map((m: ChatMessage) => ({
                role: m.role as "user" | "assistant",
                content: m.content,
            })),
            { role: "user" as const, content: message },
        ];

        let reply = "";
        let provider = "groq";

        // Try Groq first, fallback to HuggingFace
        try {
            reply = await callGroq(messages);
        } catch (groqError: any) {
            console.warn("Groq failed, switching to HuggingFace:", groqError.message);
            provider = "huggingface";
            try {
                reply = await callHuggingFace(messages);
            } catch (hfError: any) {
                console.error("HuggingFace also failed:", hfError.message);
                return NextResponse.json({
                    reply: "⚠️ Cả hai AI đều đang bận. Bạn thử lại sau vài giây nhé! 🦊",
                    provider: "none"
                });
            }
        }

        if (!reply) {
            reply = "Xin lỗi, Lingoo chưa hiểu. Bạn hỏi lại nhé! 🦊";
        }

        return NextResponse.json({ reply, provider });
    } catch (error: any) {
        console.error("Fox chat error:", error);
        return NextResponse.json(
            { error: "Lingoo đang nghỉ ngơi, thử lại sau nhé! 🦊💤" },
            { status: 500 }
        );
    }
}
// Groq primary HF fallback
// IPA phonetic standards
