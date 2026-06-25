import { NextResponse, type NextRequest } from 'next/server'

function base64urlDecode(str: string): string {
  const std = str.replace(/-/g, '+').replace(/_/g, '/')
  // Pad to the nearest multiple of 4
  const padded = std + '==='.slice(0, (4 - std.length % 4) % 4)
  return atob(padded)
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
  const token = request.cookies.get('admin_jwt')?.value
  if (!token) return false
  return isAccessTokenValid(token)
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
