import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession, getCurrentAdminUser } from '@/lib/auth'
import { ApplicationStatus } from '@/generated/prisma/client'

/** Department-scoped roles (Manager, HR) can't reach applications outside their assignment. */
async function isOutOfScope(department: string | null | undefined): Promise<boolean> {
  const me = await getCurrentAdminUser()
  if (!me || me.departments.length === 0) return false
  return !department || !me.departments.includes(department)
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const app = await prisma.jobApplication.findUnique({
      where: { id },
      include: { job: { select: { title: true, slug: true, department: true } } },
    })
    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (await isOutOfScope(app.job?.department)) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(app)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const existing = await prisma.jobApplication.findUnique({ where: { id }, include: { job: { select: { department: true } } } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    if (await isOutOfScope(existing.job?.department)) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { status, notes } = await req.json()
    const data: { status?: ApplicationStatus; notes?: string } = {}
    if (status !== undefined) data.status = status as ApplicationStatus
    if (notes !== undefined) data.notes = notes
    const updated = await prisma.jobApplication.update({ where: { id }, data })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
