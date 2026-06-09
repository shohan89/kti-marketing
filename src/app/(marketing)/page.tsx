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
  let caseStudies: { tag: string; category: string; client: string; title: string; body: string; metrics: { num: string; label: string }[] }[] | undefined

  try {
    const [rows, dbTestimonials, dbCaseStudies] = await Promise.all([
      prisma.siteSetting.findMany({ where: { key: { startsWith: 'homepage_' } } }),
      prisma.testimonial.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.caseStudy.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
    ])

    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))

    content = {
      hero:         safeJson(map['homepage_hero'], {}),
      stats:        safeJson(map['homepage_stats'], undefined),
      brands:       safeJson(map['homepage_brands'], undefined),
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

    if (dbCaseStudies.length > 0) {
      caseStudies = dbCaseStudies.map(cs => ({
        tag: cs.tag, category: cs.category, client: cs.client,
        title: cs.title, body: cs.body,
        metrics: (cs.metrics as { num: string; label: string }[]) ?? [],
      }))
    }
  } catch {
    // DB unavailable — all hardcoded defaults in HomeClient will be used
  }

  return (
    <>
      <PageSchemas pageKey="home" />
      <HomeClient content={content} testimonials={testimonials} caseStudies={caseStudies} />
    </>
  )
}
