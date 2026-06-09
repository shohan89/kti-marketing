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

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  let item: Awaited<ReturnType<typeof prisma.portfolioItem.findUnique>> = null
  try {
    item = await prisma.portfolioItem.findUnique({ where: { slug } })
  } catch {}
  if (!item || !item.isPublished) notFound()

  const images: string[] = Array.isArray(item.imageUrls) ? (item.imageUrls as string[]) : []
  const embedUrl = item.youtubeUrl ? toEmbedUrl(item.youtubeUrl) : null
  const hasGallery = images.length > 0
  const hasVideo = !!embedUrl
  const hasDetails = !!(item.description || item.category)

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
          {item.category && <span className="pd-hero__tag">{item.category}</span>}
          <h1 className="pd-hero__title">{item.title}</h1>
          {item.description && (
            <p className="pd-hero__description">{item.description}</p>
          )}
        </div>
      </section>

      {/* ── 2. Gallery ──────────────────────────────────── */}
      {hasGallery && (
        <section className="pd-gallery-section">
          <div className="container">
            <div className="pd-section-header">
              <p className="pd-section-eyebrow">Gallery</p>
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

      {/* ── 3. Project Details ──────────────────────────── */}
      {hasDetails && (
        <section className="pd-details-section">
          <div className="container pd-details-grid">

            {/* Left */}
            <div className="pd-details-body">
              <p className="pd-section-eyebrow">About the Project</p>
              <h2 className="pd-section-title" style={{ color: '#fff', marginBottom: '1.75rem' }}>
                Behind the <span>Campaign.</span>
              </h2>
              {item.description && (
                <p className="pd-details-text">{item.description}</p>
              )}
              <div className="pd-details-cta-inline">
                <div>
                  <p>Have a similar project in mind?</p>
                  <span>We offer a free 30-minute strategy session — no pitch, just clarity.</span>
                </div>
                <Link href="/contact" className="btn btn-primary" style={{ flexShrink: 0 }}>Book a Free Call</Link>
              </div>
            </div>

            {/* Right: meta card */}
            <aside className="pd-meta-card">
              <p className="pd-meta-card__label">Project Info</p>
              {item.category && (
                <div className="pd-meta-row">
                  <span className="pd-meta-key">Category</span>
                  <span className="pd-meta-val">{item.category}</span>
                </div>
              )}
              <div className="pd-meta-row">
                <span className="pd-meta-key">Agency</span>
                <span className="pd-meta-val">KTI Marketing</span>
              </div>
              <div className="pd-meta-row">
                <span className="pd-meta-key">Media</span>
                <span className="pd-meta-val">
                  {[hasGallery && `${images.length} image${images.length !== 1 ? 's' : ''}`, hasVideo && 'Video'].filter(Boolean).join(' · ') || '—'}
                </span>
              </div>
              <Link href="/contact" className="btn btn-primary">Start a Similar Project →</Link>
            </aside>

          </div>
        </section>
      )}

      {/* ── 4. Video ────────────────────────────────────── */}
      {hasVideo && (
        <section className="pd-video-section">
          <div className="container pd-video-inner">
            <div className="pd-section-header">
              <p className="pd-section-eyebrow">Video</p>
              <h2 className="pd-section-title">Watch It <span>Come to Life.</span></h2>
            </div>
            <div className="pd-video-wrap">
              <div className="pd-video-glow" aria-hidden="true" />
              <div className="pd-video-frame-outer">
                <div className="pd-video-frame">
                  <iframe
                    src={embedUrl!}
                    title={`${item.title} — video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
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
