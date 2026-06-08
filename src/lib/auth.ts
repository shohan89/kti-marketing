import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from './supabase-server'

export async function getAdminSession() {
  const supabase = await createSupabaseServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function requireAdminSession(): Promise<NextResponse | null> {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return null
}
