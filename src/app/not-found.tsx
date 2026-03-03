// 404 Not Found page
import Link from 'next/link';

export default function NotFound() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
            <h1 style={{ fontSize: '96px', fontWeight: 900, color: '#e5e7eb', margin: 0 }}>404</h1>
            <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Không tìm thấy trang</h2>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>Trang bạn tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
            <Link href="/" style={{ padding: '10px 24px', background: '#3b82f6', color: 'white', textDecoration: 'none', fontWeight: 600 }}>
                Về trang chủ
            </Link>
        </div>
    );
}
