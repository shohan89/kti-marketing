import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

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
    const imageUrls = Array.isArray(body.imageUrls) ? body.imageUrls : []
    const item = await prisma.portfolioItem.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || null,
        category: body.category || null,
        imageUrls,
        youtubeUrl: body.youtubeUrl || null,
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
