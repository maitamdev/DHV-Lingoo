import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Bạn là Lingoo 🦊, trợ lý học tiếng Anh thông minh và thân thiện của DHV-Lingoo.
Quy tắc:
- Trả lời ngắn gọn, dễ hiểu bằng tiếng Việt
- Khi giải thích từ vựng/ngữ pháp, cho ví dụ cụ thể bằng tiếng Anh kèm phiên âm
- Dùng emoji vui vẻ để tạo cảm giác gần gũi
- Khi người dùng hỏi bằng tiếng Anh, trả lời bằng tiếng Anh rồi giải thích bằng tiếng Việt
- Giữ câu trả lời dưới 150 từ
- Đôi khi dùng cụm "Lingoo mách bạn nhé!" khi chia sẻ mẹo học`;

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
