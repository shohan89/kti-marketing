import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const service = await prisma.service.findUnique({ where: { id } })
    if (!service) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(service)
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
    const deliverables = Array.isArray(body.deliverables)
      ? body.deliverables
      : (body.deliverables as string || '').split('\n').map((s: string) => s.trim()).filter(Boolean)
    const processSteps = Array.isArray(body.processSteps) ? body.processSteps : []
    const results = Array.isArray(body.results) ? body.results : []
    const faqs = Array.isArray(body.faqs) ? body.faqs : []
    const service = await prisma.service.update({
      where: { id },
      data: {
        slug: body.slug,
        title: body.title,
        description: body.description ?? '',
        longDescription: body.longDescription ?? '',
        headline: body.headline ?? '',
        imageUrl: body.imageUrl || null,
        videoUrl: body.videoUrl || null,
        sortOrder: Number(body.sortOrder) || 0,
        isPublished: body.isPublished ?? true,
        deliverables,
        processSteps,
        results,
        faqs,
        metaTitle: body.metaTitle || null,
        metaDescription: body.metaDescription || null,
        ogImageUrl: body.ogImageUrl || null,
      },
    })
    return NextResponse.json(service)
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
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
