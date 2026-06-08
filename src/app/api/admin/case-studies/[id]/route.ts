import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const study = await prisma.caseStudy.findUnique({ where: { id } })
    if (!study) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(study)
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
    const services = Array.isArray(body.services) ? body.services : (body.services as string || '').split('\n').map((s: string) => s.trim()).filter(Boolean)
    const deliverables = Array.isArray(body.deliverables) ? body.deliverables : (body.deliverables as string || '').split('\n').map((s: string) => s.trim()).filter(Boolean)
    const phases = Array.isArray(body.phases) ? body.phases : []
    const metrics = Array.isArray(body.metrics) ? body.metrics : []
    const study = await prisma.caseStudy.update({
      where: { id },
      data: {
        title: body.title, slug: body.slug, client: body.client,
        industry: body.industry ?? '', category: body.category ?? '',
        tag: body.tag ?? '', subtitle: body.subtitle ?? '',
        challenge: body.challenge ?? '', solution: body.solution ?? '',
        body: body.solution ?? '', duration: body.duration ?? '',
        services, deliverables, phases, metrics,
        quote: body.quote || null, quoteName: body.quoteName || null,
        quoteRole: body.quoteRole || null, quoteCompany: body.quoteCompany || null,
        quoteResult: body.quoteResult || null,
        isPublished: body.isPublished ?? false,
        metaTitle: body.metaTitle || null, metaDescription: body.metaDescription || null,
        ogImageUrl: body.ogImageUrl || null,
      },
    })
    return NextResponse.json(study)
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
    await prisma.caseStudy.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
