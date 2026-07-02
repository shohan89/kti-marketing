import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const packages = await prisma.videoPackage.findMany({ orderBy: { sortOrder: 'asc' } })
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
    const pkg = await prisma.videoPackage.create({
      data: {
        category: body.category, name: body.name, price: Number(body.price) || 0,
        priceLabel: body.priceLabel || null,
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
