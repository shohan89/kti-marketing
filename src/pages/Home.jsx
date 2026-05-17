import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { servicesData } from '../data/servicesData'
import './Home.css'

const MARQUEE_ITEMS = [
  'Social Media Management',
  'Content Creation',
  'Ads Campaign Management',
  'Copywriting',
  'Product Photography',
  'Model Photography',
  'Video Production',
  'Influencer Marketing',
  'Website Maintenance',
]

const CLIENT_BRANDS = [
  'Luxe Apparel Co.',
  'TechFlow Inc.',
  'Wellness Hub',
  'Nova Skincare',
  'Urban Eats',
  'PeakPro Fitness',
  'Elevate Realty',
  'Bloom Cosmetics',
]

const WHY_PILLARS = [
  {
    icon: '📈',
    title: 'Results, Not Excuses',
    body: 'Every engagement has clear KPIs from day one. We report on revenue, ROAS, leads, and conversions — not vanity metrics like impressions and reach.',
  },
  {
    icon: '🎨',
    title: 'Bold Creative Thinking',
    body: 'Great creative is your biggest competitive advantage. Our in-house team builds campaigns that stop the scroll and demand attention.',
  },
  {
    icon: '🧠',
    title: 'Strategy Comes First',
    body: 'We never jump straight to execution. Every client gets a custom go-to-market plan grounded in audience research and competitive intelligence.',
  },
  {
    icon: '🤝',
    title: 'Relentless Support',
    body: 'A dedicated account team, weekly updates, and a direct line to the people doing the work — no middlemen passing messages.',
  },
]

const PORTFOLIO = [
  {
    tag: 'E-Commerce',
    category: 'Social Media + Paid Ads',
    client: 'Luxe Apparel Co.',
    title: 'From Zero to $1.2M in Online Sales',
    body: 'Rebuilt their entire social presence, launched targeted Meta ads, and delivered 7.4× follower growth alongside a 340% increase in e-commerce revenue in under 9 months.',
    metrics: [
      { num: '7.4×',  label: 'Follower Growth' },
      { num: '340%',  label: 'Revenue Increase' },
    ],
  },
  {
    tag: 'SaaS',
    category: 'Performance Ads + Content',
    client: 'TechFlow Inc.',
    title: 'Scaling a SaaS Brand to 4.6× ROAS',
    body: 'Overhauled their paid media strategy, developed conversion-focused ad creative, and rebuilt landing pages to turn a losing ad account into their fastest-growing revenue channel.',
    metrics: [
      { num: '4.6×',  label: 'ROAS Achieved' },
      { num: '-62%',  label: 'Cost Per Lead' },
    ],
  },
  {
    tag: 'Health & Wellness',
    category: 'Influencer + Content Strategy',
    client: 'Wellness Hub',
    title: '287% More Leads in 90 Days',
    body: 'Launched an influencer campaign across micro and macro creators, paired with a content engine that tripled organic reach and filled the pipeline with qualified leads.',
    metrics: [
      { num: '+287%', label: 'Qualified Leads' },
      { num: '3.1M',  label: 'Organic Impressions' },
    ],
  },
]

const PROCESS_STEPS = [
  {
    num: '01',
    title: 'Strategy',
    body: "We audit your brand, analyze competitors, and build a tailored go-to-market plan with clear KPIs, channel priorities, and creative direction.",
  },
  {
    num: '02',
    title: 'Execution',
    body: "Our team launches campaigns across every relevant channel — moving fast, testing constantly, and iterating relentlessly to maximize performance.",
  },
  {
    num: '03',
    title: 'Growth',
    body: "We double down on what works, eliminate what doesn't, and scale your most profitable channels to deliver compounding returns month over month.",
  },
]

