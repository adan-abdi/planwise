import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Check if the route should be protected
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/auth/profile')
  
  if (isProtectedRoute) {
    // Check for token in cookies (since middleware runs on edge and can't access localStorage)
    const token = request.cookies.get('auth_token')?.value
    
    // If no token is found, redirect to root
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
} 