import { NextResponse } from 'next/server'
import { requireAdminSession, getCurrentAdminUser } from '@/lib/auth'

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth

  const me = await getCurrentAdminUser()
  if (!me) return NextResponse.json({ error: 'No admin account for this session' }, { status: 403 })

  return NextResponse.json(me)
}
