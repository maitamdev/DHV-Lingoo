// Dashboard error boundary
'use client';

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="text-6xl">⚠️</div>
            <h2 className="text-xl font-bold">Đã xảy ra lỗi</h2>
            <p className="text-gray-500 text-center max-w-md">{error.message}</p>
            <button
                onClick={reset}
                className="px-6 py-2 bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-colors"
            >
                Thử lại
            </button>
        </div>
    );
}
