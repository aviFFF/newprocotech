import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Disable middleware - we're bypassing all auth checks for now
  console.log('Middleware: Bypassed for', request.nextUrl.pathname)
  return NextResponse.next()
}

// Still match admin routes for future use
export const config = {
  matcher: [
    '/admin/:path*'
  ],
} 