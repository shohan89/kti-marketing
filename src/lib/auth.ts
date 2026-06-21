import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { createSupabaseServerClient } from './supabase-server'

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  // Middleware stamps this header when it has already validated the session.
  // Trust it — the middleware strips any client-supplied value before setting it.
  const headerStore = await headers()
  if (headerStore.get('x-admin-authorized') === '1') return null

  // Fallback: direct session check (e.g. calls that bypass middleware in dev)
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
