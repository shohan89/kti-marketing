import { NextResponse } from 'next/server'
import { headers, cookies } from 'next/headers'

function getProjectRef(url: string): string {
  return url.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1] ?? ''
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

async function isSessionValid(): Promise<boolean> {
  const projectRef = getProjectRef(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '')
  if (!projectRef) return false
  const cookieStore = await cookies()
  const name = `sb-${projectRef}-auth-token`

  // Try direct cookie first, then chunked (Supabase splits large tokens)
  let raw = cookieStore.get(name)?.value ?? null
  if (!raw) {
    const chunks: string[] = []
    for (let i = 0; ; i++) {
      const chunk = cookieStore.get(`${name}.${i}`)?.value
      if (chunk === undefined) break
      chunks.push(chunk)
    }
    if (chunks.length) raw = chunks.join('')
  }
  if (!raw) return false

  try {
    const session = JSON.parse(raw) as { access_token?: string }
    if (session.access_token) return isAccessTokenValid(session.access_token)
  } catch {}
  return isAccessTokenValid(raw)
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  // Middleware stamps this header when it has already validated the session.
  // Trust it — the middleware strips any client-supplied value before setting it.
  const headerStore = await headers()
  if (headerStore.get('x-admin-authorized') === '1') return null

  // Fallback: read the Supabase auth cookie directly (same trust model as getSession()).
  if (await isSessionValid()) return null
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
