import type { Metadata } from 'next'
import Image from 'next/image'
import PageCTA from '@/components/ui/PageCTA'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import './OurThemes.css'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('themes')
  return buildMetadata(seo, { title: 'Our Themes — Ready-Made E-commerce Designs', description: 'Pick a design, customise it to your brand, and launch faster. Every theme is mobile-first and optimised to turn visitors into buyers.' })
}

const THEMES = [
  { id: 1, name: 'Theme One', tags: ['E-commerce', 'Fashion'], description: 'Classic store layout with bold category navigation, product grids, and a promotional banner header. Ideal for fashion and apparel brands.', image: '/themes/theme-1.png', url: 'https://ecom.prodevs.com.bd/public/theme-1' },
  { id: 2, name: 'Theme Two', tags: ['Boutique', 'Multi-Category'], description: 'Modern boutique design featuring circular category icons, curated product sections, and a clean white aesthetic built for conversions.', image: '/themes/theme-2.png', url: 'https://ecom.prodevs.com.bd/theme-2' },
  { id: 3, name: 'Theme Three', tags: ['Fashion', 'Multi-Section'], description: 'Fashion-forward layout with a full-width hero banner, shop-by-category strip, and multiple product showcase sections for high-volume stores.', image: '/themes/theme-3.png', url: 'https://ecom.prodevs.com.bd/theme-3' },
  { id: 4, name: 'Theme Four', tags: ['Department Store', 'Sidebar Nav'], description: 'Full-featured department store theme with sidebar category navigation, featured products, and a comprehensive footer for large catalogues.', image: '/themes/theme-4.png', url: 'https://ecom.prodevs.com.bd/theme-4' },
]

function ThemeCard({ theme }: { theme: typeof THEMES[0] }) {
  return (
    <div className="theme-card">
      <div className="theme-card__chrome">
        <div className="theme-card__dots" aria-hidden="true"><span /><span /><span /></div>
        <div className="theme-card__urlbar">{theme.url.replace('https://', '')}</div>
      </div>
      <div className="theme-card__viewport">
        <Image src={theme.image} alt={`${theme.name} preview`} className="theme-card__screenshot" width={800} height={2000} loading="lazy" />
        <div className="theme-card__overlay" aria-hidden="true" />
      </div>
      <div className="theme-card__body">
        <div className="theme-card__meta">{theme.tags.map(t => (<span key={t} className="theme-card__tag">{t}</span>))}</div>
        <h3 className="theme-card__name">{theme.name}</h3>
        <p className="theme-card__desc">{theme.description}</p>
        <a href={theme.url} target="_blank" rel="noopener noreferrer" className="theme-card__cta">
          Live Preview
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M6 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /><path d="M9 2h5m0 0v5m0-5L8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </a>
      </div>
    </div>
  )
}

export default function ThemesPage() {
  return (
    <main className="themes-page">
      <section className="themes-hero">
        <div className="container">
          <p className="eyebrow fade-up" style={{ color: '#f87171' }}>E-commerce Solutions</p>
          <h1 className="themes-hero__title fade-up-1">Ready-Made Themes for<br /><span className="accent">Your Online Store.</span></h1>
          <p className="themes-hero__sub fade-up-2">Pick a design, customise it to your brand, and launch faster. Every theme is built for performance, mobile-first, and optimised to turn visitors into buyers.</p>
          <div className="themes-hero__badges fade-up-3">
            <span className="themes-badge"><span className="themes-badge__dot" aria-hidden="true" />{THEMES.length} Themes Available</span>
            <span className="themes-badge"><span className="themes-badge__dot" aria-hidden="true" />Mobile-First Design</span>
            <span className="themes-badge"><span className="themes-badge__dot" aria-hidden="true" />Fully Customisable</span>
          </div>
        </div>
      </section>

      <section className="themes-grid-section">
        <div className="container">
          <div className="themes-section__header reveal">
            <p className="eyebrow">Browse &amp; Preview</p>
            <h2>Choose Your <span className="accent">Perfect Theme</span></h2>
            <p className="themes-section__sub">Hover over any theme to see a live scrolling preview of the full page.</p>
          </div>
          <div className="themes-grid">
            {THEMES.map((theme, i) => (
              <div key={theme.id} className="reveal" style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}>
                <ThemeCard theme={theme} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        eyebrow="Ready to Launch?"
        title={<>Get Your Store<br /><span className="accent">Live Today.</span></>}
        sub="Our team will set up your chosen theme, customise it to match your brand, and have your e-commerce store ready to sell — faster than you think."
        primaryLabel="Get Started →"
        secondaryLabel="View Our Services"
        secondaryTo="/services"
      />
    </main>
  )
}
