import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'
import { STATIC_PAGES } from '@/lib/seo'

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const pages = await prisma.pageSeo.findMany({
      include: { schemas: { select: { id: true, isActive: true } } },
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json(pages)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const body = await req.json()

    // Seed all static pages at once if requested
    if (body.seedAll) {
      const existing = await prisma.pageSeo.findMany({ select: { pageKey: true } })
      const existingKeys = new Set(existing.map(p => p.pageKey))
      const toCreate = STATIC_PAGES.filter(p => !existingKeys.has(p.key))
      const created = await Promise.all(
        toCreate.map(p => prisma.pageSeo.create({ data: { pageKey: p.key, pageLabel: p.label } }))
      )
      return NextResponse.json({ created: created.length })
    }

    const page = await prisma.pageSeo.create({
      data: { pageKey: body.pageKey, pageLabel: body.pageLabel },
    })
    return NextResponse.json(page, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
