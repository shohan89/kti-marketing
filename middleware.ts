import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Pass through login page and non-admin routes
  if (!pathname.startsWith('/admin') || pathname.startsWith('/admin/login')) {
    return NextResponse.next()
  }

  const isApiRoute = pathname.startsWith('/api/admin/')

  // Strip any client-supplied spoofed header up front
  const requestHeaders = new Headers(request.headers)
  requestHeaders.delete('x-admin-authorized')

  // Tracks any token-refresh cookies Supabase wants to set on the response
  const cookiesToForward: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          cookiesToSet.forEach(c => cookiesToForward.push(c as typeof cookiesToForward[0]))
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Session is valid — stamp the forwarded request so route handlers skip re-checking
  requestHeaders.set('x-admin-authorized', '1')
  const response = NextResponse.next({ request: { headers: requestHeaders } })

  // Forward any refreshed auth cookies to the browser
  cookiesToForward.forEach(({ name, value, options }) =>
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
  )

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
