import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";
import { NavItem } from "@/components/dashboard/NavItem";
import { CollapsibleSidebar } from "@/components/dashboard/CollapsibleSidebar";
import { MobileMenu } from "@/components/dashboard/MobileMenu";
import { NotificationBell } from "@/components/dashboard/NotificationBell";
import { StudyBanner } from "@/components/dashboard/StudyBanner";
import FoxMascot from "@/components/FoxMascot";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, role")
        .eq("id", user?.id ?? "")
        .single();

    const displayName = profile?.full_name || user?.email?.split("@")[0] || "Học viên";
    const role = profile?.role === "teacher" ? "Giảng viên" : profile?.role === "admin" ? "Quản trị viên" : "Học viên";

    return (
        <div
            className="min-h-screen flex relative"
            style={{
                backgroundImage: "url('/images/dashboard-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundAttachment: "fixed",
            }}
        >
            {/* Collapsible Sidebar */}
            <CollapsibleSidebar
                displayName={displayName}
                role={role}
                avatarUrl={profile?.avatar_url}
                signOutButton={<SignOutButton />}
                isAdmin={profile?.role === "admin"}
            >
                <NavItem href="/dashboard" icon="dashboard" label="Dashboard" exact />
                <NavItem href="/dashboard/roadmap" icon="roadmap" label="Lộ trình" />
                <NavItem href="/dashboard/courses" icon="courses" label="Khóa học" />
                <NavItem href="/dashboard/flashcards" icon="flashcards" label="Flashcards" exact />
                <NavItem href="/dashboard/practice" icon="practice" label="Luyện tập" exact />
                <NavItem href="/dashboard/achievements" icon="achievements" label="Thành tựu" exact />
                <div className="pt-4 mt-4 border-t border-gray-100">
                    <NavItem href="/dashboard/settings" icon="settings" label="Cài đặt" exact />
                </div>
                {profile?.role === "admin" && (
                    <div className="pt-4 mt-4 border-t border-gray-100">
                        <NavItem href="/admin" icon="admin" label="Quản trị Admin" />
                    </div>
                )}
            </CollapsibleSidebar>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image src="/images/logo.png" alt="DHV-Lingoo" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                    <span className="font-bold text-gray-900">DHV-Lingoo</span>
                </Link>
                <div className="flex items-center gap-1">
                    <NotificationBell />
                    <MobileMenu
                        displayName={displayName}
                        role={role}
                        avatarUrl={profile?.avatar_url}
                        signOutButton={<SignOutButton />}
                        isAdmin={profile?.role === "admin"}
                    />
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 pt-14 lg:pt-0 relative">
                {/* Desktop notification bell - top right corner */}
                <div className="hidden lg:block fixed top-4 right-6 z-30">
                    <NotificationBell />
                </div>
                {children}
            </main>

            {/* Fox AI Mascot */}
            <FoxMascot />

            {/* Study Reminder Banner */}
            <StudyBanner />
        </div>
    );
}
