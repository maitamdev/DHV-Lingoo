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

        const chatCompletion = await groq.chat.completions.create({
            messages,
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 300,
        });

        const reply = chatCompletion.choices[0]?.message?.content || "Xin lỗi, Lingoo chưa hiểu. Bạn hỏi lại nhé! 🦊";

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Fox chat error:", error);
        return NextResponse.json(
            { error: "Lingoo đang nghỉ ngơi, thử lại sau nhé! 🦊💤" },
            { status: 500 }
        );
    }
}
