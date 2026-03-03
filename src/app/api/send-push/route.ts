import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import webpush from "web-push";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;

webpush.setVapidDetails(
    "mailto:dhvlingoo@gmail.com",
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// Send push notifications to users whose reminder time matches NOW
export async function POST(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createClient();

    // Send midnight greeting to all enabled subscriptions
    const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("*, profiles!inner(last_active_date, full_name, streak)")
        .eq("enabled", true);

    if (!subs || subs.length === 0) {
        return NextResponse.json({ sent: 0 });
    }

    let sent = 0;
    let failed = 0;

    for (const sub of subs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = sub.profiles as any;
        const name = profile?.full_name || "bạn";
        const streak = profile?.streak || 0;

        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
                p256dh: sub.keys_p256dh,
                auth: sub.keys_auth,
            },
        };

        const messages = [
            `Chào ngày mới, ${name}! 🌅 Hãy bắt đầu ngày mới bằng một bài học nhé!`,
            `Ngày mới tràn đầy năng lượng, ${name}! 💪 Cùng chinh phục tiếng Anh nào!`,
            `Good morning, ${name}! ☀️ Một ngày mới, một cơ hội mới để tiến bộ!`,
            `Hey ${name}! 🔥 Ngày mới đến rồi — duy trì streak ${streak} ngày nhé!`,
        ];
        const body = messages[Math.floor(Math.random() * messages.length)];

        try {
            await webpush.sendNotification(
                pushSubscription,
                JSON.stringify({
                    title: "DHV-Lingoo — Chào ngày mới! 🌟",
                    body,
                    url: "/dashboard",
                    tag: "daily-greeting",
                })
            );
            sent++;
        } catch (err: unknown) {
            failed++;
            if (err && typeof err === "object" && "statusCode" in err) {
                const pushErr = err as { statusCode: number };
                if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
                    await supabase.from("push_subscriptions").delete().eq("id", sub.id);
                }
            }
        }
    }

    return NextResponse.json({ sent, failed, total: subs.length });
}
