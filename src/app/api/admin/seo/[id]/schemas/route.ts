import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await params
  try {
    const schemas = await prisma.seoSchema.findMany({
      where: { pageId: id },
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(schemas)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await params
  try {
    const body = await req.json()
    const schema = await prisma.seoSchema.create({
      data: {
        pageId:     id,
        schemaType: body.schemaType,
        label:      body.label || null,
        data:       body.data,
        sortOrder:  Number(body.sortOrder) || 0,
        isActive:   body.isActive ?? true,
      },
    })
    return NextResponse.json(schema, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
