import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import { ApplicationStatus } from '@/generated/prisma/client'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const app = await prisma.jobApplication.findUnique({
      where: { id },
      include: { job: { select: { title: true, slug: true } } },
    })
    if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
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
