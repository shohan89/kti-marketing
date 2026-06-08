import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await params
  try {
    const page = await prisma.pageSeo.findUnique({
      where: { id },
      include: { schemas: { orderBy: { sortOrder: 'asc' } } },
    })
    if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(page)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await params
  try {
    const body = await req.json()
    const page = await prisma.pageSeo.update({
      where: { id },
      data: {
        focusKeyword:    body.focusKeyword    ?? null,
        metaTitle:       body.metaTitle       ?? null,
        metaDescription: body.metaDescription ?? null,
        canonicalUrl:    body.canonicalUrl    ?? null,
        ogTitle:         body.ogTitle         ?? null,
        ogDescription:   body.ogDescription   ?? null,
        ogImage:         body.ogImage         ?? null,
        ogUrl:           body.ogUrl           ?? null,
        ogType:          body.ogType          ?? 'website',
        twitterTitle:       body.twitterTitle       ?? null,
        twitterDescription: body.twitterDescription ?? null,
        twitterImage:       body.twitterImage       ?? null,
        twitterCard:        body.twitterCard        ?? 'summary_large_image',
        robotsIndex:  body.robotsIndex  ?? true,
        robotsFollow: body.robotsFollow ?? true,
        priority:     Number(body.priority)  || 0.5,
        changeFreq:   body.changeFreq   ?? 'monthly',
      },
    })
    return NextResponse.json(page)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await params
  try {
    await prisma.pageSeo.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
