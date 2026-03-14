'use client';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html>
      <body>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
          <div style={{ textAlign: 'center', maxWidth: 400, padding: 24 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>âš ï¸</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1e293b', marginBottom: 8 }}>Co loi xay ra!</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginBottom: 16 }}>{error.message || 'Da co loi khong mong muon.'}</p>
            <button
              onClick={reset}
              style={{ padding: '12px 24px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}
            >
              Thu lai
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}