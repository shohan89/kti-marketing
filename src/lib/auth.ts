import { NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'

const SUPABASE_COOKIE = 'supabase.auth.token'
const BASE64_PREFIX = 'base64-'

function base64urlDecode(str: string): string {
  const std = str.replace(/-/g, '+').replace(/_/g, '/')
  return atob(std.padEnd(Math.ceil(str.length / 4) * 4, '='))
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

async function isSessionValid(): Promise<boolean> {
  const cookieStore = await cookies()

  // Try direct cookie first, then chunked (supabase.auth.token.0, .1, …)
  let raw = cookieStore.get(SUPABASE_COOKIE)?.value ?? null
  if (!raw) {
    const chunks: string[] = []
    for (let i = 0; ; i++) {
      const chunk = cookieStore.get(`${SUPABASE_COOKIE}.${i}`)?.value
      if (chunk === undefined) break
      chunks.push(chunk)
    }
    if (chunks.length) raw = chunks.join('')
  }
  if (!raw) return false

  // @supabase/ssr encodes values as "base64-<base64url-encoded-JSON>"
  const json = raw.startsWith(BASE64_PREFIX)
    ? base64urlDecode(raw.slice(BASE64_PREFIX.length))
    : raw

  try {
    const session = JSON.parse(json) as { access_token?: string }
    if (session.access_token) return isAccessTokenValid(session.access_token)
  } catch {}
  return false
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  // Middleware stamps this header when it has already validated the session.
  // The middleware strips any client-supplied value before setting it.
  const headerStore = await headers()
  if (headerStore.get('x-admin-authorized') === '1') return null

  // Fallback: read the Supabase auth cookie directly (same trust model as getSession()).
  if (await isSessionValid()) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
