import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const services = await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } })
    return NextResponse.json(services)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const body = await req.json()
    const deliverables = Array.isArray(body.deliverables)
      ? body.deliverables
      : (body.deliverables as string || '').split('\n').map((s: string) => s.trim()).filter(Boolean)
    const processSteps = Array.isArray(body.processSteps) ? body.processSteps : []
    const results = Array.isArray(body.results) ? body.results : []
    const faqs = Array.isArray(body.faqs) ? body.faqs : []
    const service = await prisma.service.create({
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
    return NextResponse.json(service, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
