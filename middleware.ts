import { NextRequest, NextResponse } from 'next/server';

export default function middleware(request: NextRequest) {
  // Only handle localized routes, leave everything else untouched
  return NextResponse.next();
}

export const config = {
  // Only match localized routes
  matcher: ['/(es|cs)/:path*']
};