'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { servicesData, latestPosts } from '@/data/staticData'
import './Home.css'

// ── Default hardcoded data (used as fallbacks when CMS has no value) ────────

const MARQUEE_ITEMS = ['Social Media Management', 'Content Creation', 'Ads Campaign Management', 'Copywriting', 'Product Photography', 'Model Photography', 'Video Production', 'Influencer Marketing', 'Website Maintenance']
export interface BrandItem { name: string; logoUrl?: string }
const CLIENT_BRANDS: BrandItem[] = [
  { name: 'Luxe Apparel Co.' }, { name: 'TechFlow Inc.' }, { name: 'Wellness Hub' },
  { name: 'Nova Skincare' }, { name: 'Urban Eats' }, { name: 'PeakPro Fitness' },
  { name: 'Elevate Realty' }, { name: 'Bloom Cosmetics' },
]
const DEFAULT_STATS = [
  { num: '120+', label: 'Brands Grown' },
  { num: '3.2×', label: 'Average ROI' },
  { num: '$40M+', label: 'Revenue Generated' },
  { num: '94%', label: 'Client Retention' },
]
const WHY_PILLARS = [
  { icon: '📈', title: 'Results, Not Excuses', body: 'Every engagement has clear KPIs from day one. We report on revenue, ROAS, leads, and conversions — not vanity metrics like impressions and reach.' },
  { icon: '🎨', title: 'Bold Creative Thinking', body: 'Great creative is your biggest competitive advantage. Our in-house team builds campaigns that stop the scroll and demand attention.' },
  { icon: '🧠', title: 'Strategy Comes First', body: 'We never jump straight to execution. Every client gets a custom go-to-market plan grounded in audience research and competitive intelligence.' },
  { icon: '🤝', title: 'Relentless Support', body: 'A dedicated account team, weekly updates, and a direct line to the people doing the work — no middlemen passing messages.' },
]
const PORTFOLIO = [
  { tag: 'E-Commerce', category: 'Social Media + Paid Ads', client: 'Luxe Apparel Co.', title: 'From Zero to $1.2M in Online Sales', body: 'Rebuilt their entire social presence, launched targeted Meta ads, and delivered 7.4× follower growth alongside a 340% increase in e-commerce revenue in under 9 months.', metrics: [{ num: '7.4×', label: 'Follower Growth' }, { num: '340%', label: 'Revenue Increase' }] },
  { tag: 'SaaS', category: 'Performance Ads + Content', client: 'TechFlow Inc.', title: 'Scaling a SaaS Brand to 4.6× ROAS', body: 'Overhauled their paid media strategy, developed conversion-focused ad creative, and rebuilt landing pages to turn a losing ad account into their fastest-growing revenue channel.', metrics: [{ num: '4.6×', label: 'ROAS Achieved' }, { num: '-62%', label: 'Cost Per Lead' }] },
  { tag: 'Health & Wellness', category: 'Influencer + Content Strategy', client: 'Wellness Hub', title: '287% More Leads in 90 Days', body: 'Launched an influencer campaign across micro and macro creators, paired with a content engine that tripled organic reach and filled the pipeline with qualified leads.', metrics: [{ num: '+287%', label: 'Qualified Leads' }, { num: '3.1M', label: 'Organic Impressions' }] },
]
const PROCESS_STEPS = [
  { num: '01', title: 'Strategy', body: 'We audit your brand, analyze competitors, and build a tailored go-to-market plan with clear KPIs, channel priorities, and creative direction.' },
  { num: '02', title: 'Execution', body: 'Our team launches campaigns across every relevant channel — moving fast, testing constantly, and iterating relentlessly to maximize performance.' },
  { num: '03', title: 'Growth', body: "We double down on what works, eliminate what doesn't, and scale your most profitable channels to deliver compounding returns month over month." },
]
const TESTIMONIALS = [
  { quote: "KTI grew our Instagram from 4,200 to 31,000 followers in 6 months and turned it into our number one revenue channel. The ROI speaks for itself.", name: 'Amira Hassan', role: 'CEO', company: 'Luxe Apparel Co.', result: '7.4× follower growth', rating: 5 },
  { quote: "Our ROAS jumped from 1.8× to 4.6× within the first quarter. KTI's paid media team understands performance advertising at a level I haven't seen elsewhere. They don't just run ads — they build systems that compound.", name: 'Daniel Osei', role: 'Head of Growth', company: 'TechFlow Inc.', result: '4.6× ROAS achieved', rating: 5 },
  { quote: "287% increase in qualified leads in under 90 days. They don't just promise results — they build systems that deliver them consistently, month after month.", name: 'Priya Nair', role: 'Founder', company: 'Wellness Hub', result: '+287% qualified leads', rating: 5 },
  { quote: "From day one, KTI understood our brand voice and target customer better than agencies we'd worked with for years. The content they produce actually converts — every piece earns its place.", name: 'Marcus Reid', role: 'CMO', company: 'Nova Skincare', result: '2.8× conversion rate', rating: 5 },
  { quote: "We hit Q4 revenue six weeks early. The influencer strategy they built was surgical — every creator was perfectly matched to our audience and brand values.", name: 'Sophie Laurent', role: 'Director of Marketing', company: 'Bloom Cosmetics', result: '6 weeks ahead of target', rating: 5 },
  { quote: "KTI rebuilt our paid search from scratch. CPC dropped 41%, conversion rate doubled, and we're generating more revenue on half the ad spend.", name: 'James Okafor', role: 'CEO', company: 'PeakPro Fitness', result: '-41% CPC · 2× conversions', rating: 5 },
  { quote: "I was skeptical about bringing on another agency after two disappointing experiences. KTI changed that completely. In five months they rebuilt our brand identity and drove 5.1× revenue growth. Genuinely transformational.", name: 'Olivia Thornton', role: 'Founder', company: 'Glow Studio', result: '5.1× revenue growth', rating: 5 },
  { quote: "We needed to generate high-quality inbound leads without burning through our budget. KTI delivered a 210% lift in qualified inbound within the first quarter.", name: 'Kwame Mensah', role: 'CEO', company: 'Meridian Capital', result: '+210% inbound leads', rating: 5 },
  { quote: "Our content was invisible before KTI. They built a full content engine and we went from almost no organic traffic to 3.8× engagement across every platform in four months.", name: 'Lena Fischer', role: 'Head of Marketing', company: 'Arbor Health', result: '3.8× content engagement', rating: 5 },
  { quote: "KTI redesigned the entire funnel from the first ad impression through onboarding, and our CAC dropped 55%. The growth is now sustainable, not just fast.", name: 'Rafael Souza', role: 'Growth Lead', company: 'Stackly', result: '-55% CAC', rating: 5 },
]

