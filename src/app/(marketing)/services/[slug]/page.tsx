import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { servicesData, caseStudies, getServiceBySlug } from '@/data/staticData'
import PageCTA from '@/components/ui/PageCTA'
import { PROCESS_ILLUSTRATIONS } from '@/components/ui/ProcessIllustrations'
import ServiceFAQ from './ServiceFAQ'
import { prisma } from '@/lib/prisma'
import './ServiceDetails.css'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return servicesData.map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const service = await prisma.service.findUnique({ where: { slug } })
    if (service) {
      const title = service.metaTitle ?? `${service.title} — KTI Marketing`
      const description = service.metaDescription ?? service.description
      return {
        title,
        description,
        openGraph: { title, description, ...(service.ogImageUrl ? { images: [{ url: service.ogImageUrl }] } : {}) },
        twitter: { card: 'summary_large_image', title, description, ...(service.ogImageUrl ? { images: [service.ogImageUrl] } : {}) },
      }
    }
  } catch { /* fall through to static */ }
  const service = getServiceBySlug(slug)
  if (!service) return {}
  return { title: `${service.title} — KTI Marketing`, description: service.description }
}

export default async function ServiceDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let service: any = null
  try {
    const db = await prisma.service.findUnique({ where: { slug } })
    if (db) service = { ...db, image: db.imageUrl ?? '', process: db.processSteps ?? [] }
  } catch {}
  if (!service) service = getServiceBySlug(slug)
  if (!service) notFound()

  const relatedStudies = (() => {
    const matched = caseStudies.filter(cs => cs.services.some(s => s.toLowerCase().includes(service.title.toLowerCase()) || service.title.toLowerCase().includes(s.toLowerCase())))
    if (matched.length >= 2) return matched.slice(0, 3)
    return [...matched, ...caseStudies.filter(cs => !matched.includes(cs))].slice(0, 3)
  })()

  return (
    <main className="sd-page">
      <nav className="sd-breadcrumb" aria-label="breadcrumb">
        <div className="container">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          <Link href="/services">Services</Link><span aria-hidden="true">/</span>
          <span aria-current="page">{service.title}</span>
        </div>
      </nav>

      <section className="sd-hero">
        <div className="container">
          <p className="eyebrow sd-hero__eyebrow fade-up">{service.title}</p>
          <h1 className="sd-hero__title fade-up-1">{service.headline}</h1>
          <p className="sd-hero__sub fade-up-2">{service.description}</p>
          <div className="sd-hero__cta fade-up-3">
            <Link href="/contact" className="btn btn-white">Start Your Project →</Link>
            <Link href="/services" className="sd-hero__back">← All Services</Link>
          </div>
        </div>
      </section>

      <section className="sd-overview">
        <div className="container">
          <div className="sd-overview__grid reveal">
            <div className="sd-overview__left"><p className="eyebrow">What We Do</p><h2 className="sd-overview__title">The full picture.</h2></div>
            <p className="sd-overview__body">{service.longDescription}</p>
          </div>
        </div>
      </section>

      <section className="sd-deliverables">
        <div className="container">
          <div className="sd-section-header reveal"><p className="eyebrow">What&apos;s Included</p><h2 className="sd-section-title">What You Get</h2></div>
          <ul className="sd-deliverables__grid" role="list">
            {service.deliverables.map((item: string, i: number) => (
              <li key={item} className="sd-deliverable-item reveal" style={{ '--reveal-delay': `${Math.min(i * 0.05, 0.35)}s` } as React.CSSProperties}>
                <span className="sd-deliverable-item__check" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="sd-process">
        <div className="container">
          <div className="sd-section-header reveal"><p className="eyebrow">How It Works</p><h2 className="sd-section-title">Our Process</h2></div>
          <div className="sd-process__steps">
            {service.process.map((step: { num: string; title: string; body: string }, i: number) => {
              const Illus = PROCESS_ILLUSTRATIONS[i] ?? PROCESS_ILLUSTRATIONS[0]
              return (
                <div className="sd-process-step reveal" key={step.num} style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}>
                  <div className="sd-process-step__num-col">
                    <div className="sd-process-step__circle">{step.num}</div>
                    {i < service.process.length - 1 && <div className="sd-process-step__line" aria-hidden="true" />}
                  </div>
                  <div className="sd-process-step__content"><h3 className="sd-process-step__title">{step.title}</h3><p className="sd-process-step__body">{step.body}</p></div>
                  <div className="sd-process-step__illus" aria-hidden="true"><Illus /></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="sd-results">
        <div className="container">
          <div className="sd-results__header reveal"><p className="eyebrow sd-results__eyebrow">What to Expect</p><h2 className="sd-results__title">Outcomes That Matter.</h2></div>
          <div className="sd-results__grid">
            {service.results.map(({ stat, label, description }: { stat: string; label: string; description: string }, i: number) => (
              <div className="sd-result-card reveal" key={label} style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}>
                <span className="sd-result-card__stat">{stat}</span>
                <h3 className="sd-result-card__label">{label}</h3>
                <p className="sd-result-card__desc">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sd-faq">
        <div className="container">
          <div className="sd-faq__grid reveal">
            <div className="sd-faq__left">
              <p className="eyebrow">Common Questions</p>
              <h2 className="sd-faq__title">FAQ</h2>
            </div>
            <ServiceFAQ faqs={service.faqs} />
          </div>
        </div>
      </section>

      {relatedStudies.length > 0 && (
        <section className="sd-case-studies">
          <div className="container">
            <div className="sd-section-header reveal"><p className="eyebrow">Proven Results</p><h2 className="sd-section-title">See It in Action</h2></div>
            <div className="sd-cs-grid">
              {relatedStudies.map(({ slug: csSlug, tag, client, title: csTitle, metrics, services: csServices }, i) => (
                <Link key={csSlug} href={`/portfolio/${csSlug}`} className="sd-cs-card reveal" style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}>
                  <div className="sd-cs-card__top"><span className="sd-cs-tag">{tag}</span></div>
                  <p className="sd-cs-card__client">{client}</p>
                  <h3 className="sd-cs-card__title">{csTitle}</h3>
                  <div className="sd-cs-card__metrics">{metrics.slice(0, 2).map(({ num, label }) => (<div className="sd-cs-metric" key={label}><span className="sd-cs-metric__num">{num}</span><span className="sd-cs-metric__lbl">{label}</span></div>))}</div>
                  <div className="sd-cs-card__services">{csServices.slice(0, 3).map(s => (<span className="sd-cs-pill" key={s}>{s}</span>))}</div>
                  <span className="sd-cs-card__arrow">View Case Study →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <PageCTA
        eyebrow="Ready to Get Started?"
        title={<>Let&apos;s build something<br />great together.</>}
        sub="Tell us about your brand and goals. We'll review your project and get back to you within one business day with a tailored plan."
        primaryLabel="Start Your Project →"
        secondaryLabel="Explore Other Services"
        secondaryTo="/services"
      />
    </main>
  )
}
