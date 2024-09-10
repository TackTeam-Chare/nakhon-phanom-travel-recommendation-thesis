import { NextResponse } from 'next/server'

export function middleware(req) {
  const token = req.cookies.get('token'); // ดึงค่า token จาก cookies

  // ถ้าผู้ใช้ไม่มี token
  if (req.nextUrl.pathname.startsWith('/dashboard') && !token) {
    // Redirect ไปที่หน้า login
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
