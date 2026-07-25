import { NextRequest, NextResponse } from 'next/server'
import { prisma, getSupabase } from '@/lib/prisma'
import { requireAdminSession, getCurrentAdminUser } from '@/lib/auth'
import { MODULES, ROLE_PRESETS, type PermissionMap } from '@/lib/permissions'

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

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const user = await prisma.adminUser.findUnique({ where: { id } })
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(user)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth

  const me = await getCurrentAdminUser()
  if (!me) return NextResponse.json({ error: 'No admin account for this session' }, { status: 403 })

  const { id } = await context.params
  try {
    const target = await prisma.adminUser.findUnique({ where: { id } })
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const body = await req.json()
    const roleLabel = typeof body.roleLabel === 'string' && ROLE_PRESETS[body.roleLabel] ? body.roleLabel : target.roleLabel

    // Only a Super Admin may touch an existing Super Admin, or promote anyone to Super Admin.
    const touchesSuperAdmin = target.roleLabel === 'SUPER_ADMIN' || roleLabel === 'SUPER_ADMIN'
    if (touchesSuperAdmin && me.roleLabel !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only a Super Admin can modify Super Admin accounts.' }, { status: 403 })
    }

    const permissions = sanitizePermissions(body.permissions, roleLabel)
    const departments = Array.isArray(body.departments) ? body.departments.filter((d: unknown) => typeof d === 'string') : target.departments

    const updated = await prisma.adminUser.update({
      where: { id },
      data: {
        name: typeof body.name === 'string' ? body.name : target.name,
        roleLabel, permissions, departments,
        isActive: typeof body.isActive === 'boolean' ? body.isActive : target.isActive,
      },
    })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth

  const me = await getCurrentAdminUser()
  if (!me) return NextResponse.json({ error: 'No admin account for this session' }, { status: 403 })

  const { id } = await context.params
  try {
    const target = await prisma.adminUser.findUnique({ where: { id } })
    if (!target) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (target.roleLabel === 'SUPER_ADMIN' && me.roleLabel !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Only a Super Admin can delete a Super Admin account.' }, { status: 403 })
    }
    if (target.id === me.id) {
      return NextResponse.json({ error: 'You cannot delete your own account.' }, { status: 400 })
    }

    await prisma.adminUser.delete({ where: { id } })
    await getSupabase().auth.admin.deleteUser(target.supabaseId).catch(() => {})
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
