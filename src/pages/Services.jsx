import { Link } from 'react-router-dom'
import { servicesData } from '../data/servicesData'
import './Services.css'

const SERVICE_ICONS = {
  'social-media-management': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </svg>
  ),
  'content-creation': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  ),
  'ads-campaign-management': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  'copywriting': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  'product-photography': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  ),
  'model-photography': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  'video-production': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  ),
  'influencer-marketing': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  'website-maintenance': (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
}

export default function Services() {
  return (
    <main className="services-page">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="services-hero">
        <div className="container">
          <p className="eyebrow fade-up">Full-Service Agency</p>
          <h1 className="services-hero__title fade-up-1">
            Everything Your Brand Needs.<br />
            <span className="accent">All In One Place.</span>
          </h1>
          <p className="services-hero__sub fade-up-2">
            From social media management and paid advertising to video production
            and influencer partnerships — every service is built around one goal:
            measurable, sustainable growth for your brand.
          </p>
          <div className="services-hero__badges fade-up-3">
            <span className="services-badge">
              <span className="services-badge__dot" aria-hidden="true" />
              9 Core Services
            </span>
            <span className="services-badge">
              <span className="services-badge__dot" aria-hidden="true" />
              100% In-House
            </span>
            <span className="services-badge">
              <span className="services-badge__dot" aria-hidden="true" />
              Strategy-First
            </span>
            <span className="services-badge">
              <span className="services-badge__dot" aria-hidden="true" />
              Results Guaranteed
            </span>
          </div>
        </div>
      </section>

      {/* ── Services grid ─────────────────────────────────── */}
      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            {servicesData.map((service, i) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="service-card reveal"
                style={{ '--reveal-delay': `${Math.min(i * 0.07, 0.4)}s` }}
              >
                <div className="service-card__icon-box" aria-hidden="true">
                  {SERVICE_ICONS[service.slug]}
                </div>
                <div className="service-card__content">
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__desc">{service.description}</p>
                </div>
                <span className="service-card__cta">
                  Explore service
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <section className="services-cta">
        <div className="container">
          <div className="services-cta__inner reveal">
            <p className="eyebrow services-cta__eyebrow">Let's Get to Work</p>
            <h2 className="services-cta__title">
              Let's Grow<br />Your Brand.
            </h2>
            <p className="services-cta__sub">
              Tell us where you are and where you want to be. We'll build a
              custom strategy that gets you there — faster than you think.
            </p>
            <div className="services-cta__actions">
              <Link to="/contact" className="btn btn-white">Start Your Project →</Link>
              <Link to="/about" className="btn btn-outline-white">Meet the Team</Link>
            </div>
          </div>
          <div className="services-cta__stat-strip">
            {[
              { num: '120+',  label: 'Brands Grown' },
              { num: '3.2×',  label: 'Avg. ROI' },
              { num: '$40M+', label: 'Revenue Generated' },
              { num: '94%',   label: 'Retention Rate' },
            ].map(({ num, label }, i) => (
              <div className="services-cta__stat reveal" key={label} style={{ '--reveal-delay': `${i * 0.08}s` }}>
                <span className="services-cta__stat-num">{num}</span>
                <span className="services-cta__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
