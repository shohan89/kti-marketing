import { NextResponse, type NextRequest } from 'next/server'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  refreshSession,
  sessionCookies,
  verifyAccessToken,
} from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { resolveModuleForPath, getRequiredLevel, hasLevel, type PermissionMap } from '@/lib/permissions'

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

  // Strip any client-supplied spoofed headers up front
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-admin-authorized')
  requestHeaders.delete('x-admin-user-id')
  requestHeaders.delete('x-admin-user-email')

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

  // Module-level permission check. A module of `null` (dashboard, /api/admin/me,
  // /admin/login) means "no gate beyond being logged in" — skip straight through.
  const moduleKey = resolveModuleForPath(pathname)
  if (moduleKey) {
    let permissions: PermissionMap | null = null
    let isActive = false
    try {
      const row = await prisma.adminUser.findUnique({ where: { supabaseId: user.id } })
      if (row?.isActive) {
        permissions = row.permissions as PermissionMap
        isActive = true
      }
    } catch { /* treat as unauthorized below */ }

    if (!isActive) {
      if (isAdminApi) return NextResponse.json({ error: 'No admin account for this session' }, { status: 403 })
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('next', pathname)
      return NextResponse.redirect(loginUrl)
    }

    const required = getRequiredLevel(request.method)
    if (!hasLevel(permissions, moduleKey, required)) {
      if (isAdminApi) return NextResponse.json({ error: 'You do not have permission to do this.' }, { status: 403 })
      return NextResponse.redirect(new URL('/admin/not-authorized', request.url))
    }
  }

  // Session is valid — stamp headers so route handlers skip re-verifying the token
  // and re-querying identity.
  requestHeaders.set('x-admin-authorized', '1')
  requestHeaders.set('x-admin-user-id', user.id)
  if (user.email) requestHeaders.set('x-admin-user-email', user.email)
  const response = NextResponse.next({ request: { headers: requestHeaders } })
  for (const { name, value, options } of refreshed ?? []) {
    response.cookies.set(name, value, options)
  }
  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
