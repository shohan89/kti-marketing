import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const splitLines = (v: unknown) =>
  Array.isArray(v) ? v : String(v || '').split(/[\n,]/).map(s => s.trim()).filter(Boolean)

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const themes = await prisma.websiteTheme.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json(themes)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const body = await req.json()
    const theme = await prisma.websiteTheme.create({
      data: {
        name: body.name || '',
        tags: splitLines(body.tags),
        description: body.description || '',
        image: body.image || '',
        url: body.url || '',
        sortOrder: Number(body.sortOrder) || 0,
        isPublished: body.isPublished ?? true,
      },
    })
    return NextResponse.json(theme, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
