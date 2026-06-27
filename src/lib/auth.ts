import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

function base64urlDecode(str: string): string {
  const std = str.replace(/-/g, '+').replace(/_/g, '/')
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

function tokenFromCookieHeader(cookieHeader: string): string | undefined {
  // Parse admin_jwt from raw Cookie header — more reliable than cookies() from
  // next/headers on Cloudflare Workers where cookies() can return empty for
  // POST route handlers even when the Cookie header is present.
  return cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith('admin_jwt='))
    ?.slice('admin_jwt='.length)
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  const h = await headers()

  // Fast path: middleware stamps this after validating the session.
  if (h.get('x-admin-authorized') === '1') return null

  // Fallback: parse admin_jwt directly from the raw Cookie header.
  const token = tokenFromCookieHeader(h.get('cookie') ?? '')
  if (token && isAccessTokenValid(token)) return null

  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
