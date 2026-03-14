import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className=\"min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100\">
      <div className=\"text-center max-w-md px-6\">
        <div className=\"text-8xl font-black text-gray-200 mb-4\">404</div>
        <h1 className=\"text-2xl font-bold text-gray-900 mb-2\">Khong tim thay trang</h1>
        <p className=\"text-sm text-gray-500 mb-6\">
          Trang ban dang tim khong ton tai hoac da bi di chuyen.
        </p>
        <Link
          href=\"/dashboard\"
          className=\"inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/25\"
        >
          Ve trang chu
        </Link>
      </div>
    </div>
  );
}