const TESTIMONIALS = [
  {
    quote: "KTI grew our Instagram from 4,200 to 31,000 followers in 6 months and turned it into our number one revenue channel. The ROI speaks for itself.",
    name: 'Amira Hassan',
    role: 'CEO',
    company: 'Luxe Apparel Co.',
    result: '7.4× follower growth',
  },
  {
    quote: "Our ROAS jumped from 1.8× to 4.6× within the first quarter. KTI's paid media team understands performance advertising at a level I haven't seen elsewhere.",
    name: 'Daniel Osei',
    role: 'Head of Growth',
    company: 'TechFlow Inc.',
    result: '4.6× ROAS achieved',
  },
  {
    quote: "287% increase in qualified leads in under 90 days. They don't just promise results — they build systems that deliver them consistently, month after month.",
    name: 'Priya Nair',
    role: 'Founder',
    company: 'Wellness Hub',
    result: '+287% qualified leads',
  },
]

const marqueeText = MARQUEE_ITEMS.map(i => `${i}  ·  `).join('')

export default function Home() {
  const heroRef      = useRef(null)
  const cursorGlowRef = useRef(null)

  /* Mouse-follow radial glow — no React state, direct DOM */
  useEffect(() => {
    const hero = heroRef.current
    const glow = cursorGlowRef.current
    if (!hero || !glow) return

    const onMove = (e) => {
      const rect = hero.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      glow.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
    }
    const show = () => { glow.style.opacity = '1' }
    const hide = () => { glow.style.opacity = '0' }

    hero.addEventListener('mousemove', onMove, { passive: true })
    hero.addEventListener('mouseenter', show)
    hero.addEventListener('mouseleave', hide)
    return () => {
      hero.removeEventListener('mousemove', onMove)
      hero.removeEventListener('mouseenter', show)
      hero.removeEventListener('mouseleave', hide)
    }
  }, [])

  /* Scroll parallax — rAF-throttled, skipped under reduced-motion */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const hero = heroRef.current
    if (!hero) return

    const layers = hero.querySelectorAll('.hero-parallax')
    let rafId

    const update = () => {
      const sy = window.scrollY
      if (hero.getBoundingClientRect().bottom < 0) return
      layers.forEach(layer => {
        const speed = parseFloat(layer.dataset.speed || '0.08')
        layer.style.transform = `translateY(${sy * speed}px)`
      })
    }

    const onScroll = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <main className="home">

      {/* ── 1. Hero ──────────────────────────────────────── */}
      <section className="home-hero" ref={heroRef}>
        <div className="home-hero__bg" aria-hidden="true">
          <div className="hero-cursor-glow" ref={cursorGlowRef} />
          <div className="hero-grid-overlay" />
          <div className="hero-parallax" data-speed="0.08">
            <div className="hero-shape hero-shape--1" />
          </div>
          <div className="hero-parallax" data-speed="0.14">
            <div className="hero-shape hero-shape--2" />
          </div>
          <div className="hero-parallax" data-speed="0.05">
            <div className="hero-shape hero-shape--3" />
          </div>
          <div className="hero-parallax" data-speed="0.11">
            <div className="hero-shape hero-shape--4" />
          </div>
        </div>

        <div className="container home-hero__container">
          <div className="home-hero__layout">

            {/* Left column */}
            <div className="home-hero__left">
              <div className="hero-eyebrow-badge fade-up">
                <span className="hero-eyebrow-badge__dot" aria-hidden="true" />
                Full-Service Growth Agency
              </div>
              <h1 className="home-hero__title fade-up-1">
                Bold Strategy.<br />
                Real{' '}
                <span className="hero-title__highlight">Revenue.</span><br />
                Zero Compromises.
              </h1>
              <p className="home-hero__sub fade-up-2">
                We build performance campaigns and bold creative for ambitious
                brands ready to stop blending in — and start owning their market.
              </p>
              <div className="home-hero__cta fade-up-3">
                <Link to="/contact" className="btn btn-primary">Start Growing</Link>
                <Link to="/contact" className="btn-hero-outline">Book a Strategy Call</Link>
              </div>
              <div className="hero-glass-stats fade-up-4">
                <div className="hero-gs__item">
                  <span className="hero-gs__num">120+</span>
                  <span className="hero-gs__lbl">Brands Scaled</span>
                </div>
                <div className="hero-gs__divider" aria-hidden="true" />
                <div className="hero-gs__item">
                  <span className="hero-gs__num">$40M+</span>
                  <span className="hero-gs__lbl">Revenue Generated</span>
                </div>
                <div className="hero-gs__divider" aria-hidden="true" />
                <div className="hero-gs__item">
                  <span className="hero-gs__num">94%</span>
                  <span className="hero-gs__lbl">Client Retention</span>
                </div>
              </div>
            </div>

            {/* Right column — dashboard visual */}
            <div className="home-hero__right fade-up-2" aria-hidden="true">
              <div className="hero-visual">
                <div className="hero-dashboard">
                  <div className="hero-db__header">
                    <div className="hero-db__dots">
                      <span /><span /><span />
                    </div>
                    <span className="hero-db__label">Campaign Performance</span>
                    <span className="hero-db__live">
                      <span className="hero-db__live-dot" />
                      Live
                    </span>
                  </div>
                  {/* Toolbar */}
                  <div className="hero-db__toolbar">
                    <span className="hero-db__range">Last 30 days <span className="hero-db__range-caret">▾</span></span>
                    <span className="hero-db__export">↓ Export</span>
                  </div>

                  {/* KPI row */}
                  <div className="hero-db__kpis">
                    {[
                      { lbl: 'ROAS',    val: '4.6×',  delta: '+127%', d: '0.30s' },
                      { lbl: 'Revenue', val: '$48.2K', delta: '+94%',  d: '0.42s' },
                      { lbl: 'Leads',   val: '1,284',  delta: '+63%',  d: '0.54s' },
                      { lbl: 'CTR',     val: '8.4%',   delta: '+2.1%', d: '0.66s' },
                    ].map(({ lbl, val, delta, d }) => (
                      <div className="hero-db__kpi" key={lbl} style={{ '--d': d }}>
                        <span className="hero-db__kpi-lbl">{lbl}</span>
                        <span className="hero-db__kpi-val">{val}</span>
                        <span className="hero-db__kpi-delta">↑ {delta}</span>
                      </div>
                    ))}
                  </div>

                  {/* Area chart */}
                  <div className="hero-db__chart">
                    <div className="hero-db__chart-yticks">
                      <span>$60K</span>
                      <span>$40K</span>
                      <span>$20K</span>
                      <span>$0</span>
                    </div>
                    <div className="hero-db__chart-canvas">
                      <svg
                        className="hero-db__svg"
                        viewBox="0 0 260 68"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <defs>
                          <linearGradient id="heroAreaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#D7262E" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#D7262E" stopOpacity="0.02" />
                          </linearGradient>
                        </defs>
                        <path
                          className="hero-db__area"
                          d="M0,62 C20,60 35,55 55,50 C75,45 90,38 110,30 C130,22 145,17 165,13 C185,9 200,7 220,6 C240,5 250,4 260,4 L260,68 L0,68 Z"
                          fill="url(#heroAreaGrad)"
                        />
                        <path
                          className="hero-db__line"
                          pathLength="1"
                          d="M0,62 C20,60 35,55 55,50 C75,45 90,38 110,30 C130,22 145,17 165,13 C185,9 200,7 220,6 C240,5 250,4 260,4"
                          fill="none"
                          stroke="#D7262E"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <circle className="hero-db__endpoint" cx="257" cy="4.5" r="3" fill="#D7262E" />
                      </svg>
                      <div className="hero-db__x-labels">
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Now</span>
                      </div>
                    </div>
                  </div>

                  {/* Channel breakdown */}
                  <div className="hero-db__channels">
                    {[
                      { name: 'Meta Ads', pct: 85, color: '#818cf8', d: '1.2s'  },
                      { name: 'Google',   pct: 62, color: '#34d399', d: '1.45s' },
                      { name: 'TikTok',   pct: 48, color: '#f87171', d: '1.7s'  },
                    ].map(({ name, pct, color, d }) => (
                      <div className="hero-db__channel" key={name}>
                        <span className="hero-db__ch-name">{name}</span>
                        <div className="hero-db__ch-track">
                          <div
                            className="hero-db__ch-fill"
                            style={{ '--pct': `${pct}%`, '--color': color, '--d': d }}
                          />
                        </div>
                        <span className="hero-db__ch-pct" style={{ color }}>{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hero-float-card hero-float-card--tl">
                  <div className="hero-fc__live-dot" />
                  <div className="hero-fc__body">
                    <strong>ROAS Target Hit</strong>
                    <span>4.6× · Beat goal by 53%</span>
                  </div>
                </div>

                <div className="hero-float-card hero-float-card--br">
                  <div className="hero-fc__stars">★★★★★</div>
                  <div className="hero-fc__rating-text">5.0 Average Rating</div>
                </div>

                <div className="hero-skill-badge hero-skill-badge--a" aria-hidden="true">
                  <span className="hero-skill-badge__dot" />
                  Performance Marketing
                </div>
                <div className="hero-skill-badge hero-skill-badge--b" aria-hidden="true">
                  <span className="hero-skill-badge__dot" />
                  Creative Strategy
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="home-hero__stats fade-up-5">
          <div className="container">
            <div className="hero-stats-row">
              {[
                { num: '120+',  label: 'Brands Grown' },
                { num: '3.2×',  label: 'Average ROI' },
                { num: '$40M+', label: 'Revenue Generated' },
                { num: '94%',   label: 'Client Retention' },
              ].map(({ num, label }) => (
                <div className="hero-stat" key={label}>
                  <span className="hero-stat__num">{num}</span>
                  <span className="hero-stat__label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Clients ───────────────────────────────────── */}
      <section className="home-clients">
        <div className="container">
          <p className="home-clients__label reveal">Trusted by ambitious brands</p>
          <div className="clients-strip reveal" style={{ '--reveal-delay': '0.1s' }}>
            {CLIENT_BRANDS.map(brand => (
              <span className="clients-strip__brand" key={brand}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Marquee ticker ────────────────────────────── */}
      <div className="marquee-band" aria-hidden="true">
        <div className="marquee-track">
          <span className="marquee-content">{marqueeText}{marqueeText}</span>
        </div>
      </div>

      {/* ── 4. Services ──────────────────────────────────── */}
      <section className="home-services">
        <div className="container">
          <div className="home-services__header">
            <div className="reveal">
              <p className="eyebrow">What We Do</p>
              <h2 className="home-services__title">
                Every Service You Need.<br />
                <span className="accent">All Under One Roof.</span>
              </h2>
            </div>
            <p className="home-services__sub reveal" style={{ '--reveal-delay': '0.12s' }}>
              From brand strategy to performance ads, content creation to influencer
              marketing — we own every channel of your growth with strategy, creativity,
              and precision execution.
            </p>
          </div>

          <div className="home-services__grid">
            {servicesData.slice(0, 6).map((s, i) => (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="svc-card reveal"
                style={{ '--reveal-delay': `${Math.min(i * 0.08, 0.4)}s` }}
              >
                <h3 className="svc-card__title">{s.title}</h3>
                <p className="svc-card__desc">{s.description}</p>
                <span className="svc-card__arrow">→</span>
              </Link>
            ))}
          </div>

          <div className="home-services__footer reveal" style={{ '--reveal-delay': '0.1s' }}>
            <Link to="/services" className="all-services-link">
              View all 9 services
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Why Us ─────────────────────────────────────── */}
      <section className="home-why">
        <div className="container">
          <div className="home-why__header reveal">
            <p className="eyebrow">Why KTI Marketing</p>
            <h2 className="home-why__title">
              We Don't Chase Metrics.<br />
              <span className="accent">We Chase Revenue.</span>
            </h2>
            <p className="home-why__body">
              Most agencies show you follower counts and impression graphs. We show you
              pipeline growth, conversion rates, and ROI — because your marketing budget
              should make you more money than it costs you.
            </p>
          </div>
          <div className="why-pillars">
            {WHY_PILLARS.map(({ icon, title, body }, i) => (
              <div className="why-pillar reveal" key={title} style={{ '--reveal-delay': `${i * 0.1}s` }}>
                <span className="why-pillar__icon" aria-hidden="true">{icon}</span>
                <h3 className="why-pillar__title">{title}</h3>
                <p className="why-pillar__body">{body}</p>
              </div>
            ))}
          </div>
          <div className="home-why__cta reveal" style={{ '--reveal-delay': '0.1s' }}>
            <Link to="/about" className="btn btn-primary">Our Story</Link>
            <Link to="/contact" className="btn btn-outline">Book a Call</Link>
          </div>
        </div>
      </section>

      {/* ── 6. Portfolio ─────────────────────────────────── */}
      <section className="home-portfolio">
        <div className="container">
          <div className="home-portfolio__header">
            <div className="reveal">
              <p className="eyebrow">Our Work</p>
              <h2 className="home-portfolio__title">
                Results That<br />
                <span className="accent">Speak for Themselves.</span>
              </h2>
            </div>
            <p className="home-portfolio__sub reveal" style={{ '--reveal-delay': '0.12s' }}>
              We don't believe in case studies that only show the highlights.
              Here are real campaigns with real numbers from real clients.
            </p>
          </div>
          <div className="portfolio-grid">
            {PORTFOLIO.map(({ tag, category, client, title, body, metrics }, i) => (
              <div className="portfolio-card reveal" key={client} style={{ '--reveal-delay': `${i * 0.12}s` }}>
                <div className="portfolio-card__top">
                  <span className="portfolio-card__tag">{tag}</span>
                  <span className="portfolio-card__category">{category}</span>
                </div>
                <h3 className="portfolio-card__title">{title}</h3>
                <p className="portfolio-card__client">{client}</p>
                <p className="portfolio-card__body">{body}</p>
                <div className="portfolio-card__metrics">
                  {metrics.map(({ num, label }) => (
                    <div className="portfolio-metric" key={label}>
                      <span className="portfolio-metric__num">{num}</span>
                      <span className="portfolio-metric__label">{label}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="portfolio-card__cta">
                  Start a Similar Project →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Process ───────────────────────────────────── */}
      <section className="home-process">
        <div className="container">
          <div className="home-process__header text-center reveal">
            <p className="eyebrow">How We Work</p>
            <h2>A Proven <span className="accent">3-Step Growth System</span></h2>
          </div>
          <div className="process-grid">
            {PROCESS_STEPS.map((step, i) => (
              <div className="process-step reveal" key={step.num} style={{ '--reveal-delay': `${i * 0.12}s` }}>
                <span className="process-step__num">{step.num}</span>
                <h3 className="process-step__title">{step.title}</h3>
                <p className="process-step__body">{step.body}</p>
                {i < PROCESS_STEPS.length - 1 && (
                  <span className="process-step__connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Testimonials ──────────────────────────────── */}
      <section className="home-testimonials">
        <div className="container">
          <div className="text-center home-testimonials__header reveal">
            <p className="eyebrow">Client Results</p>
            <h2>Don't Take Our Word for It.</h2>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map(({ quote, name, role, company, result }, i) => (
              <div className="testimonial-card reveal" key={name} style={{ '--reveal-delay': `${i * 0.12}s` }}>
                <div className="testimonial-card__result">{result}</div>
                <p className="testimonial-card__quote">"{quote}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <strong>{name}</strong>
                    <span>{role} · {company}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 9. Final CTA ─────────────────────────────────── */}
      <section className="home-final-cta">
        <div className="container">
          <p className="eyebrow" style={{ color: '#f87171' }}>Ready to Grow?</p>
          <h2 className="home-final-cta__title">
            Stop Leaving Revenue<br />on the Table.
          </h2>
          <p className="home-final-cta__sub">
            Let's build a custom growth strategy that turns your marketing into
            your most powerful competitive advantage. No fluff. No vanity metrics.
            Just results.
          </p>
          <Link to="/contact" className="btn btn-white">
            Get a Free Strategy Call →
          </Link>
          <p className="home-final-cta__note">
            No commitment required · Strategy session is 100% free
          </p>
        </div>
      </section>

    </main>
  )
}
