import { NextResponse, type NextRequest } from 'next/server'
import {
  ACCESS_COOKIE,
  REFRESH_COOKIE,
  refreshSession,
  sessionCookies,
  verifyAccessToken,
} from '@/lib/session'
import { resolveModuleForPath, getRequiredLevel, hasLevel, type PermissionMap } from '@/lib/permissions'

// Deliberately NOT importing '@/lib/prisma' here (it pulls in @supabase/supabase-js).
// This file must stay pure Edge-Runtime code — no Node built-ins, no heavy SDKs —
// so it compiles as classic Edge middleware rather than Next 16's Node.js-only
// `proxy.ts` primitive, which Cloudflare's adapter cannot deploy at all today
// (see the note above `middleware()` below). This does the one DB lookup it
// needs with a bare `fetch` straight to Supabase's PostgREST endpoint.
async function fetchAdminAccess(supabaseId: string): Promise<{ isActive: boolean; permissions: PermissionMap } | null> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  try {
    const res = await fetch(
      `${url}/rest/v1/AdminUser?supabaseId=eq.${encodeURIComponent(supabaseId)}&select=isActive,permissions`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } },
    )
    if (!res.ok) return null
    const rows = await res.json() as { isActive: boolean; permissions: PermissionMap }[]
    return rows[0] ?? null
  } catch {
    return null
  }
}

// Kept as the classic `middleware.ts` convention (not Next 16's `proxy.ts`
// rename) — Next compiles `proxy.ts` exclusively to the Node.js runtime
// (confirmed via `functions-config-manifest.json`), which
// @opennextjs/cloudflare refuses to deploy ("Node.js middleware is not
// currently supported"). `middleware.ts` still compiles as true Edge
// middleware, which the Cloudflare adapter fully supports. This must live
// under src/ (alongside app/) — at the repo root it is silently ignored,
// which previously left every /admin page unprotected.
export async function middleware(request: NextRequest) {
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
    const access = await fetchAdminAccess(user.id)
    const permissions = access?.isActive ? access.permissions : null

    if (!access?.isActive) {
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
