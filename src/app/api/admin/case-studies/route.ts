import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const studies = await prisma.caseStudy.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(studies)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const body = await req.json()
    const services = Array.isArray(body.services) ? body.services : (body.services as string || '').split('\n').map((s: string) => s.trim()).filter(Boolean)
    const deliverables = Array.isArray(body.deliverables) ? body.deliverables : (body.deliverables as string || '').split('\n').map((s: string) => s.trim()).filter(Boolean)
    const phases = Array.isArray(body.phases) ? body.phases : []
    const metrics = Array.isArray(body.metrics) ? body.metrics : []
    const study = await prisma.caseStudy.create({
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
    return NextResponse.json(study, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
