import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
    try {
        const supabase = await createClient();

        // Lấy thông tin user hiện tại đang đăng nhập
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Bạn phải đăng nhập trước khi chạy lệnh này!" }, { status: 401 });
        }

        // Cập nhật role của user này thành admin trong bảng profiles
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", user.id);

        if (updateError) {
            console.error("Lỗi cập nhật role:", updateError);
            return NextResponse.json({ error: "Lỗi cập nhật: " + updateError.message }, { status: 500 });
        }

        const successHtml = `
            <html>
                <body style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #f8fafc;">
                    <div style="background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center;">
                        <h1 style="color: #10b981; margin-bottom: 16px;">🎉 Chúc mừng!</h1>
                        <p style="color: #334155; font-size: 18px; line-height: 1.5;">
                            Tài khoản <b>${user.email}</b> của bạn đã được nâng cấp thành <b>Quản trị viên (Admin)</b> thành công!
                        </p>
                        <a href="/dashboard" style="display: inline-block; margin-top: 24px; padding: 12px 24px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            Quay lại Dashboard
                        </a>
                    </div>
                </body>
            </html>
        `;

        return new NextResponse(successHtml, {
            headers: {
                "Content-Type": "text/html; charset=utf-8"
            }
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to upgrade account" },
            { status: 500 }
        );
    }
}