const INITIAL_COUNT = 6

// ── Types ────────────────────────────────────────────────────────────────────

interface StatItem { num: string; label: string }
interface PillarItem { icon: string; title: string; body: string }
interface PortfolioItem { tag: string; category: string; client: string; title: string; body: string; metrics: { num: string; label: string }[] }
interface ProcessStep { num: string; title: string; body: string }
interface TestimonialItem { quote: string; name: string; role: string; company: string; result: string; rating: number }

export interface HomepageContent {
  hero?: { badge?: string; headline?: string; subheadline?: string; cta1Text?: string; cta1Url?: string; cta2Text?: string; cta2Url?: string }
  stats?: StatItem[]
  brands?: BrandItem[]
  marquee?: string[]
  services?: { eyebrow?: string; title?: string; subtitle?: string }
  why?: { eyebrow?: string; title?: string; body?: string; pillars?: PillarItem[] }
  video?: { eyebrow?: string; title?: string }
  portfolio?: { eyebrow?: string; title?: string; subtitle?: string }
  process?: { eyebrow?: string; title?: string; steps?: ProcessStep[] }
  testimonials?: { eyebrow?: string; title?: string }
  blog?: { eyebrow?: string; title?: string }
  cta?: { eyebrow?: string; title?: string; body?: string; btnText?: string; btnUrl?: string; subtext?: string }
}

