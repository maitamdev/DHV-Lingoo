'use client';

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className=\"flex items-center justify-center min-h-[60vh]\">
      <div className=\"text-center max-w-sm\">
        <div className=\"text-5xl mb-4\">ðŸ˜µ</div>
        <h2 className=\"text-xl font-bold text-gray-900 mb-2\">Loi tai trang</h2>
        <p className=\"text-sm text-gray-500 mb-4\">{error.message || 'Co loi xay ra khi tai trang nay.'}</p>
        <button
          onClick={reset}
          className=\"px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 transition\"
        >
          Thu lai
        </button>
      </div>
    </div>
  );
}