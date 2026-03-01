import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Groq from "groq-sdk";

// Khởi tạo client Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();

        // 1. Kiểm tra xác thực user
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // 2. Lấy profile user
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("full_name, level, goals, daily_time, interests, ai_roadmap")
            .eq("id", user.id)
            .single();

        if (profileError || !profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        // Nếu đã có roadmap thì trả về luôn không cần gọi AI lại
        if (profile.ai_roadmap && Object.keys(profile.ai_roadmap).length > 0) {
            return NextResponse.json({ roadmap: profile.ai_roadmap });
        }

        // 3. Chuẩn bị Prompt cho Llama 3
        const levelInfo = profile.level || "A1";
        const goalsStr = profile.goals?.join(", ") || "giao tiếp cơ bản";
        const interestsStr = profile.interests?.join(", ") || "nghe, nói";
        const dailyTime = profile.daily_time || 30;
        const name = profile.full_name || "Học viên";

        const prompt = `
Bạn là một chuyên gia thiết kế lộ trình học tiếng Anh xuất sắc.
Hãy thiết kế một lộ trình học trong 4 tuần cho một học viên tên là ${name}.
Thông tin học viên:
- Trình độ hiện tại: ${levelInfo}
- Mục tiêu chính: ${goalsStr}
- Kỹ năng muốn tập trung: ${interestsStr}
- Thời gian học mỗi ngày: ${dailyTime} phút

YÊU CẦU QUAN TRỌNG: 
Chỉ trả về ĐÚNG MỘT chuỗi JSON hợp lệ, không có markdown (không dùng \`\`\`json), không có câu chào đầu/cuối.
Định dạng JSON bắt buộc phải theo cấu trúc sau:
{
  "title": "Tên lộ trình (ngắn gọn, truyền cảm hứng)",
  "description": "Mô tả ngắn gọn về những gì học viên sẽ đạt được sau 4 tuần",
  "weeks": [
    {
      "week_number": 1,
      "focus": "Mục tiêu trọng tâm của tuần này",
      "days": [
        {
          "day_number": 1,
          "topic": "Chủ đề học hôm nay",
          "tasks": ["Nhiệm vụ 1", "Nhiệm vụ 2"]
        }
        // ... (tạo đủ 7 ngày cho mỗi tuần, tổng cộng 4 tuần)
      ]
    }
  ]
}

Hãy thiết kế nội dung thực sự bám sát trình độ ${levelInfo} và mục tiêu ${goalsStr}. 
Chia nhỏ tasks sao cho phù hợp với ${dailyTime} phút/ngày.
Bắt đầu trả về JSON ngay lập tức:`;

        // 4. Gọi Groq AI Llama 3
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Bạn là hệ thống thiết kế chương trình giáo dục. Luôn trả về dữ liệu đúng chuẩn JSON.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
            model: "llama3-70b-8192", // Model mạnh và nhanh nhất của Groq hiện tại cho task này
            temperature: 0.7,
            response_format: { type: "json_object" }, // Ép kiểu JSON
        });

        const resultContent = chatCompletion.choices[0]?.message?.content;

        if (!resultContent) {
            throw new Error("Empty response from AI");
        }

        // 5. Parse JSON
        const roadmapJson = JSON.parse(resultContent);

        // 6. Lưu vào Supabase profiles
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ ai_roadmap: roadmapJson })
            .eq("id", user.id);

        if (updateError) {
            console.error("Lỗi khi lưu roadmap vào DB:", updateError);
            // Vẫn trả về roadmap cho user dù lưu DB lỗi
        }

        // 7. Trả về kết quả
        return NextResponse.json({ roadmap: roadmapJson });

    } catch (error: any) {
        console.error("Error generating roadmap:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate roadmap" },
            { status: 500 }
        );
    }
}
