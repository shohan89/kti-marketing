import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const splitLines = (v: unknown) =>
  Array.isArray(v) ? v : String(v || '').split('\n').map(s => s.trim()).filter(Boolean)

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const packages = await prisma.photoshootPackage.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json(packages)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
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
    const pkg = await prisma.photoshootPackage.create({
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
    return NextResponse.json(pkg, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
