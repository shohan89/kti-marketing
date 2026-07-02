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

/** Idempotent get-or-create by pageKey. `PageSeo.id` is a separate cuid PK
 *  from the unique `pageKey`, and this project's Supabase-backed upsert only
 *  auto-generates `id` when the conflict column IS `id` — so a real upsert()
 *  here would insert new rows with a missing id. Explicit find-then-create
 *  sidesteps that and is also what makes "Configure" safe to click twice. */
async function getOrCreatePage(pageKey: string, pageLabel: string) {
  const found = await prisma.pageSeo.findFirst({ where: { pageKey } })
  if (found) return found
  return prisma.pageSeo.create({ data: { pageKey, pageLabel } })
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const body = await req.json()

    if (body.seedAll) {
      const created = await Promise.all(STATIC_PAGES.map(p => getOrCreatePage(p.key, p.label)))
      return NextResponse.json({ created: created.length })
    }

    const page = await getOrCreatePage(body.pageKey, body.pageLabel)
    return NextResponse.json(page, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
