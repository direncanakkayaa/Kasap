import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET || "kasap_secret_key_123456" });
  const origin = req.headers.get('origin');
  const response = NextResponse.next();

  // Strict CORS
  const ALLOWED_ORIGINS = ['https://erdogankasap.com', 'https://www.erdogankasap.com'];
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Security Headers
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');

  const isAuthPage = req.nextUrl.pathname.startsWith('/login') || req.nextUrl.pathname.startsWith('/register');

  // Route protection
  if (req.nextUrl.pathname.startsWith('/canli-kesim')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Prevent logged in users from visiting auth pages
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return response;
}

export const config = {
  matcher: ['/canli-kesim/:path*', '/login', '/register'],
};
