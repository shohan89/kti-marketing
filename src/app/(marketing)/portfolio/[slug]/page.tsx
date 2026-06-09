import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import PageCTA from '@/components/ui/PageCTA'
import './PortfolioDetail.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  try {
    const item = await prisma.portfolioItem.findUnique({ where: { slug } })
    if (item) {
      const title = `${item.title} — KTI Marketing Portfolio`
      const description = item.description ?? `${item.category ? item.category + ' · ' : ''}See our work on ${item.title}.`
      return { title, description, openGraph: { title, description, type: 'article' } }
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

  const images: string[] = Array.isArray(item.imageUrls) ? item.imageUrls as string[] : []
  const embedUrl = item.youtubeUrl ? toEmbedUrl(item.youtubeUrl) : null

  return (
    <main className="portfolio-detail">
      <section className="pd-hero">
        <div className="pd-hero__bg" aria-hidden="true"><div className="pd-hero__shape" /></div>
        <div className="container pd-hero__inner">
          <nav className="pd-breadcrumb" aria-label="Breadcrumb">
            <Link href="/portfolio">Portfolio</Link>
            <span aria-hidden="true">›</span>
            <span>{item.title}</span>
          </nav>
          {item.category && <span className="pd-category">{item.category}</span>}
          <h1 className="pd-title">{item.title}</h1>
          {item.description && <p className="pd-description">{item.description}</p>}
        </div>
      </section>

      {(images.length > 0 || embedUrl) && (
        <section className="pd-media">
          <div className="container">
            {images.length > 0 && (
              <>
                <p className="pd-section-label">Work Images</p>
                <div className="pd-gallery">
                  {images.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="pd-gallery__item">
                      <img src={url} alt={`${item.title} — image ${i + 1}`} loading="lazy" />
                    </a>
                  ))}
                </div>
              </>
            )}
            {embedUrl && (
              <div className="pd-video">
                <p className="pd-section-label">Video</p>
                <div className="pd-video__frame">
                  <iframe
                    src={embedUrl}
                    title={`${item.title} — video`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="pd-footer-cta">
        <div className="container pd-footer-cta__inner">
          <div className="pd-footer-cta__text">
            <h2>Like what you see?</h2>
            <p>Let&apos;s talk about what we can create for your brand.</p>
          </div>
          <div className="pd-footer-cta__actions">
            <Link href="/contact" className="btn btn-primary">Start a Project →</Link>
            <Link href="/portfolio" className="btn btn-outline">← Back to Portfolio</Link>
          </div>
        </div>
      </section>

      <PageCTA
        eyebrow="Let's Work Together"
        title={<>Ready to Create<br /><span className="accent">Something Great?</span></>}
        sub="Tell us about your project and let's build something worth showing off."
        primaryLabel="Get a Free Strategy Call →"
        secondaryLabel="View More Work"
        secondaryTo="/portfolio"
      />
    </main>
  )
}
