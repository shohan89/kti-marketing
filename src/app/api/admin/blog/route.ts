import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(posts)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const body = await req.json()
    const tags = Array.isArray(body.tags) ? body.tags : (body.tags as string || '').split('\n').map((t: string) => t.trim()).filter(Boolean)
    const post = await prisma.blogPost.create({
      data: {
        title: body.title, slug: body.slug,
        category: body.category ?? 'MARKETING',
        excerpt: body.excerpt ?? '', readTime: body.readTime ?? '',
        publishDate: body.publishDate ?? '', author: body.author ?? '',
        tags, featured: body.featured ?? false, isPublished: body.isPublished ?? false,
        body: body.body ?? '',
        metaTitle: body.metaTitle || null, metaDescription: body.metaDescription || null,
        coverImageUrl: body.coverImageUrl || null,
        canonicalUrl: body.canonicalUrl || null, ogImageUrl: body.ogImageUrl || null,
      },
    })
    return NextResponse.json(post, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
