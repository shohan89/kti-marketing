import type { Metadata } from 'next'
import HomeClient from './HomeClient'
import type { HomepageContent } from './HomeClient'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import PageSchemas from '@/components/seo/PageSchemas'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('home')
  return buildMetadata(seo, {
    title: 'KTI Marketing — Bold Strategy. Real Revenue. Zero Compromises.',
    description: 'Full-service growth agency helping ambitious brands dominate their market with performance campaigns, bold creative, and measurable results.',
  })
}

function safeJson<T>(str: string | undefined, fallback: T): T {
  if (!str) return fallback
  try { return JSON.parse(str) } catch { return fallback }
}

export default async function HomePage() {
  let content: HomepageContent = {}
  let testimonials: { quote: string; name: string; role: string; company: string; result: string; rating: number }[] | undefined
  let portfolioItems: { slug: string; tag: string; category: string; client: string; title: string; body: string; metrics: { num: string; label: string }[] }[] | undefined

  try {
    const [rows, dbTestimonials, dbPortfolio] = await Promise.all([
      prisma.siteSetting.findMany({ where: { key: { startsWith: 'homepage_' } } }),
      prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.portfolioItem.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' }, take: 3 }),
    ])

    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))

    content = {
      hero:         safeJson(map['homepage_hero'], {}),
      stats:        safeJson(map['homepage_stats'], undefined),
      brands:       (() => {
        const raw = safeJson<unknown[] | undefined>(map['homepage_brands'], undefined)
        if (!raw) return undefined
        return raw.map(b => typeof b === 'string' ? { name: b as string, logoUrl: '' } : b as { name: string; logoUrl: string })
      })(),
      marquee:      safeJson(map['homepage_marquee'], undefined),
      services:     safeJson(map['homepage_services'], {}),
      why:          safeJson(map['homepage_why'], {}),
      video:        safeJson(map['homepage_video'], {}),
      portfolio:    safeJson(map['homepage_portfolio'], {}),
      process:      safeJson(map['homepage_process'], {}),
      testimonials: safeJson(map['homepage_testimonials'], {}),
      blog:         safeJson(map['homepage_blog'], {}),
      cta:          safeJson(map['homepage_cta'], {}),
    }

    if (dbTestimonials.length > 0) {
      testimonials = dbTestimonials.map(t => ({
        quote: t.quote, name: t.name, role: t.role, company: t.company,
        result: t.result ?? '', rating: t.rating,
      }))
    }

    if (dbPortfolio.length > 0) {
      portfolioItems = dbPortfolio.map(p => ({
        slug: p.slug,
        tag: p.category ?? 'Portfolio',
        category: Array.isArray(p.services) && (p.services as string[]).length > 0 ? (p.services as string[])[0] : (p.category ?? ''),
        client: p.client ?? '',
        title: p.title,
        body: p.description ?? '',
        metrics: Array.isArray(p.results)
          ? (p.results as { stat: string; label: string }[]).slice(0, 2).map(r => ({ num: r.stat, label: r.label }))
          : [],
      }))
    }
  } catch {
    // DB unavailable — all hardcoded defaults in HomeClient will be used
  }

  return (
    <>
      <PageSchemas pageKey="home" />
      <HomeClient content={content} testimonials={testimonials} portfolioItems={portfolioItems} />
    </>
  )
}
