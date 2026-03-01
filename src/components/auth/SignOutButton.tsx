"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";

export default function SignOutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSignOut = async () => {
        setLoading(true);
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <Button
            onClick={handleSignOut}
            disabled={loading}
            variant="ghost"
            className="text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-200"
        >
            {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <>
                    <LogOut className="h-4 w-4 mr-2" />
                    Đăng xuất
                </>
            )}
        </Button>
    );
}
