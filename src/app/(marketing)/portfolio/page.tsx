import type { Metadata } from 'next'
import Link from 'next/link'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import PageCTA from '@/components/ui/PageCTA'
import './Portfolio.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('portfolio')
  return buildMetadata(seo, { title: 'Portfolio — Our Work', description: 'Browse our portfolio of work — brand campaigns, photography, social media, video production and more.' })
}

type PortfolioItem = {
  id: string; slug: string; title: string; category: string | null
  imageUrls: unknown; youtubeUrl: string | null; sortOrder: number
}

function getYoutubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  return m ? m[1] : null
}

function getThumbnail(item: PortfolioItem): string | null {
  const images = Array.isArray(item.imageUrls) ? item.imageUrls as string[] : []
  if (images.length > 0) return images[0]
  if (item.youtubeUrl) {
    const id = getYoutubeId(item.youtubeUrl)
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`
  }
  return null
}

export default async function PortfolioPage() {
  let items: PortfolioItem[] = []
  try {
    items = await prisma.portfolioItem.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, slug: true, title: true, category: true, imageUrls: true, youtubeUrl: true, sortOrder: true },
    }) as unknown as PortfolioItem[]
  } catch { /* empty state */ }

  return (
    <main className="portfolio-page">
      <section className="portfolio-hero">
        <div className="portfolio-hero__bg" aria-hidden="true">
          <div className="portfolio-hero__shape--1" />
          <div className="portfolio-hero__shape--2" />
        </div>
        <div className="container portfolio-hero__inner">
          <p className="portfolio-hero__eyebrow">Our Work</p>
          <h1 className="portfolio-hero__title">Campaigns That <span className="portfolio-hero__accent">Move the Needle.</span></h1>
          <p className="portfolio-hero__sub">A showcase of our creative and strategic work across brands, industries, and channels.</p>
        </div>
      </section>

      <section className="portfolio-grid-section">
        <div className="container">
          {items.length === 0 ? (
            <div className="portfolio-empty">
              <p>No portfolio items published yet. Check back soon.</p>
            </div>
          ) : (
            <div className="portfolio-grid">
              {items.map(item => {
                const thumb = getThumbnail(item)
                const hasVideo = !!item.youtubeUrl
                return (
                  <Link key={item.id} href={`/portfolio/${item.slug}`} className="portfolio-card">
                    <div className="portfolio-card__thumb">
                      {thumb ? (
                        <img src={thumb} alt={item.title} loading="lazy" />
                      ) : (
                        <span className="portfolio-card__placeholder" aria-hidden="true">🖼</span>
                      )}
                      {hasVideo && (
                        <span className="portfolio-card__video-badge">
                          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M6.5 4.5l5 3.5-5 3.5V4.5z"/></svg>
                          Video
                        </span>
                      )}
                    </div>
                    <div className="portfolio-card__body">
                      {item.category && <p className="portfolio-card__category">{item.category}</p>}
                      <h2 className="portfolio-card__title">{item.title}</h2>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <PageCTA
        eyebrow="Let's Work Together"
        title={<>Ready to Create<br /><span className="accent">Something Great?</span></>}
        sub="Tell us about your project and let's build something worth showing off."
        primaryLabel="Get a Free Strategy Call →"
        note="No commitment · 100% free strategy session"
      />
    </main>
  )
}
