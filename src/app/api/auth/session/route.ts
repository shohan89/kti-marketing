import { NextRequest, NextResponse } from 'next/server'
import { clientKey, rateLimit, tooManyRequests } from '@/lib/rate-limit'
import {
  ACCESS_COOKIE,
  clearedSessionCookies,
  revokeSession,
  sessionCookies,
  signInWithPassword,
} from '@/lib/session'

// Lives outside /api/admin/* on purpose: middleware gates that prefix, and the
// sign-in endpoint must be reachable before a session exists.
export const dynamic = 'force-dynamic'

/** Sign in and issue HttpOnly session cookies. */
export async function POST(request: NextRequest) {
  const limit = rateLimit(clientKey(request, 'login'), 10, 15 * 60_000)
  if (!limit.ok) {
    return tooManyRequests(limit.retryAfter, 'Too many sign-in attempts. Please try again later.')
  }

  let email: unknown
  let password: unknown
  try {
    ({ email, password } = await request.json())
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
    return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
  }

  const tokens = await signInWithPassword(email.trim(), password)
  if (!tokens) {
    // Deliberately generic — do not reveal whether the account exists.
    return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  for (const { name, value, options } of sessionCookies(tokens)) {
    response.cookies.set(name, value, options)
  }
  return response
}

/** Sign out: revoke server-side, then clear cookies. */
export async function DELETE(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value
  if (token) await revokeSession(token)

  const response = NextResponse.json({ success: true })
  for (const { name, value, options } of clearedSessionCookies()) {
    response.cookies.set(name, value, options)
  }
  return response
}
