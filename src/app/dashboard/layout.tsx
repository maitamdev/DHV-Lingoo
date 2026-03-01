import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import SignOutButton from "@/components/auth/SignOutButton";

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
        <div className="min-h-screen bg-[#f5f7fb] flex">
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
                    <NavItem href="/dashboard" icon="dashboard" label="Dashboard" active />
                    <NavItem href="/dashboard" icon="courses" label="Khóa học" />
                    <NavItem href="/dashboard" icon="flashcards" label="Flashcards" />
                    <NavItem href="/dashboard" icon="practice" label="Luyện tập" />
                    <NavItem href="/dashboard" icon="achievements" label="Thành tựu" />
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

// Navigation Item Component
function NavItem({
    href,
    icon,
    label,
    active = false,
}: {
    href: string;
    icon: string;
    label: string;
    active?: boolean;
}) {
    const iconMap: Record<string, React.ReactNode> = {
        dashboard: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
        ),
        courses: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        flashcards: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
        ),
        practice: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        ),
        achievements: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
        ),
    };

    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${active
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
        >
            {iconMap[icon]}
            {label}
        </Link>
    );
}
