import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const splitLines = (v: unknown) =>
  Array.isArray(v) ? v : String(v || '').split(/[\n,]/).map(s => s.trim()).filter(Boolean)

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const theme = await prisma.websiteTheme.findUnique({ where: { id } })
    if (!theme) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(theme)
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
    const theme = await prisma.websiteTheme.update({
      where: { id },
      data: {
        name: body.name || '',
        tags: splitLines(body.tags),
        technology: body.technology || null,
        description: body.description || '',
        image: body.image || '',
        url: body.url || '',
        sortOrder: Number(body.sortOrder) || 0,
        isPublished: body.isPublished ?? true,
      },
    })
    return NextResponse.json(theme)
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
    await prisma.websiteTheme.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
