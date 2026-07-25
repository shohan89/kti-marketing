import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/session'

function tokenFromCookieHeader(cookieHeader: string): string | undefined {
  // Parse the session cookie from the raw Cookie header — more reliable than
  // cookies() from next/headers on Cloudflare Workers where cookies() can
  // return empty for POST route handlers even when the Cookie header is present.
  const prefix = `${ACCESS_COOKIE}=`
  return cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(prefix))
    ?.slice(prefix.length)
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  const h = await headers()

  // Fast path: middleware verified the session and stamped this header. It is
  // trustworthy because middleware deletes any client-supplied copy first and
  // its matcher covers every route that calls this function.
  if (h.get('x-admin-authorized') === '1') return null

  // Fallback: verify the token's signature with Supabase. Decoding the payload
  // is not enough — an unsigned token would otherwise be accepted.
  const token = tokenFromCookieHeader(h.get('cookie') ?? '')
  const user = await verifyAccessToken(token)
  if (user) return null

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
