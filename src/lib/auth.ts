import { NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'

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

async function isSessionValid(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_jwt')?.value
  if (!token) return false
  return isAccessTokenValid(token)
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  // Middleware stamps this header when it has already validated the session.
  // The middleware strips any client-supplied value before setting it.
  const headerStore = await headers()
  if (headerStore.get('x-admin-authorized') === '1') return null

  // Fallback: read the admin_jwt cookie directly.
  if (await isSessionValid()) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
