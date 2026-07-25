import { NextResponse, type NextRequest } from 'next/server'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  refreshSession,
  sessionCookies,
  verifyAccessToken,
} from '@/lib/session'

// Next 16 renamed the `middleware` file convention to `proxy`. This must live
// under src/ (alongside app/) — at the repo root it is silently ignored, which
// previously left every /admin page unprotected.
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminPage = pathname.startsWith('/admin')
  const isAdminApi  = pathname.startsWith('/api/admin/')
  const isLoginPage = pathname.startsWith('/admin/login')

  // Pass through anything that isn't an admin route or is the login page itself
  if ((!isAdminPage && !isAdminApi) || isLoginPage) {
    return NextResponse.next()
  }

  // Strip any client-supplied spoofed header up front
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-admin-authorized')

  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value
  let user = await verifyAccessToken(accessToken)

  // Access token expired or rejected — try the refresh token before giving up,
  // so an admin isn't kicked out every time the ~1h access token lapses.
  let refreshed: ReturnType<typeof sessionCookies> | null = null
  if (!user) {
    const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value
    if (refreshToken) {
      const tokens = await refreshSession(refreshToken)
      if (tokens) {
        user = await verifyAccessToken(tokens.accessToken)
        if (user) refreshed = sessionCookies(tokens)
      }
    }
  }

  if (!user) {
    if (isAdminApi) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Session is valid — stamp header so route handlers skip re-verifying the token
  requestHeaders.set('x-admin-authorized', '1')
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  for (const { name, value, options } of refreshed ?? []) {
    response.cookies.set(name, value, options)
  }
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
