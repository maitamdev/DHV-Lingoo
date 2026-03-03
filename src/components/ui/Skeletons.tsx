import "../ui/skeleton.css";

/* ── Base Skeleton Block ── */
function Bone({ className = "" }: { className?: string }) {
    return <div className={`skeleton rounded ${className}`} />;
}

/* ── Dashboard Page Skeleton ── */
export function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-[#f0f2f5] p-6 lg:p-8">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <Bone className="h-8 w-72 mb-2" />
                        <Bone className="h-4 w-48" />
                    </div>
                    <div className="flex items-center gap-3">
                        <Bone className="h-10 w-28" />
                        <Bone className="h-10 w-24" />
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 p-4">
                            <Bone className="h-3 w-20 mb-3" />
                            <Bone className="h-8 w-16 mb-2" />
                            <Bone className="h-2 w-full" />
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-5 mb-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 p-5">
                            <Bone className="h-5 w-40 mb-4" />
                            <Bone className="h-[180px] w-full" />
                        </div>
                    ))}
                </div>

                {/* Course cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 overflow-hidden">
                            <Bone className="h-32 w-full rounded-none" />
                            <div className="p-4">
                                <Bone className="h-4 w-3/4 mb-2" />
                                <Bone className="h-3 w-full mb-1" />
                                <Bone className="h-3 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

/* ── Courses Page Skeleton ── */
export function CoursesSkeleton() {
    return (
        <div className="p-6 lg:p-8 max-w-6xl mx-auto">
            <Bone className="h-8 w-48 mb-2" />
            <Bone className="h-4 w-72 mb-8" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 overflow-hidden">
                        <Bone className="h-40 w-full rounded-none" />
                        <div className="p-5">
                            <Bone className="h-3 w-16 mb-3" />
                            <Bone className="h-5 w-3/4 mb-2" />
                            <Bone className="h-3 w-full mb-1" />
                            <Bone className="h-3 w-5/6 mb-4" />
                            <Bone className="h-9 w-full" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── Settings Page Skeleton ── */
export function SettingsSkeleton() {
    return (
        <div className="p-6 lg:p-8 max-w-3xl mx-auto">
            <Bone className="h-7 w-44 mb-2" />
            <Bone className="h-4 w-80 mb-8" />
            <div className="space-y-6">
                {/* Avatar + Personal info */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <Bone className="h-5 w-36" />
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-5 pb-4 border-b border-gray-100">
                            <Bone className="w-20 h-20 !rounded-full" />
                            <div>
                                <Bone className="h-4 w-24 mb-2" />
                                <Bone className="h-3 w-36" />
                            </div>
                        </div>
                        <Bone className="h-10 w-full" />
                        <div className="grid grid-cols-2 gap-4">
                            <Bone className="h-10 w-full" />
                            <Bone className="h-10 w-full" />
                        </div>
                    </div>
                </div>

                {/* Level cards */}
                <div className="bg-white border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        <Bone className="h-5 w-32" />
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {[...Array(6)].map((_, i) => (
                                <Bone key={i} className="h-16 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Generic Page Skeleton ── */
export function PageSkeleton() {
    return (
        <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            <Bone className="h-8 w-56 mb-2" />
            <Bone className="h-4 w-96 mb-8" />
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-5">
                        <Bone className="h-5 w-2/3 mb-3" />
                        <Bone className="h-3 w-full mb-1" />
                        <Bone className="h-3 w-4/5" />
                    </div>
                ))}
            </div>
        </div>
    );
}
