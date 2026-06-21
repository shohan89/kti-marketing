import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const post = await prisma.blogPost.findUnique({ where: { id } })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
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
    const tags = Array.isArray(body.tags) ? body.tags : (body.tags as string || '').split('\n').map((t: string) => t.trim()).filter(Boolean)
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title, slug: body.slug,
        category: body.category ?? 'MARKETING',
        excerpt: body.excerpt ?? '', readTime: body.readTime ?? '',
        publishDate: body.publishDate ?? '', author: body.author ?? '',
        tags, featured: body.featured ?? false, isPublished: body.isPublished ?? false,
        body: body.body ?? '',
        metaTitle: body.metaTitle || null, metaDescription: body.metaDescription || null,
        canonicalUrl: body.canonicalUrl || null, ogImageUrl: body.ogImageUrl || null,
      },
    })
    return NextResponse.json(post)
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
    await prisma.blogPost.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
