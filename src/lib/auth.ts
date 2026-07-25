import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { cache } from 'react'
import { ACCESS_COOKIE, verifyAccessToken } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import type { PermissionMap } from '@/lib/permissions'

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

export interface CurrentAdminUser {
  id: string
  email: string
  name: string | null
  roleLabel: string
  permissions: PermissionMap
  departments: string[]
  isActive: boolean
}

/**
 * Resolves the AdminUser row for the currently logged-in Supabase account.
 * Cached per-request (React `cache()`) since pages, layouts, and API routes
 * within the same request may each ask for it independently.
 */
export const getCurrentAdminUser = cache(async (): Promise<CurrentAdminUser | null> => {
  const h = await headers()

  // Fast path: middleware already verified the session and stamped identity.
  let supabaseId = h.get('x-admin-user-id')
  let email = h.get('x-admin-user-email')

  if (!supabaseId) {
    // Fallback: verify independently, same as requireAdminSession's fallback.
    const token = tokenFromCookieHeader(h.get('cookie') ?? '')
    const user = await verifyAccessToken(token)
    if (!user) return null
    supabaseId = user.id
    email = user.email ?? null
  }

  try {
    let row = await prisma.adminUser.findUnique({ where: { supabaseId } })
    if (!row && email) row = await prisma.adminUser.findUnique({ where: { email } })
    if (!row || !row.isActive) return null
    return {
      id: row.id,
      email: row.email,
      name: row.name ?? null,
      roleLabel: row.roleLabel,
      permissions: row.permissions as PermissionMap,
      departments: row.departments ?? [],
      isActive: row.isActive,
    }
  } catch {
    return null
  }
})
