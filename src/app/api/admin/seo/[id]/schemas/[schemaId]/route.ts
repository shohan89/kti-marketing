import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; schemaId: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { schemaId } = await params
  try {
    const body = await req.json()
    const schema = await prisma.seoSchema.update({
      where: { id: schemaId },
      data: {
        schemaType: body.schemaType,
        label:      body.label || null,
        data:       body.data,
        sortOrder:  Number(body.sortOrder) || 0,
        isActive:   body.isActive ?? true,
      },
    })
    return NextResponse.json(schema)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; schemaId: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { schemaId } = await params
  try {
    await prisma.seoSchema.delete({ where: { id: schemaId } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
