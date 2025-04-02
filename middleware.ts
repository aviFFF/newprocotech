import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(request: NextRequest) {
  // DEVELOPMENT ONLY: Bypass authentication check
  return NextResponse.next()

  // Get the pathname from the URL
  const { pathname } = request.nextUrl

  // Skip middleware for non-admin routes and API routes
  if (!pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    // Return early if Supabase environment variables are not set
    if (!supabaseUrl || !supabaseKey) {
      console.error('Middleware: Supabase environment variables not set')
      return NextResponse.redirect(new URL('/login?error=config', request.url))
    }

    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the session from the request cookies
    const { data: { session } } = await supabase.auth.getSession()

    // If there is no session, redirect to login
    if (!session) {
      console.log('Middleware: No session found, redirecting to login')
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }

    console.log('Middleware: Session found for user', session.user.email)
    console.log('Middleware: User metadata', session.user.user_metadata)
    console.log('Middleware: User role', session.user.user_metadata?.role)

    // Check if the user has the admin role
    if (session.user?.user_metadata?.role !== 'admin') {
      console.log('Middleware: User is not an admin, redirecting to login')
      return NextResponse.redirect(new URL('/login?error=permission', request.url))
    }

    // Allow the request to proceed
    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login?error=error', request.url))
  }
}

export const config = {
  matcher: ['/admin/:path*'],
} 