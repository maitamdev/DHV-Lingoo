// CollapsibleSidebar - expandable navigation sidebar for dashboard
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CollapsibleSidebar({
    children,
    displayName,
    role,
    avatarUrl,
    signOutButton,
    isAdmin,
}: {
    children: React.ReactNode;
    displayName: string;
    role: string;
    avatarUrl?: string | null;
    signOutButton: React.ReactNode;
    isAdmin: boolean;
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <>
            {/* Sidebar */}
            <aside
                className={`hidden lg:flex flex-col bg-white border-r border-gray-100 fixed inset-y-0 left-0 z-40 transition-all duration-300 ease-in-out ${collapsed ? "w-[72px]" : "w-[240px]"
                    }`}
            >
                {/* Logo */}
                <div className={`py-6 ${collapsed ? "px-3" : "px-6"}`}>
                    <Link href="/dashboard" className="flex items-center gap-2.5 group">
                        <Image
                            src="/images/logo.png"
                            alt="DHV-Lingoo"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover drop-shadow-md group-hover:scale-105 transition-transform flex-shrink-0"
                        />
                        {!collapsed && (
                            <div className="overflow-hidden">
                                <span className="text-lg font-bold text-gray-900 block leading-tight whitespace-nowrap">
                                    DHV-Lingoo
                                </span>
                                <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider whitespace-nowrap">
                                    Premium Learning
                                </span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation - pass collapsed state via context */}
                <nav className={`flex-1 mt-2 ${collapsed ? "px-2" : "px-3"}`}>
                    <SidebarContext.Provider value={collapsed}>
                        {children}
                    </SidebarContext.Provider>
                </nav>

                {/* Toggle Button */}
                <div className={`px-3 py-2 ${collapsed ? "flex justify-center" : ""}`}>
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all rounded-lg text-xs font-medium"
                        title={collapsed ? "Mở rộng" : "Thu gọn"}
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <>
                                <ChevronLeft className="w-4 h-4" />
                                <span>Thu gọn</span>
                            </>
                        )}
                    </button>
                </div>

                {/* User Info */}
                <div className={`py-4 border-t border-gray-100 ${collapsed ? "px-3" : "px-4"}`}>
                    <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden flex-shrink-0">
                            {avatarUrl ? (
                                <Image src={avatarUrl} alt={displayName} width={40} height={40} className="w-full h-full object-cover" />
                            ) : (
                                displayName.charAt(0).toUpperCase()
                            )}
                        </div>
                        {!collapsed && (
                            <>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                                    <p className="text-xs text-gray-400">{role}</p>
                                </div>
                                {signOutButton}
                            </>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main content spacer */}
            <div className={`hidden lg:block flex-shrink-0 transition-all duration-300 ${collapsed ? "w-[72px]" : "w-[240px]"}`} />
        </>
    );
}

/* Context to pass collapsed state to NavItem */
import { createContext, useContext } from "react";
export const SidebarContext = createContext(false);
export function useSidebarCollapsed() {
    return useContext(SidebarContext);
}
