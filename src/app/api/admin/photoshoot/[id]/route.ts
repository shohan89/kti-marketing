import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const splitLines = (v: unknown) =>
  Array.isArray(v) ? v : String(v || '').split('\n').map(s => s.trim()).filter(Boolean)

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const pkg = await prisma.photoshootPackage.findUnique({ where: { id } })
    if (!pkg) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(pkg)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const body = await req.json()
    const qtyConfig = {
      inputLabel: body.inputLabel || 'How many?',
      unit: body.qtyUnit || 'units',
      capacity: Number(body.capacity) || 1,
      sessionLabel: body.sessionLabel || 'session',
      defaultQty: Number(body.defaultQty) || 1,
      imagesConfig: {
        defaultImages: Number(body.defaultImages) || 0,
        pricePerImage: Number(body.pricePerImage) || 0,
      },
    }
    const pkg = await prisma.photoshootPackage.update({
      where: { id },
      data: {
        type: body.type,
        icon: body.icon || '',
        description: body.description || '',
        price: body.price || '',
        priceNumeric: Number(body.priceNumeric) || 0,
        unit: body.unit || 'per session',
        addOn: body.addOn || null,
        includes: splitLines(body.includes),
        qtyConfig,
        sortOrder: Number(body.sortOrder) || 0,
        isPublished: body.isPublished ?? true,
      },
    })
    return NextResponse.json(pkg)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    await prisma.photoshootPackage.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
