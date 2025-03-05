import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isProtectedRoute = req.nextUrl.pathname.startsWith('/tours') || 
                           req.nextUrl.pathname.startsWith('/users')

    if (isProtectedRoute && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
)

export const config = {
  matcher: ["/tours/:path*", "/users/:path*"]
}
