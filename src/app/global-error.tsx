// Global error page - catches unhandled errors
'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Đã xảy ra lỗi!</h2>
                    <p style={{ color: '#6b7280', marginBottom: '16px' }}>{error.message}</p>
                    <button onClick={reset} style={{ padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                        Thử lại
                    </button>
                </div>
            </body>
        </html>
    );
}
