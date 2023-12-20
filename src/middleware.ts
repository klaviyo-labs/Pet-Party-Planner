import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const loginRedirect = NextResponse.redirect(new URL('/login', request.url))
  let token = request.cookies.get('token')

  if (!token) {
    return loginRedirect
  }

  // Validate the token by making an API call
  const validateToken = async () => {
    try {
      const res = await fetch("/api/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Token validation failed");
    } catch (error) {
      console.error(error);
      return loginRedirect
    }
  };

  await validateToken()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard', '/registered', '/parties', "/parties/:path*"],
}