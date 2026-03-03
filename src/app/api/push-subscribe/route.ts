import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Save push subscription
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { subscription, reminderTime } = body;

    if (!subscription?.endpoint || !subscription?.keys) {
        return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
    }

    const { error } = await supabase.from("push_subscriptions").upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        keys_p256dh: subscription.keys.p256dh,
        keys_auth: subscription.keys.auth,
        reminder_time: reminderTime || "20:00",
        enabled: true,
    }, { onConflict: "user_id,endpoint" });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}

// Remove push subscription
export async function DELETE(request: NextRequest) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await supabase.from("push_subscriptions")
        .delete()
        .eq("user_id", user.id);

    return NextResponse.json({ success: true });
}
