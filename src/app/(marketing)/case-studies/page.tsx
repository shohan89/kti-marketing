import type { Metadata } from 'next'
import Link from 'next/link'
import { caseStudies } from '@/data/staticData'
import PageCTA from '@/components/ui/PageCTA'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import './CaseStudies.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('case-studies')
  return buildMetadata(seo, { title: 'Case Studies — Results That Prove We Deliver', description: 'Real campaigns. Real outcomes. Every case study is built on verified business results — revenue, leads, ROAS, and retention.' })
}

export default async function CaseStudiesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let allStudies: any[] = caseStudies
  try {
    const rows = await prisma.caseStudy.findMany({ where: { isPublished: true }, orderBy: { id: 'asc' } })
    if (rows.length > 0) {
      allStudies = rows.map(s => ({
        ...s,
        subtitle: s.subtitle ?? '',
        metrics: (s.metrics ?? []) as { num: string; label: string }[],
        phases:  (s.phases  ?? []) as { num: string; title: string; body: string }[],
      }))
    }
  } catch { /* use static fallback */ }
  const [featured, ...rest] = allStudies

  return (
    <main className="cs-page">
      <section className="cs-hero">
        <div className="cs-hero__bg" aria-hidden="true">
          <div className="cs-hero__shape cs-hero__shape--1" />
          <div className="cs-hero__shape cs-hero__shape--2" />
        </div>
        <div className="container cs-hero__inner">
          <p className="eyebrow cs-hero__eyebrow">Our Work</p>
          <h1 className="cs-hero__title">Results That Prove<br /><span className="cs-hero__accent">We Deliver.</span></h1>
          <p className="cs-hero__sub">We don't hide behind impressions and engagement rate graphs. Every case study below is built on real business outcomes — revenue, leads, ROAS, and retention.</p>
          <div className="cs-hero__stats">
            {[{ num: '120+', label: 'Brands Scaled' }, { num: '$40M+', label: 'Revenue Generated' }, { num: '94%', label: 'Client Retention' }].map(({ num, label }) => (
              <div className="cs-hero__stat" key={label}><span className="cs-hero__stat-num">{num}</span><span className="cs-hero__stat-lbl">{label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="cs-featured">
        <div className="container">
          <div className="cs-featured__card">
            <div className="cs-featured__left">
              <div className="cs-featured__meta">
                <span className="cs-tag">{featured.tag}</span>
                <span className="cs-category">{featured.category}</span>
              </div>
              <p className="cs-featured__client">{featured.client}</p>
              <h2 className="cs-featured__title">{featured.title}</h2>
              <div className="cs-featured__blocks">
                <div className="cs-block"><h4 className="cs-block__label">The Challenge</h4><p className="cs-block__body">{featured.challenge}</p></div>
                <div className="cs-block"><h4 className="cs-block__label">Our Approach</h4><p className="cs-block__body">{featured.solution}</p></div>
              </div>
              <div className="cs-featured__services">{featured.services.map(s => (<span className="cs-service-pill" key={s}>{s}</span>))}</div>
              <div className="cs-featured__actions">
                <Link href={`/case-studies/${featured.slug}`} className="btn btn-primary">Read Full Case Study →</Link>
                <Link href="/contact" className="btn btn-outline cs-featured__cta">Start a Similar Project</Link>
              </div>
            </div>
            <div className="cs-featured__right">
              <div className="cs-metrics-panel">
                <p className="cs-metrics-panel__label">Campaign Results</p>
                <div className="cs-metrics-panel__duration"><span>Duration</span><strong>{featured.duration}</strong></div>
                <div className="cs-metrics-grid">
                  {featured.metrics.map(({ num, label }) => (
                    <div className="cs-metric" key={label}><span className="cs-metric__num">{num}</span><span className="cs-metric__label">{label}</span></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cs-grid-section">
        <div className="container">
          <div className="cs-grid-header reveal">
            <p className="eyebrow">More Results</p>
            <h2 className="cs-grid-title">Every Client.<br /><span className="accent">Every Outcome.</span></h2>
          </div>
          <div className="cs-grid">
            {rest.map(({ slug, tag, category, client, title, challenge, solution, metrics, duration, services }, i) => (
              <div className="cs-card reveal" key={slug} style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}>
                <div className="cs-card__top"><span className="cs-tag">{tag}</span><span className="cs-category">{category}</span></div>
                <p className="cs-card__client">{client}</p>
                <h3 className="cs-card__title">{title}</h3>
                <div className="cs-card__blocks">
                  <div className="cs-block"><h4 className="cs-block__label">Challenge</h4><p className="cs-block__body">{challenge}</p></div>
                  <div className="cs-block"><h4 className="cs-block__label">Approach</h4><p className="cs-block__body">{solution}</p></div>
                </div>
                <div className="cs-card__metrics">
                  {metrics.map(({ num, label }) => (
                    <div className="cs-metric cs-metric--sm" key={label}><span className="cs-metric__num">{num}</span><span className="cs-metric__label">{label}</span></div>
                  ))}
                </div>
                <div className="cs-card__footer">
                  <div className="cs-card__services">{services.map(s => (<span className="cs-service-pill cs-service-pill--sm" key={s}>{s}</span>))}</div>
                  <span className="cs-card__duration">{duration}</span>
                </div>
                <Link href={`/case-studies/${slug}`} className="cs-card__cta">Read Full Case Study →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        eyebrow="Ready to Be Next?"
        title={<>Let&apos;s Build Your<br />Success Story.</>}
        sub="Every case study above started with a single conversation. Tell us where you are and where you want to go."
        primaryLabel="Get a Free Strategy Call →"
        note="No commitment · 100% free strategy session"
      />
    </main>
  )
}
