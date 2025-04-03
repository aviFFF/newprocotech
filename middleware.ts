import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the origin of the request
  const origin = request.headers.get('origin') || '';
  
  // Get the environment
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://proco-tech.vercel.app';
  
  // Define allowed origins
  const allowedOrigins = [
    SITE_URL,
    'https://proco-tech.vercel.app',
    'http://localhost:3000',
  ];

  // Check if the request is for the API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Create a response object to modify
    const response = NextResponse.next();
    
    // Check if the origin is allowed
    if (allowedOrigins.includes(origin)) {
      // Set CORS headers for allowed origins
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    // Handle preflight OPTIONS requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Max-Age': '86400',
        },
      });
    }
    
    return response;
  }
  
  return NextResponse.next();
}

// Define which paths this middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 