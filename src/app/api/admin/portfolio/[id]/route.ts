import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

function parseArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : []
}

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const item = await prisma.portfolioItem.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
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
    const item = await prisma.portfolioItem.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        client: body.client || null,
        description: body.description || null,
        category: body.category || null,
        imageUrls: parseArr(body.imageUrls),
        videoUrls: parseArr(body.videoUrls),
        youtubeUrl: body.youtubeUrl || null,
        challenge: body.challenge || null,
        solution: body.solution || null,
        phases: Array.isArray(body.phases) ? body.phases : [],
        results: Array.isArray(body.results) ? body.results : [],
        services: parseArr(body.services),
        deliverables: parseArr(body.deliverables),
        quote: body.quote || null,
        quoteName: body.quoteName || null,
        quoteRole: body.quoteRole || null,
        quoteCompany: body.quoteCompany || null,
        isPublished: body.isPublished ?? true,
        sortOrder: Number(body.sortOrder) || 0,
      },
    })
    return NextResponse.json(item)
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
    await prisma.portfolioItem.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
