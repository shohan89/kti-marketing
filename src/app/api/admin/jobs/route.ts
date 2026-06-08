import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const splitLines = (v: unknown) => Array.isArray(v) ? v : (String(v || '')).split('\n').map(s => s.trim()).filter(Boolean)

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const jobs = await prisma.jobListing.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(jobs)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const body = await req.json()
    const job = await prisma.jobListing.create({
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
    return NextResponse.json(job, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
