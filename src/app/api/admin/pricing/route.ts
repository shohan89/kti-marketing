import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const splitLines = (v: unknown) => Array.isArray(v) ? v : (String(v || '')).split('\n').map(s => s.trim()).filter(Boolean)

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const packages = await prisma.marketingPackage.findMany({ orderBy: { sortOrder: 'asc' } })
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
    const pkg = await prisma.marketingPackage.create({
      data: {
        name: body.name, price: Number(body.price) || 0,
        badge: body.badge || null, highlight: body.highlight ?? false,
        description: body.description ?? '', cta: body.cta || 'Get Started',
        platforms: splitLines(body.platforms),
        deliverables: splitLines(body.deliverables),
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
