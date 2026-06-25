import { NextResponse, type NextRequest } from 'next/server'

const SUPABASE_COOKIE = 'supabase.auth.token'
const BASE64_PREFIX = 'base64-'

function base64urlDecode(str: string): string {
  const std = str.replace(/-/g, '+').replace(/_/g, '/')
  return atob(std.padEnd(Math.ceil(std.length / 4) * 4, '='))
}

function assembleRawCookie(request: NextRequest): string | null {
  // Try direct cookie first; fall back to chunks (.0, .1, …)
  const direct = request.cookies.get(SUPABASE_COOKIE)?.value
  if (direct) return direct
  const chunks: string[] = []
  for (let i = 0; ; i++) {
    const chunk = request.cookies.get(`${SUPABASE_COOKIE}.${i}`)?.value
    if (chunk === undefined) break
    chunks.push(chunk)
  }
  return chunks.length ? chunks.join('') : null
}

function decodeSessionJSON(raw: string): string | null {
  try {
    // @supabase/ssr stores values as "base64-<base64url-encoded-JSON>"
    if (raw.startsWith(BASE64_PREFIX)) {
      return base64urlDecode(raw.slice(BASE64_PREFIX.length))
    }
    return raw // plain JSON fallback (older ssr versions)
  } catch {
    return null
  }
}

function isAccessTokenValid(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    const claims = JSON.parse(base64urlDecode(payload))
    return typeof claims.exp === 'number' && claims.exp > Date.now() / 1000
  } catch {
    return false
  }
}

function hasValidSession(request: NextRequest): boolean {
  const raw = assembleRawCookie(request)
  if (!raw) return false
  const json = decodeSessionJSON(raw)
  if (!json) return false
  try {
    const session = JSON.parse(json) as { access_token?: string }
    if (session.access_token) return isAccessTokenValid(session.access_token)
  } catch {}
  return false
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const isApiRoute = pathname.startsWith('/api/admin/')

  // Strip any client-supplied spoofed header up front
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-admin-authorized')

  if (!hasValidSession(request)) {
    if (isApiRoute) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Session is valid — stamp header so route handlers skip re-checking
  requestHeaders.set('x-admin-authorized', '1')
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
