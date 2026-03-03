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

    // Get current time in HH:MM format (Vietnam timezone)
    const now = new Date();
    const vnTime = new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Ho_Chi_Minh",
    }).format(now);

    // Get today's date
    const today = new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Ho_Chi_Minh" }).format(now);

    // Find subscriptions matching reminder time
    const { data: subs } = await supabase
        .from("push_subscriptions")
        .select("*, profiles!inner(last_active_date, full_name)")
        .eq("enabled", true)
        .eq("reminder_time", vnTime);

    if (!subs || subs.length === 0) {
        return NextResponse.json({ sent: 0, time: vnTime });
    }

    let sent = 0;
    let failed = 0;

    for (const sub of subs) {
        // Skip users who already studied today
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profile = sub.profiles as any;
        if (profile?.last_active_date === today) continue;

        const name = profile?.full_name || "bạn";
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
                p256dh: sub.keys_p256dh,
                auth: sub.keys_auth,
            },
        };

        try {
            await webpush.sendNotification(
                pushSubscription,
                JSON.stringify({
                    title: `Chào ${name}! 📚`,
                    body: "Đến giờ học rồi! Dành vài phút luyện tập để duy trì streak nhé 🔥",
                    url: "/dashboard/courses",
                    tag: "daily-reminder",
                })
            );
            sent++;
        } catch (err: unknown) {
            failed++;
            // Remove invalid subscriptions (410 Gone = user unsubscribed)
            if (err && typeof err === "object" && "statusCode" in err) {
                const pushErr = err as { statusCode: number };
                if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
                    await supabase.from("push_subscriptions").delete().eq("id", sub.id);
                }
            }
        }
    }

    return NextResponse.json({ sent, failed, time: vnTime, total: subs.length });
}
