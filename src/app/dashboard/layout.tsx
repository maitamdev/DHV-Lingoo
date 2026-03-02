import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";
import { NavItem } from "@/components/dashboard/NavItem";

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
            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-[240px] bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-40">
                {/* Logo */}
                <div className="px-6 py-6">
                    <Link href="/dashboard" className="flex items-center gap-2.5 group">
                        <Image
                            src="/images/logo.png"
                            alt="DHV-Lingoo"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover drop-shadow-md group-hover:scale-105 transition-transform"
                        />
                        <div>
                            <span className="text-lg font-bold text-gray-900 block leading-tight">
                                DHV-Lingoo
                            </span>
                            <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">
                                Premium Learning
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-3 mt-2">
                    <NavItem href="/dashboard" icon="dashboard" label="Dashboard" exact />
                    <NavItem href="/dashboard/roadmap" icon="roadmap" label="Lộ trình" />
                    <NavItem href="/dashboard/courses" icon="courses" label="Khóa học" />
                    <NavItem href="/dashboard/flashcards" icon="flashcards" label="Flashcards" exact />
                    <NavItem href="/dashboard/practice" icon="practice" label="Luyện tập" exact />
                    <NavItem href="/dashboard/achievements" icon="achievements" label="Thành tựu" exact />
                    {profile?.role === "admin" && (
                        <div className="pt-4 mt-4 border-t border-gray-100">
                            <NavItem href="/admin" icon="admin" label="Quản trị Admin" />
                        </div>
                    )}
                </nav>

                {/* User Info */}
                <div className="px-4 py-4 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                            {profile?.avatar_url ? (
                                <Image src={profile.avatar_url} alt={displayName} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                                displayName.charAt(0).toUpperCase()
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                            <p className="text-xs text-gray-400">{role}</p>
                        </div>
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-100 px-4 h-14 flex items-center justify-between">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image src="/images/logo.png" alt="DHV-Lingoo" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
                    <span className="font-bold text-gray-900">DHV-Lingoo</span>
                </Link>
                <SignOutButton />
            </header>

            {/* Main content */}
            <main className="flex-1 lg:ml-[240px] pt-14 lg:pt-0">
                {children}
            </main>
        </div>
    );
}
