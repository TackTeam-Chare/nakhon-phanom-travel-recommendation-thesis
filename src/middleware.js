import { NextResponse } from 'next/server'

export function middleware(req) {
  const token = req.cookies.get('token') || null;

  // ตรวจสอบว่าเส้นทางเป็น /dashboard และไม่มี token
  if (req.nextUrl.pathname.startsWith('/dashboard') && !token) {
    return NextResponse.redirect(new URL('/auth/login', req.url)); // รีไดเรกไปที่หน้า login
  }
  
  return NextResponse.next(); // อนุญาตให้เข้าถึงเส้นทางอื่นๆ ได้ตามปกติ
}

// ระบุเส้นทางที่ต้องการให้ middleware ทำงาน
export const config = {
  matcher: ['/dashboard/:path*'],
}
