import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

function parseArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : []
}

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const items = await prisma.portfolioItem.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json(items)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const body = await req.json()
    const item = await prisma.portfolioItem.create({
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
    return NextResponse.json(item, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
