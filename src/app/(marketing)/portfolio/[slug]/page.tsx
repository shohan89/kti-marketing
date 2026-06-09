import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { caseStudies, getCaseStudyBySlug } from '@/data/staticData'
import PageCTA from '@/components/ui/PageCTA'
import { prisma } from '@/lib/prisma'
import './CaseStudy.css'

export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return caseStudies.map(cs => ({ slug: cs.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const study = await prisma.caseStudy.findUnique({ where: { slug } })
    if (study) {
      const title = study.metaTitle ?? `${study.client} — ${study.title}`
      const description = study.metaDescription ?? study.subtitle
      return {
        title,
        description,
        openGraph: { title, description, type: 'article', ...(study.ogImageUrl ? { images: [{ url: study.ogImageUrl }] } : {}) },
        twitter: { card: 'summary_large_image', title, description, ...(study.ogImageUrl ? { images: [study.ogImageUrl] } : {}) },
      }
    }
  } catch { /* fall through to static */ }
  const study = getCaseStudyBySlug(slug)
  if (!study) return {}
  return {
    title: `${study.client} — ${study.title}`,
    description: study.subtitle,
    openGraph: { title: study.title, description: study.subtitle, type: 'article' },
  }
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let study: any = null
  try {
    const db = await prisma.caseStudy.findUnique({ where: { slug } })
    if (db) study = { ...db, subtitle: db.subtitle ?? '', metrics: (db.metrics ?? []) as { num: string; label: string }[], phases: (db.phases ?? []) as { num: string; title: string; body: string }[], deliverables: db.deliverables ?? [] }
  } catch {}
  if (!study) study = getCaseStudyBySlug(slug)
  if (!study) notFound()

  const related = caseStudies.filter(c => c.slug !== slug).slice(0, 3)
  const { tag, category, industry, client, title, subtitle, challenge, solution, phases, deliverables, metrics, duration, services, quote, quoteName, quoteRole, quoteCompany, quoteResult, imageUrls, youtubeUrl } = study
  const workImages: string[] = Array.isArray(imageUrls) ? imageUrls as string[] : []
  const embedUrl = youtubeUrl ? youtubeUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/') : null

  return (
    <main className="cs-detail">
      <section className="csd-hero">
        <div className="csd-hero__bg" aria-hidden="true">
          <div className="csd-hero__shape--1" /><div className="csd-hero__shape--2" /><div className="csd-hero__grid" />
        </div>
        <div className="container csd-hero__inner">
          <nav className="csd-breadcrumb" aria-label="Breadcrumb">
            <Link href="/portfolio">Portfolio</Link><span aria-hidden="true">›</span><span>{client}</span>
          </nav>
          <div className="csd-hero__badges"><span className="csd-tag">{tag}</span><span className="csd-category">{category}</span></div>
          <p className="csd-hero__client">{client}</p>
          <h1 className="csd-hero__title">{title}</h1>
          <p className="csd-hero__sub">{subtitle}</p>
          <div className="csd-hero__metrics">
            {metrics.map(({ num, label }: { num: string; label: string }) => (
              <div className="csd-hero__metric" key={label}><span className="csd-hero__metric-num">{num}</span><span className="csd-hero__metric-lbl">{label}</span></div>
            ))}
          </div>
        </div>
      </section>

      {(workImages.length > 0 || embedUrl) && (
        <section className="csd-media" style={{ padding: '3rem 0' }}>
          <div className="container">
            {workImages.length > 0 && (
              <div style={{ marginBottom: embedUrl ? '2.5rem' : 0 }}>
                <p className="eyebrow" style={{ marginBottom: '1rem' }}>Our Work</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {workImages.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderRadius: '12px', overflow: 'hidden', aspectRatio: '16/9', background: 'rgba(255,255,255,0.05)' }}>
                      <img src={url} alt={`Work image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} loading="lazy" />
                    </a>
                  ))}
                </div>
              </div>
            )}
            {embedUrl && (
              <div>
                <p className="eyebrow" style={{ marginBottom: '1rem' }}>Video</p>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
                  <iframe
                    src={embedUrl}
                    title="Portfolio video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="csd-overview">
        <div className="container csd-overview__grid">
          <div className="csd-overview__body">
            <p className="eyebrow">The Situation</p>
            <h2 className="csd-overview__title">Where They Started</h2>
            <p className="csd-overview__text">{challenge}</p>
            <div className="csd-inline-cta">
              <div className="csd-inline-cta__text"><strong>Facing a similar challenge?</strong><span>We offer a free 30-minute strategy session — no pitch, just clarity.</span></div>
              <Link href="/contact" className="btn btn-primary csd-inline-cta__btn">Book a Free Call</Link>
            </div>
          </div>
          <aside className="csd-meta-card">
            <div className="csd-meta-row"><span className="csd-meta-label">Client</span><span className="csd-meta-value">{client}</span></div>
            <div className="csd-meta-row"><span className="csd-meta-label">Industry</span><span className="csd-meta-value">{industry}</span></div>
            <div className="csd-meta-row"><span className="csd-meta-label">Duration</span><span className="csd-meta-value">{duration}</span></div>
            <div className="csd-meta-row csd-meta-row--services">
              <span className="csd-meta-label">Services</span>
              <div className="csd-meta-pills">{services.map((s: string) => (<span className="csd-pill" key={s}>{s}</span>))}</div>
            </div>
            <Link href="/contact" className="btn btn-primary csd-meta-cta">Start a Similar Project →</Link>
          </aside>
        </div>
      </section>

      <section className="csd-challenge">
        <div className="container">
          <div className="csd-challenge__inner">
            <div className="csd-challenge__left">
              <p className="eyebrow">The Problem</p>
              <h2 className="csd-challenge__title">Why the Status Quo<br />Wasn&apos;t Working</h2>
            </div>
            <div className="csd-challenge__right">
              <p className="csd-challenge__body">{challenge}</p>
              <div className="csd-challenge__pain-points">
                {['No clear attribution or performance visibility', 'Poor conversion rates across all digital channels', 'Inconsistent brand presence and messaging'].map((point, i) => (
                  <div className="csd-pain-point" key={i}><span className="csd-pain-point__icon" aria-hidden="true">✗</span><span>{point}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="csd-mid-cta">
        <div className="container csd-mid-cta__inner">
          <p className="csd-mid-cta__text"><strong>Working with a similar challenge?</strong>{' '}Let&apos;s map out your growth strategy — free, no commitment.</p>
          <Link href="/contact" className="csd-mid-cta__btn">Book a Strategy Call →</Link>
        </div>
      </div>

      <section className="csd-approach">
        <div className="container">
          <div className="csd-approach__header">
            <p className="eyebrow">How We Did It</p>
            <h2 className="csd-approach__title">A Phased Approach.<br /><span className="accent">Compounding Results.</span></h2>
            <p className="csd-approach__sub">Every engagement follows a disciplined three-phase system. Each phase builds on the last to deliver results that compound — not just a one-time spike.</p>
          </div>
          <div className="csd-phases">
            {phases.map(({ num, title: phaseTitle, body }: { num: string; title: string; body: string }, i: number) => (
              <div className="csd-phase" key={num}>
                <div className="csd-phase__num">{num}</div>
                <div className="csd-phase__content"><h3 className="csd-phase__title">{phaseTitle}</h3><p className="csd-phase__body">{body}</p></div>
                {i < phases.length - 1 && <div className="csd-phase__connector" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="csd-results">
        <div className="csd-results__bg" aria-hidden="true" />
        <div className="container">
          <div className="csd-results__header">
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>The Outcome</p>
            <h2 className="csd-results__title">Numbers That<br /><span className="csd-results__accent">Changed the Business.</span></h2>
          </div>
          <div className="csd-results__grid">
            {metrics.map(({ num, label }: { num: string; label: string }) => (
              <div className="csd-result-card" key={label}><span className="csd-result-card__num">{num}</span><span className="csd-result-card__label">{label}</span></div>
            ))}
          </div>
          <p className="csd-results__note">Results achieved over {duration} · All data verified and attributed</p>
        </div>
      </section>

      <section className="csd-deliverables">
        <div className="container csd-deliverables__grid">
          <div className="csd-deliverables__left">
            <p className="eyebrow">The Work</p>
            <h2 className="csd-deliverables__title">What We<br />Actually Built</h2>
            <p className="csd-deliverables__sub">Every deliverable was designed with one goal: measurable business impact. No filler, no vanity output.</p>
            <Link href="/contact" className="btn btn-primary">Get the Same for Your Brand →</Link>
          </div>
          <ul className="csd-deliverables__list">
            {deliverables.map((item: string, i: number) => (
              <li className="csd-deliverable-item" key={i}><span className="csd-deliverable-item__check" aria-hidden="true">✓</span><span>{item}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="csd-testimonial">
        <div className="container">
          <div className="csd-testimonial__card">
            <div className="csd-testimonial__quote-mark" aria-hidden="true">&ldquo;</div>
            <blockquote className="csd-testimonial__quote">{quote}</blockquote>
            <div className="csd-testimonial__footer">
              <div className="csd-testimonial__avatar" aria-hidden="true">{quoteName.charAt(0)}</div>
              <div className="csd-testimonial__author"><strong>{quoteName}</strong><span>{quoteRole} · {quoteCompany}</span></div>
              <div className="csd-testimonial__result"><span className="csd-testimonial__result-badge">{quoteResult}</span></div>
            </div>
          </div>
        </div>
      </section>

      <div className="csd-approach-cta">
        <div className="container csd-approach-cta__inner">
          <div>
            <p className="csd-approach-cta__label">Ready for results like these?</p>
            <p className="csd-approach-cta__sub">We apply the same proven system to every client engagement. Let&apos;s talk about yours.</p>
          </div>
          <div className="csd-approach-cta__actions">
            <Link href="/contact" className="btn btn-primary">Get a Free Strategy Call</Link>
            <Link href="/services" className="btn btn-outline">View Our Services</Link>
          </div>
        </div>
      </div>

      <section className="csd-more">
        <div className="container">
          <div className="csd-more__header"><p className="eyebrow">More Work</p><h2 className="csd-more__title">More Results Like This</h2></div>
          <div className="csd-more__grid">
            {related.map(({ slug: relSlug, tag: relTag, client: relClient, title: relTitle, metrics: relMetrics }) => (
              <Link href={`/portfolio/${relSlug}`} className="csd-more-card" key={relSlug}>
                <div className="csd-more-card__top"><span className="csd-tag">{relTag}</span></div>
                <p className="csd-more-card__client">{relClient}</p>
                <h3 className="csd-more-card__title">{relTitle}</h3>
                <div className="csd-more-card__metrics">
                  {relMetrics.slice(0, 2).map(({ num, label }) => (
                    <div className="csd-more-metric" key={label}><span className="csd-more-metric__num">{num}</span><span className="csd-more-metric__lbl">{label}</span></div>
                  ))}
                </div>
                <span className="csd-more-card__arrow">View Case Study →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        eyebrow="Start Your Story"
        title={<>Ready to Be<br /><span className="accent">Our Next Case Study?</span></>}
        sub="Let's discuss your goals and build a strategy that delivers results you can show off."
        primaryLabel="Get a Free Strategy Call →"
        secondaryLabel="View More Portfolio"
        secondaryTo="/portfolio"
      />
    </main>
  )
}