interface Props {
  content?: HomepageContent
  testimonials?: TestimonialItem[]
  caseStudies?: PortfolioItem[]
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function renderLines(text: string) {
  return text.split('\n').map((line, i, arr) => (
    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
  ))
}

// ── Component ────────────────────────────────────────────────────────────────

export default function HomeClient({ content = {}, testimonials: dbTestimonials, caseStudies: dbCaseStudies }: Props) {
  const heroRef       = useRef<HTMLElement>(null)
  const cursorGlowRef = useRef<HTMLDivElement>(null)
  const [expanded, setExpanded] = useState(false)

  // ── Merge CMS values with defaults ────────────────────────────────────────
  const hero   = content.hero ?? {}
  const heroStats     = content.stats?.length      ? content.stats      : DEFAULT_STATS
  const rawBrands = content.brands?.length ? content.brands : CLIENT_BRANDS
  const brands: BrandItem[] = rawBrands.map(b => typeof b === 'string' ? { name: b as string } : b)
  const marqueeItems  = content.marquee?.length    ? content.marquee    : MARQUEE_ITEMS
  const pillars       = content.why?.pillars?.length ? content.why.pillars : WHY_PILLARS
  const portfolioItems: PortfolioItem[] = dbCaseStudies?.length ? dbCaseStudies : PORTFOLIO
  const processSteps  = content.process?.steps?.length ? content.process.steps : PROCESS_STEPS
  const testimonialList: TestimonialItem[] = dbTestimonials?.length ? dbTestimonials : TESTIMONIALS
  const marqueeStr    = marqueeItems.map(i => `${i}  ·  `).join('')
  const posts         = latestPosts()

  useEffect(() => {
    const heroEl = heroRef.current; const glow = cursorGlowRef.current
    if (!heroEl || !glow) return
    const onMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect()
      glow.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px) translate(-50%, -50%)`
    }
    const show = () => { glow.style.opacity = '1' }
    const hide = () => { glow.style.opacity = '0' }
    heroEl.addEventListener('mousemove', onMove, { passive: true })
    heroEl.addEventListener('mouseenter', show)
    heroEl.addEventListener('mouseleave', hide)
    return () => { heroEl.removeEventListener('mousemove', onMove); heroEl.removeEventListener('mouseenter', show); heroEl.removeEventListener('mouseleave', hide) }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const heroEl = heroRef.current; if (!heroEl) return
    const layers = heroEl.querySelectorAll<HTMLElement>('.hero-parallax')
    let rafId: number
    const onScroll = () => { cancelAnimationFrame(rafId); rafId = requestAnimationFrame(() => { const sy = window.scrollY; if (heroEl.getBoundingClientRect().bottom < 0) return; layers.forEach(layer => { const speed = parseFloat(layer.dataset.speed || '0.08'); layer.style.transform = `translateY(${sy * speed}px)` }) }) }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(rafId) }
  }, [])

  return (
    <main className="home">
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="home-hero" ref={heroRef}>
        <div className="home-hero__bg" aria-hidden="true">
          <div className="hero-cursor-glow" ref={cursorGlowRef} />
          <div className="hero-grid-overlay" />
          <div className="hero-parallax" data-speed="0.08"><div className="hero-shape hero-shape--1" /></div>
          <div className="hero-parallax" data-speed="0.14"><div className="hero-shape hero-shape--2" /></div>
          <div className="hero-parallax" data-speed="0.05"><div className="hero-shape hero-shape--3" /></div>
          <div className="hero-parallax" data-speed="0.11"><div className="hero-shape hero-shape--4" /></div>
        </div>
        <div className="container home-hero__container">
          <div className="home-hero__layout">
            <div className="home-hero__left">
              <div className="hero-eyebrow-badge fade-up">
                <span className="hero-eyebrow-badge__dot" aria-hidden="true" />
                {hero.badge ?? 'Full-Service Growth Agency'}
              </div>
              {hero.headline ? (
                <h1 className="home-hero__title fade-up-1">{renderLines(hero.headline)}</h1>
              ) : (
                <h1 className="home-hero__title fade-up-1">Bold Strategy.<br />Real{' '}<span className="hero-title__highlight">Revenue.</span><br />Zero Compromises.</h1>
              )}
              <p className="home-hero__sub fade-up-2">
                {hero.subheadline ?? 'We build performance campaigns and bold creative for ambitious brands ready to stop blending in — and start owning their market.'}
              </p>
              <div className="home-hero__cta fade-up-3">
                <Link href={hero.cta1Url ?? '/contact'} className="btn btn-primary">{hero.cta1Text ?? 'Start Growing'}</Link>
                <Link href={hero.cta2Url ?? '/contact'} className="btn-hero-outline">{hero.cta2Text ?? 'Book a Strategy Call'}</Link>
              </div>
            </div>
            <div className="home-hero__right fade-up-2" aria-hidden="true">
              <div className="hero-visual">
                <div className="hero-dashboard">
                  <div className="hero-db__header">
                    <div className="hero-db__dots"><span /><span /><span /></div>
                    <span className="hero-db__label">Campaign Performance</span>
                    <span className="hero-db__live"><span className="hero-db__live-dot" />Live</span>
                  </div>
                  <div className="hero-db__toolbar">
                    <span className="hero-db__range">Last 30 days <span className="hero-db__range-caret">▾</span></span>
                    <span className="hero-db__export">↓ Export</span>
                  </div>
                  <div className="hero-db__kpis">
                    {[{ lbl: 'ROAS', val: '4.6×', delta: '+127%', d: '0.30s' }, { lbl: 'Revenue', val: '$48.2K', delta: '+94%', d: '0.42s' }, { lbl: 'Leads', val: '1,284', delta: '+63%', d: '0.54s' }, { lbl: 'CTR', val: '8.4%', delta: '+2.1%', d: '0.66s' }].map(({ lbl, val, delta, d }) => (
                      <div className="hero-db__kpi" key={lbl} style={{ '--d': d } as React.CSSProperties}>
                        <span className="hero-db__kpi-lbl">{lbl}</span>
                        <span className="hero-db__kpi-val">{val}</span>
                        <span className="hero-db__kpi-delta">↑ {delta}</span>
                      </div>
                    ))}
                  </div>
                  <div className="hero-db__chart">
                    <div className="hero-db__chart-yticks"><span>$60K</span><span>$40K</span><span>$20K</span><span>$0</span></div>
                    <div className="hero-db__chart-canvas">
                      <svg className="hero-db__svg" viewBox="0 0 260 68" preserveAspectRatio="none" aria-hidden="true">
                        <defs><linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D7262E" stopOpacity="0.3" /><stop offset="100%" stopColor="#D7262E" stopOpacity="0.02" /></linearGradient></defs>
                        <path className="hero-db__area" d="M0,62 C20,60 35,55 55,50 C75,45 90,38 110,30 C130,22 145,17 165,13 C185,9 200,7 220,6 C240,5 250,4 260,4 L260,68 L0,68 Z" fill="url(#heroAreaGrad)" />
                        <path className="hero-db__line" pathLength="1" d="M0,62 C20,60 35,55 55,50 C75,45 90,38 110,30 C130,22 145,17 165,13 C185,9 200,7 220,6 C240,5 250,4 260,4" fill="none" stroke="#D7262E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <circle className="hero-db__endpoint" cx="257" cy="4.5" r="3" fill="#D7262E" />
                      </svg>
                      <div className="hero-db__x-labels"><span>Jan</span><span>Mar</span><span>May</span><span>Jun</span><span>Jul</span><span>Now</span></div>
                    </div>
                  </div>
                  <div className="hero-db__channels">
                    {[{ name: 'Meta Ads', pct: 85, color: '#818cf8', d: '1.2s' }, { name: 'Google', pct: 62, color: '#34d399', d: '1.45s' }, { name: 'TikTok', pct: 48, color: '#f87171', d: '1.7s' }].map(({ name, pct, color, d }) => (
                      <div className="hero-db__channel" key={name}>
                        <span className="hero-db__ch-name">{name}</span>
                        <div className="hero-db__ch-track"><div className="hero-db__ch-fill" style={{ '--pct': `${pct}%`, '--color': color, '--d': d } as React.CSSProperties} /></div>
                        <span className="hero-db__ch-pct" style={{ color }}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="hero-float-card hero-float-card--tl"><div className="hero-fc__live-dot" /><div className="hero-fc__body"><strong>ROAS Target Hit</strong><span>4.6× · Beat goal by 53%</span></div></div>
                <div className="hero-float-card hero-float-card--br"><div className="hero-fc__stars">★★★★★</div><div className="hero-fc__rating-text">5.0 Average Rating</div></div>
                <div className="hero-skill-badge hero-skill-badge--a" aria-hidden="true"><span className="hero-skill-badge__dot" />Performance Marketing</div>
                <div className="hero-skill-badge hero-skill-badge--b" aria-hidden="true"><span className="hero-skill-badge__dot" />Creative Strategy</div>
              </div>
            </div>
          </div>
        </div>
        <div className="home-hero__stats fade-up-5">
          <div className="container">
            <div className="hero-stats-row">
              {heroStats.map(({ num, label }) => (
                <div className="hero-stat" key={label}><span className="hero-stat__num">{num}</span><span className="hero-stat__label">{label}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Client Brands ────────────────────────────────────────────── */}
      <section className="home-clients">
        <div className="container">
          <p className="home-clients__label reveal">Trusted by ambitious brands</p>
          <div className="clients-strip reveal" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
            {brands.map(brand => (
              <span className="clients-strip__brand" key={brand.name}>
                {brand.logoUrl
                  ? <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="clients-strip__logo"
                      onError={e => {
                        const img = e.target as HTMLImageElement
                        img.style.display = 'none'
                        const span = img.parentElement
                        if (span) span.textContent = brand.name
                      }}
                    />
                  : brand.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────────────── */}
      <div className="marquee-band" aria-hidden="true"><div className="marquee-track"><span className="marquee-content">{marqueeStr}{marqueeStr}</span></div></div>

      {/* ── Services ─────────────────────────────────────────────────── */}
      <section className="home-services">
        <div className="container">
          <div className="home-services__header">
            <div className="reveal">
              <p className="eyebrow">{content.services?.eyebrow ?? 'What We Do'}</p>
              {content.services?.title ? (
                <h2 className="home-services__title">{content.services.title}</h2>
              ) : (
                <h2 className="home-services__title">Every Service You Need.<br /><span className="accent">All Under One Roof.</span></h2>
              )}
            </div>
            <p className="home-services__sub reveal" style={{ '--reveal-delay': '0.12s' } as React.CSSProperties}>
              {content.services?.subtitle ?? 'From brand strategy to performance ads, content creation to influencer marketing — we own every channel of your growth.'}
            </p>
          </div>
          <div className="home-services__grid">
            {servicesData.slice(0, 6).map((s, i) => (
              <Link key={s.slug} href={`/services/${s.slug}`} className="svc-card reveal" style={{ '--reveal-delay': `${Math.min(i * 0.08, 0.4)}s` } as React.CSSProperties}>
                <h3 className="svc-card__title">{s.title}</h3>
                <p className="svc-card__desc">{s.description}</p>
                <span className="svc-card__arrow">→</span>
              </Link>
            ))}
          </div>
          <div className="home-services__footer reveal" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
            <Link href="/services" className="all-services-link">View all 9 services<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
          </div>
        </div>
      </section>

      {/* ── Why KTI ──────────────────────────────────────────────────── */}
      <section className="home-why">
        <div className="container">
          <div className="home-why__header reveal">
            <p className="eyebrow">{content.why?.eyebrow ?? 'Why KTI Marketing'}</p>
            {content.why?.title ? (
              <h2 className="home-why__title">{content.why.title}</h2>
            ) : (
              <h2 className="home-why__title">We Don&apos;t Chase Metrics.<br /><span className="accent">We Chase Revenue.</span></h2>
            )}
            <p className="home-why__body">{content.why?.body ?? 'Most agencies show you follower counts and impression graphs. We show you pipeline growth, conversion rates, and ROI.'}</p>
          </div>
          <div className="why-pillars">
            {pillars.map(({ icon, title, body }, i) => (
              <div className="why-pillar reveal" key={title} style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}>
                <span className="why-pillar__icon" aria-hidden="true">{icon}</span>
                <h3 className="why-pillar__title">{title}</h3>
                <p className="why-pillar__body">{body}</p>
              </div>
            ))}
          </div>
          <div className="home-why__cta reveal" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
            <Link href="/about" className="btn btn-primary">Our Story</Link>
            <Link href="/contact" className="btn btn-outline">Book a Call</Link>
          </div>
        </div>
      </section>

      {/* ── Video ────────────────────────────────────────────────────── */}
      <section className="home-video">
        <div className="container"><div className="home-video__header text-center reveal"><p className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>{content.video?.eyebrow ?? 'See Our Work'}</p>
          {content.video?.title ? (
            <h2 className="home-video__title">{content.video.title}</h2>
          ) : (
            <h2 className="home-video__title">Campaigns That<br /><span className="home-video__accent">Move People.</span></h2>
          )}
        </div></div>
        <div className="home-video__frame reveal" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
          <div className="home-video__player" aria-label="KTI Marketing showreel video player">
            <div className="home-video__grid-bg" aria-hidden="true" />
            <div className="home-video__glow" aria-hidden="true" />
            <div className="home-video__bars" aria-hidden="true">
              {[55,72,40,88,63,45,79,50,67,84,38,72,60,48,76].map((h, i) => (
                <div key={i} className="home-video__bar" style={{ '--h': `${h}%`, '--d': `${i * 0.06}s` } as React.CSSProperties} />
              ))}
            </div>
            <button className="home-video__play-btn" aria-label="Play showreel"><svg viewBox="0 0 24 24" fill="currentColor" width="30" height="30" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></button>
            <div className="home-video__meta" aria-hidden="true"><span className="home-video__meta-dot" /><span>KTI Marketing — Campaign Showreel</span><span className="home-video__meta-time">2:47</span></div>
          </div>
        </div>
      </section>

      {/* ── Portfolio / Case Studies ─────────────────────────────────── */}
      <section className="home-portfolio">
        <div className="container">
          <div className="home-portfolio__header">
            <div className="reveal">
              <p className="eyebrow">{content.portfolio?.eyebrow ?? 'Case Studies'}</p>
              {content.portfolio?.title ? (
                <h2 className="home-portfolio__title">{content.portfolio.title}</h2>
              ) : (
                <h2 className="home-portfolio__title">Results That<br /><span className="accent">Speak for Themselves.</span></h2>
              )}
            </div>
            <p className="home-portfolio__sub reveal" style={{ '--reveal-delay': '0.12s' } as React.CSSProperties}>
              {content.portfolio?.subtitle ?? "We don't believe in case studies that only show the highlights. Here are real campaigns with real numbers from real clients."}
            </p>
          </div>
          <div className="portfolio-grid">
            {portfolioItems.map(({ tag, category, client, title, body, metrics }, i) => (
              <div className="portfolio-card reveal" key={client} style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}>
                <div className="portfolio-card__top"><span className="portfolio-card__tag">{tag}</span><span className="portfolio-card__category">{category}</span></div>
                <h3 className="portfolio-card__title">{title}</h3>
                <p className="portfolio-card__client">{client}</p>
                <p className="portfolio-card__body">{body}</p>
                <div className="portfolio-card__metrics">{metrics.map(({ num, label }) => (<div className="portfolio-metric" key={label}><span className="portfolio-metric__num">{num}</span><span className="portfolio-metric__label">{label}</span></div>))}</div>
                <Link href="/contact" className="portfolio-card__cta">Start a Similar Project →</Link>
              </div>
            ))}
          </div>
          <div className="home-portfolio__footer reveal" style={{ '--reveal-delay': '0.1s' } as React.CSSProperties}>
            <Link href="/case-studies" className="all-services-link">View all case studies<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg></Link>
          </div>
        </div>
      </section>

      {/* ── Process ──────────────────────────────────────────────────── */}
      <section className="home-process">
        <div className="container">
          <div className="home-process__header text-center reveal">
            <p className="eyebrow">{content.process?.eyebrow ?? 'How We Work'}</p>
            {content.process?.title ? (
              <h2>{content.process.title}</h2>
            ) : (
              <h2>A Proven <span className="accent">3-Step Growth System</span></h2>
            )}
          </div>
          <div className="process-grid">
            {processSteps.map((step, i) => (
              <div className="process-step reveal" key={step.num} style={{ '--reveal-delay': `${i * 0.12}s` } as React.CSSProperties}>
                <span className="process-step__num">{step.num}</span>
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__body">{step.body}</p>
                {i < processSteps.length - 1 && <span className="process-step__connector" aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="home-testimonials">
        <div className="container">
          <div className="text-center home-testimonials__header reveal">
            <p className="eyebrow">{content.testimonials?.eyebrow ?? 'Client Results'}</p>
            {content.testimonials?.title ? (
              <h2>{content.testimonials.title}</h2>
            ) : (
              <h2>Don&apos;t Take Our Word for It.</h2>
            )}
          </div>
          <div className="testimonials-masonry">
            {testimonialList.slice(0, INITIAL_COUNT).map(({ quote, name, role, company, result, rating }, i) => (
              <div className="testimonial-card" key={name || i}>
                <div className="testimonial-card__top"><div className="testimonial-card__result">{result}</div><div className="testimonial-card__stars" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}</div></div>
                <p className="testimonial-card__quote">&ldquo;{quote}&rdquo;</p>
                <div className="testimonial-card__author"><div className="testimonial-card__avatar">{name.charAt(0)}</div><div><strong>{name}</strong><span>{role} · {company}</span></div></div>
              </div>
            ))}
          </div>
          <div className={`testimonials-extra${expanded ? ' testimonials-extra--visible' : ''}`}>
            <div className="testimonials-masonry">
              {testimonialList.slice(INITIAL_COUNT).map(({ quote, name, role, company, result, rating }, i) => (
                <div className="testimonial-card" key={name || i}>
                  <div className="testimonial-card__top"><div className="testimonial-card__result">{result}</div><div className="testimonial-card__stars" aria-label={`${rating} out of 5 stars`}>{'★'.repeat(rating)}</div></div>
                  <p className="testimonial-card__quote">&ldquo;{quote}&rdquo;</p>
                  <div className="testimonial-card__author"><div className="testimonial-card__avatar">{name.charAt(0)}</div><div><strong>{name}</strong><span>{role} · {company}</span></div></div>
                </div>
              ))}
            </div>
          </div>
          <div className="testimonials-show-more">
            <button className="testimonials-show-more__btn" onClick={() => setExpanded(prev => !prev)} aria-expanded={expanded}>
              {expanded ? 'Show Less' : 'See More Testimonials'}
              <span className={`testimonials-show-more__icon${expanded ? ' testimonials-show-more__icon--rotated' : ''}`}>▾</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Blog ─────────────────────────────────────────────────────── */}
      <section className="home-blog">
        <div className="container">
          <div className="home-blog__header">
            <div>
              <p className="eyebrow">{content.blog?.eyebrow ?? 'From the Blog'}</p>
              {content.blog?.title ? (
                <h2 className="home-blog__title">{content.blog.title}</h2>
              ) : (
                <h2 className="home-blog__title">Ideas That <span className="accent">Drive Growth</span></h2>
              )}
            </div>
            <Link href="/blog" className="btn btn-outline">View All Articles →</Link>
          </div>
          <div className="home-blog__grid">
            {posts.map(post => (
              <article key={post.slug} className="home-blog__card">
                <div className="home-blog__card-img" style={{ background: `linear-gradient(135deg, ${post.gradientFrom} 0%, ${post.gradientTo} 100%)` }}>
                  <span className="home-blog__badge" style={{ background: post.accentColor }}>{post.category === 'general' ? 'Marketing' : 'E-commerce'}</span>
                </div>
                <div className="home-blog__card-body">
                  <p className="home-blog__card-meta">{post.publishDate} <span>·</span> {post.readTime}</p>
                  <h3 className="home-blog__card-title">{post.title}</h3>
                  <p className="home-blog__card-excerpt">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="home-blog__card-cta" style={{ color: post.accentColor }}>Read Article →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────── */}
      <section className="home-final-cta">
        <div className="container">
          <p className="eyebrow" style={{ color: '#f87171' }}>{content.cta?.eyebrow ?? 'Ready to Grow?'}</p>
          {content.cta?.title ? (
            <h2 className="home-final-cta__title">{renderLines(content.cta.title)}</h2>
          ) : (
            <h2 className="home-final-cta__title">Stop Leaving Revenue<br />on the Table.</h2>
          )}
          <p className="home-final-cta__sub">
            {content.cta?.body ?? "Let's build a custom growth strategy that turns your marketing into your most powerful competitive advantage. No fluff. No vanity metrics. Just results."}
          </p>
          <Link href={content.cta?.btnUrl ?? '/contact'} className="btn btn-white">
            {content.cta?.btnText ?? 'Get a Free Strategy Call →'}
          </Link>
          <p className="home-final-cta__note">
            {content.cta?.subtext ?? 'No commitment required · Strategy session is 100% free'}
          </p>
        </div>
      </section>
    </main>
  )
}
