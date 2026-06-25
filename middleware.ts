import { NextResponse, type NextRequest } from 'next/server'

function getProjectRef(url: string): string {
  return url.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] ?? ''
}

function assembleAuthToken(request: NextRequest, name: string): string | null {
  const direct = request.cookies.get(name)?.value
  if (direct) return direct
  const chunks: string[] = []
  for (let i = 0; ; i++) {
    const chunk = request.cookies.get(`${name}.${i}`)?.value
    if (chunk === undefined) break
    chunks.push(chunk)
  }
  return chunks.length ? chunks.join('') : null
}

function isAccessTokenValid(token: string): boolean {
  try {
    const [, payload] = token.split('.')
    const padded = payload.replace(/-/g, '+').replace(/_/g, '/')
    const claims = JSON.parse(atob(padded.padEnd(Math.ceil(padded.length / 4) * 4, '=')))
    return typeof claims.exp === 'number' && claims.exp > Date.now() / 1000
  } catch {
    return false
  }
}

function hasValidSession(request: NextRequest): boolean {
  const projectRef = getProjectRef(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '')
  if (!projectRef) return false
  const raw = assembleAuthToken(request, `sb-${projectRef}-auth-token`)
  if (!raw) return false
  try {
    const session = JSON.parse(raw) as { access_token?: string }
    if (session.access_token) return isAccessTokenValid(session.access_token)
  } catch {}
  return isAccessTokenValid(raw)
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

  // Session is valid — stamp the forwarded request so route handlers skip re-checking
  requestHeaders.set('x-admin-authorized', '1')
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
