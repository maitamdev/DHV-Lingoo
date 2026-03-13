import { NextResponse } from 'next/server'; import type { NextRequest } from 'next/server'; export function middleware(request: NextRequest) { const response = NextResponse.next(); response.headers.set('X-Content-Type-Options', 'nosniff'); response.headers.set('X-Frame-Options', 'DENY'); return response; } export const config = { matcher: ['/api/:path*'] };

// HSTS X-Frame-Options
