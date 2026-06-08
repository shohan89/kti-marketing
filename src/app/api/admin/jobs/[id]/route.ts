import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const splitLines = (v: unknown) => Array.isArray(v) ? v : (String(v || '')).split('\n').map(s => s.trim()).filter(Boolean)

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const job = await prisma.jobListing.findUnique({ where: { id } })
    if (!job) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(job)
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
    const job = await prisma.jobListing.update({
      where: { id },
      data: {
        title: body.title, slug: body.slug, department: body.department ?? '',
        location: body.location ?? '', type: body.type ?? 'Full-time',
        salary: body.salary || null, excerpt: body.excerpt ?? '',
        description: body.description ?? '', posted: body.posted || null,
        responsibilities: splitLines(body.responsibilities),
        requirements: splitLines(body.requirements),
        niceToHave: splitLines(body.niceToHave),
        benefits: splitLines(body.benefits),
        isPublished: body.isPublished ?? false,
        metaTitle: body.metaTitle || null, metaDescription: body.metaDescription || null,
      },
    })
    return NextResponse.json(job)
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
    await prisma.jobListing.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
