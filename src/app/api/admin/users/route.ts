import { NextRequest, NextResponse } from 'next/server'
import { prisma, getSupabase } from '@/lib/prisma'
import { requireAdminSession, getCurrentAdminUser } from '@/lib/auth'
import { MODULES, ROLE_PRESETS, type PermissionMap } from '@/lib/permissions'

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const users = await prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } })
    return NextResponse.json(users)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

function sanitizePermissions(input: unknown, roleLabel: string): PermissionMap {
  const preset = ROLE_PRESETS[roleLabel] ?? ROLE_PRESETS.CUSTOM
  if (!input || typeof input !== 'object') return preset
  const src = input as Record<string, unknown>
  const out = { ...preset }
  for (const m of MODULES) {
    const v = src[m]
    if (v === 'none' || v === 'view' || v === 'manage') out[m] = v
  }
  return out
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth

  const me = await getCurrentAdminUser()
  if (!me) return NextResponse.json({ error: 'No admin account for this session' }, { status: 403 })

  try {
    const body = await req.json()
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body.password === 'string' ? body.password : ''
    const roleLabel = typeof body.roleLabel === 'string' && ROLE_PRESETS[body.roleLabel] ? body.roleLabel : 'VIEWER'

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    // Only a Super Admin may create another Super Admin account.
    if (roleLabel === 'SUPER_ADMIN' && me.roleLabel !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only a Super Admin can create another Super Admin.' }, { status: 403 })
    }

    const permissions = sanitizePermissions(body.permissions, roleLabel)
    const departments = Array.isArray(body.departments) ? body.departments.filter((d: unknown) => typeof d === 'string') : []

    const supabase = getSupabase()
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email, password, email_confirm: true,
    })
    if (authError || !authData?.user) {
      return NextResponse.json({ error: authError?.message ?? 'Failed to create login account.' }, { status: 400 })
    }

    try {
      const created = await prisma.adminUser.create({
        data: {
          email, supabaseId: authData.user.id,
          name: typeof body.name === 'string' ? body.name : null,
          roleLabel, permissions, departments,
          isActive: body.isActive ?? true,
        },
      })
      return NextResponse.json(created, { status: 201 })
    } catch (dbError) {
      // Roll back the auth account so we don't leave an orphaned login with no admin record.
      await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {})
      const msg = dbError instanceof Error ? dbError.message : 'DB error'
      return NextResponse.json({ error: msg }, { status: 500 })
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
