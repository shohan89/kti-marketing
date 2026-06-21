import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import './PortfolioDetail.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const item = await prisma.portfolioItem.findUnique({ where: { slug } })
    if (item) {
      const title = `${item.title} — KTI Marketing Portfolio`
      const description = item.description ?? `${item.category ? item.category + ' · ' : ''}Explore our work on ${item.title}.`
      return {
        title, description,
        openGraph: { title, description, type: 'article' },
        twitter: { card: 'summary_large_image', title, description },
      }
    }
  } catch { /* fall through */ }
  return {}
}

function toEmbedUrl(url: string): string {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (m) return `https://www.youtube.com/embed/${m[1]}`
  if (url.includes('youtube.com/embed/')) return url
  return url
}

type Phase = { num?: string; title?: string; body?: string }
type Result = { stat?: string; label?: string }

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let item: Awaited<ReturnType<typeof prisma.portfolioItem.findUnique>> = null
  try {
    item = await prisma.portfolioItem.findUnique({ where: { slug } })
  } catch {}
  if (!item || !item.isPublished) notFound()

  const images: string[] = Array.isArray(item.imageUrls) ? (item.imageUrls as string[]) : []

  // Merge videoUrls + legacy youtubeUrl
  const rawVideos: string[] = Array.isArray(item.videoUrls) ? (item.videoUrls as string[]) : []
  const videos = rawVideos.length > 0
    ? rawVideos
    : item.youtubeUrl ? [item.youtubeUrl] : []
  const embedUrls = videos.map(toEmbedUrl).filter(Boolean)

  const phases: Phase[] = Array.isArray(item.phases) ? (item.phases as Phase[]) : []
  const results: Result[] = Array.isArray(item.results) ? (item.results as Result[]) : []
  const services: string[] = Array.isArray(item.services) ? item.services : []
  const deliverables: string[] = Array.isArray(item.deliverables) ? item.deliverables : []

  const hasCaseStudy = !!(item.challenge || item.solution || phases.length || results.length || services.length || deliverables.length || item.quote)

  return (
    <main className="portfolio-detail">

      {/* ── 1. Hero ─────────────────────────────────────── */}
      <section className="pd-hero">
        <div className="pd-hero__bg" aria-hidden="true">
          <div className="pd-hero__glow-1" />
          <div className="pd-hero__glow-2" />
          <div className="pd-hero__grid" />
        </div>
        <div className="container pd-hero__inner">
          <nav className="pd-breadcrumb" aria-label="Breadcrumb">
            <Link href="/portfolio">Portfolio</Link>
            <span aria-hidden="true">›</span>
            <span>{item.title}</span>
          </nav>
          <div className="pd-hero__meta-row">
            {item.category && <span className="pd-hero__tag">{item.category}</span>}
            {item.client && <span className="pd-hero__client">Client: <strong>{item.client}</strong></span>}
          </div>
          <h1 className="pd-hero__title">{item.title}</h1>
          {item.description && <p className="pd-hero__description">{item.description}</p>}
        </div>
      </section>

      {/* ── 2. Image Gallery ────────────────────────────── */}
      {images.length > 0 && (
        <section className="pd-gallery-section">
          <div className="container">
            <div className="pd-section-header">
              <p className="pd-section-eyebrow">Image Gallery</p>
              <h2 className="pd-section-title">The Work, <span>Up Close.</span></h2>
            </div>
            <div className="pd-gallery">
              {images.map((url, i) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pd-gallery__item"
                  aria-label={`View image ${i + 1} full size`}
                >
                  <img
                    src={url}
                    alt={`${item.title} — work image ${i + 1}`}
                    loading={i === 0 ? 'eager' : 'lazy'}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 3. Video Gallery ────────────────────────────── */}
      {embedUrls.length > 0 && (
        <section className="pd-video-gallery-section">
          <div className="container">
            <div className="pd-section-header" style={{ textAlign: 'center' }}>
              <p className="pd-section-eyebrow">Video Gallery</p>
              <h2 className="pd-section-title">Watch It <span>Come to Life.</span></h2>
            </div>
            <div className={`pd-video-gallery pd-video-gallery--${embedUrls.length === 1 ? 'single' : 'grid'}`}>
              {embedUrls.map((src, i) => (
                <div key={i} className="pd-video-item">
                  <div className="pd-video-glow" aria-hidden="true" />
                  <div className="pd-video-frame-outer">
                    <div className="pd-video-frame">
                      <iframe
                        src={src}
                        title={`${item.title} — video ${i + 1}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 4. Case Study ───────────────────────────────── */}
      {hasCaseStudy && (
        <section className="pd-case-section">
          <div className="pd-case-section__bg" aria-hidden="true" />
          <div className="container">

            <div className="pd-section-header" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <p className="pd-section-eyebrow">Case Study</p>
              <h2 className="pd-section-title">How We <span>Made It Happen.</span></h2>
            </div>

            {/* Challenge & Solution */}
            {(item.challenge || item.solution) && (
              <div className="pd-cs-two-col">
                {item.challenge && (
                  <div className="pd-cs-block pd-cs-block--challenge">
                    <div className="pd-cs-block__icon">⚡</div>
                    <h3 className="pd-cs-block__title">The Challenge</h3>
                    <p className="pd-cs-block__body">{item.challenge}</p>
                  </div>
                )}
                {item.solution && (
                  <div className="pd-cs-block pd-cs-block--solution">
                    <div className="pd-cs-block__icon">✦</div>
                    <h3 className="pd-cs-block__title">The Solution</h3>
                    <p className="pd-cs-block__body">{item.solution}</p>
                  </div>
                )}
              </div>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="pd-results">
                {results.map((r, i) => (
                  <div key={i} className="pd-result-card">
                    <span className="pd-result-card__stat">{r.stat}</span>
                    <span className="pd-result-card__label">{r.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Process Phases */}
            {phases.length > 0 && (
              <div className="pd-phases">
                <h3 className="pd-phases__heading">Our Process</h3>
                <div className="pd-phases__list">
                  {phases.map((p, i) => (
                    <div key={i} className="pd-phase">
                      <div className="pd-phase__num">{p.num ?? String(i + 1).padStart(2, '0')}</div>
                      <div className="pd-phase__content">
                        <h4 className="pd-phase__title">{p.title}</h4>
                        {p.body && <p className="pd-phase__body">{p.body}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services & Deliverables */}
            {(services.length > 0 || deliverables.length > 0) && (
              <div className="pd-sd-grid">
                {services.length > 0 && (
                  <div className="pd-sd-col">
                    <h3 className="pd-sd-col__title">Services Provided</h3>
                    <ul className="pd-sd-list">
                      {services.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                )}
                {deliverables.length > 0 && (
                  <div className="pd-sd-col">
                    <h3 className="pd-sd-col__title">Deliverables</h3>
                    <ul className="pd-sd-list">
                      {deliverables.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Testimonial */}
            {item.quote && (
              <figure className="pd-testimonial">
                <blockquote className="pd-testimonial__quote">&ldquo;{item.quote}&rdquo;</blockquote>
                <figcaption className="pd-testimonial__author">
                  {item.quoteName && <strong>{item.quoteName}</strong>}
                  {item.quoteRole && <span>{item.quoteRole}</span>}
                  {item.quoteCompany && <span>{item.quoteCompany}</span>}
                </figcaption>
              </figure>
            )}

          </div>
        </section>
      )}

      {/* ── 5. Footer CTA ───────────────────────────────── */}
      <section className="pd-footer-cta">
        <div className="container pd-footer-cta__inner">
          <div className="pd-footer-cta__text">
            <p className="pd-footer-cta__eyebrow">Let&apos;s Work Together</p>
            <h2 className="pd-footer-cta__title">Like What You See?</h2>
            <p className="pd-footer-cta__sub">Tell us about your project and we&apos;ll build something worth showing off.</p>
          </div>
          <div className="pd-footer-cta__actions">
            <Link href="/contact" className="btn btn-primary">Start a Project →</Link>
            <Link href="/portfolio" className="btn btn-outline">← All Work</Link>
          </div>
        </div>
      </section>

    </main>
  )
}
