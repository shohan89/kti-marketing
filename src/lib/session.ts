/**
 * Admin session handling.
 *
 * The previous implementation only base64-decoded the JWT payload and checked
 * `exp` — it never verified the signature, so any forged token with a future
 * `exp` was accepted. Tokens are now validated against Supabase's /auth/v1/user
 * endpoint, which checks the signature server-side. No extra secret is needed
 * beyond the anon key that is already configured.
 *
 * Verified tokens are cached in-memory for a short window so the common case
 * (many requests within one page load) does not issue a network call each time.
 */

export const ACCESS_COOKIE = 'admin_jwt'
export const REFRESH_COOKIE = 'admin_refresh'

/** How long a successful verification is trusted before re-checking with Supabase. */
const VERIFY_CACHE_MS = 60_000

export interface SessionUser {
  id: string
  email?: string
}

export interface SessionTokens {
  accessToken: string
  refreshToken: string | null
  /** Access-token lifetime in seconds, as reported by Supabase. */
  expiresIn: number
}

function supabaseUrl(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? null
}

function anonKey(): string | null {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? null
}

// ---------------------------------------------------------------------------
// Verification
// ---------------------------------------------------------------------------

const verifyCache = new Map<string, { user: SessionUser; expiresAt: number }>()

function pruneCache(now: number) {
  if (verifyCache.size < 256) return
  for (const [token, entry] of verifyCache) {
    if (entry.expiresAt <= now) verifyCache.delete(token)
  }
}

/**
 * Cheap pre-check: reject structurally invalid or already-expired tokens before
 * spending a network round-trip. This is NOT a substitute for verification —
 * a token passing this check is still unverified until Supabase confirms it.
 */
function looksWellFormed(token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 3 || !parts[2]) return false
  try {
    const std = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = std + '==='.slice(0, (4 - (std.length % 4)) % 4)
    const claims = JSON.parse(atob(padded))
    return typeof claims.exp === 'number' && claims.exp > Date.now() / 1000
  } catch {
    return false
  }
}

/**
 * Verify an access token's signature and expiry with Supabase.
 * Returns the authenticated user, or null if the token is invalid.
 */
export async function verifyAccessToken(token: string | undefined | null): Promise<SessionUser | null> {
  if (!token) return null

  const now = Date.now()
  const cached = verifyCache.get(token)
  if (cached && cached.expiresAt > now) return cached.user

  if (!looksWellFormed(token)) return null

  const url = supabaseUrl()
  const key = anonKey()
  if (!url || !key) {
    console.error('[session] Supabase env vars missing — cannot verify admin session.')
    return null
  }

  let res: Response
  try {
    res = await fetch(`${url}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: key },
      cache: 'no-store',
    })
  } catch (e) {
    // Network failure must fail closed — never assume a token is valid.
    console.error('[session] Token verification request failed:', e)
    return null
  }

  if (!res.ok) return null

  try {
    const body = (await res.json()) as { id?: string; email?: string }
    if (!body?.id) return null
    const user: SessionUser = { id: body.id, email: body.email }
    pruneCache(now)
    verifyCache.set(token, { user, expiresAt: now + VERIFY_CACHE_MS })
    return user
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Sign in / refresh / sign out
// ---------------------------------------------------------------------------

interface TokenResponse {
  access_token?: string
  refresh_token?: string
  expires_in?: number
}

async function tokenRequest(grant: string, payload: Record<string, string>): Promise<SessionTokens | null> {
  const url = supabaseUrl()
  const key = anonKey()
  if (!url || !key) return null

  let res: Response
  try {
    res = await fetch(`${url}/auth/v1/token?grant_type=${grant}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: key },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })
  } catch (e) {
    console.error(`[session] ${grant} request failed:`, e)
    return null
  }

  if (!res.ok) return null

  const body = (await res.json().catch(() => null)) as TokenResponse | null
  if (!body?.access_token) return null

  return {
    accessToken: body.access_token,
    refreshToken: body.refresh_token ?? null,
    expiresIn: body.expires_in ?? 3600,
  }
}

export function signInWithPassword(email: string, password: string): Promise<SessionTokens | null> {
  return tokenRequest('password', { email, password })
}

export function refreshSession(refreshToken: string): Promise<SessionTokens | null> {
  return tokenRequest('refresh_token', { refresh_token: refreshToken })
}

/** Best-effort server-side revocation so the refresh token cannot be reused. */
export async function revokeSession(accessToken: string): Promise<void> {
  const url = supabaseUrl()
  const key = anonKey()
  if (!url || !key) return
  verifyCache.delete(accessToken)
  try {
    await fetch(`${url}/auth/v1/logout`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, apikey: key },
    })
  } catch {
    // Cookie is cleared regardless; a failed revoke must not block sign-out.
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers
// ---------------------------------------------------------------------------

export interface SessionCookie {
  name: string
  value: string
  options: {
    httpOnly: boolean
    secure: boolean
    sameSite: 'lax'
    path: string
    maxAge: number
  }
}

function cookieOptions(maxAge: number): SessionCookie['options'] {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge,
  }
}

/** Cookies to set after a successful sign-in or refresh. */
export function sessionCookies(tokens: SessionTokens): SessionCookie[] {
  const cookies: SessionCookie[] = [
    { name: ACCESS_COOKIE, value: tokens.accessToken, options: cookieOptions(tokens.expiresIn) },
  ]
  if (tokens.refreshToken) {
    // Refresh token outlives the access token so sessions survive past ~1h.
    cookies.push({
      name: REFRESH_COOKIE,
      value: tokens.refreshToken,
      options: cookieOptions(60 * 60 * 24 * 30),
    })
  }
  return cookies
}

/** Cookies that clear the session. */
export function clearedSessionCookies(): SessionCookie[] {
  return [
    { name: ACCESS_COOKIE, value: '', options: cookieOptions(0) },
    { name: REFRESH_COOKIE, value: '', options: cookieOptions(0) },
  ]
}
