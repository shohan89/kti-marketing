import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getServiceBySlug } from '../data/servicesData'
import { caseStudies } from '../data/caseStudies'
import PageCTA from '../components/PageCTA'
import {
  IllusDiscovery,
  IllusStrategy,
  IllusProduction,
  IllusReview,
  IllusDelivery,
} from '../components/ProcessIllustrations'
import './ServiceDetails.css'

const PROCESS_ILLUSTRATIONS = [
  IllusDiscovery,
  IllusStrategy,
  IllusProduction,
  IllusReview,
  IllusDelivery,
]

export default function ServiceDetails() {
  const { slug } = useParams()
  const service = getServiceBySlug(slug)
  const [openFaq, setOpenFaq] = useState(null)

  const relatedStudies = (() => {
    if (!service) return []
    const matched = caseStudies.filter(cs =>
      cs.services.some(s =>
        s.toLowerCase().includes(service.title.toLowerCase()) ||
        service.title.toLowerCase().includes(s.toLowerCase())
      )
    )
    if (matched.length >= 2) return matched.slice(0, 3)
    const others = caseStudies.filter(cs => !matched.includes(cs))
    return [...matched, ...others].slice(0, 3)
  })()

  if (!service) {
    return (
      <main className="sd-not-found">
        <div className="container">
          <p className="sd-not-found__label">404</p>
          <h1 className="sd-not-found__title">Service Not Found</h1>
          <p className="sd-not-found__sub">
            The service you're looking for doesn't exist or may have been moved.
          </p>
          <Link to="/services" className="btn btn-primary">← Back to Services</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="sd-page">

      {/* ── Breadcrumb ── */}
      <nav className="sd-breadcrumb" aria-label="breadcrumb">
        <div className="container">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link to="/services">Services</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{service.title}</span>
        </div>
      </nav>

      {/* ── 1. Hero ── */}
      <section className="sd-hero">
        <div className="container">
          <p className="eyebrow sd-hero__eyebrow fade-up">{service.title}</p>
          <h1 className="sd-hero__title fade-up-1">{service.headline}</h1>
          <p className="sd-hero__sub fade-up-2">{service.description}</p>
          <div className="sd-hero__cta fade-up-3">
            <Link to="/contact" className="btn btn-white">Start Your Project →</Link>
            <Link to="/services" className="sd-hero__back">← All Services</Link>
          </div>
        </div>
      </section>

      {/* ── 2. What We Do ── */}
      <section className="sd-overview">
        <div className="container">
          <div className="sd-overview__grid reveal">
            <div className="sd-overview__left">
              <p className="eyebrow">What We Do</p>
              <h2 className="sd-overview__title">The full picture.</h2>
            </div>
            <p className="sd-overview__body">{service.longDescription}</p>
          </div>
        </div>
      </section>

      {/* ── 3. What You Get ── */}
      <section className="sd-deliverables">
        <div className="container">
          <div className="sd-section-header reveal">
            <p className="eyebrow">What's Included</p>
            <h2 className="sd-section-title">What You Get</h2>
          </div>
          <ul className="sd-deliverables__grid" role="list">
            {service.deliverables.map((item, i) => (
              <li key={item} className="sd-deliverable-item reveal" style={{ '--reveal-delay': `${Math.min(i * 0.05, 0.35)}s` }}>
                <span className="sd-deliverable-item__check" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 4. Process ── */}
      <section className="sd-process">
        <div className="container">
          <div className="sd-section-header reveal">
            <p className="eyebrow">How It Works</p>
            <h2 className="sd-section-title">Our Process</h2>
          </div>
          <div className="sd-process__steps">
            {service.process.map((step, i) => {
              const Illus = PROCESS_ILLUSTRATIONS[i] ?? PROCESS_ILLUSTRATIONS[0]
              return (
                <div
                  className="sd-process-step reveal"
                  key={step.num}
                  data-last={i === service.process.length - 1}
                  style={{ '--reveal-delay': `${i * 0.12}s` }}
                >
                  <div className="sd-process-step__num-col">
                    <div className="sd-process-step__circle">{step.num}</div>
                    {i < service.process.length - 1 && (
                      <div className="sd-process-step__line" aria-hidden="true" />
                    )}
                  </div>
                  <div className="sd-process-step__content">
                    <h3 className="sd-process-step__title">{step.title}</h3>
                    <p className="sd-process-step__body">{step.body}</p>
                  </div>
                  <div className="sd-process-step__illus" aria-hidden="true">
                    <Illus />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 5. Results ── */}
      <section className="sd-results">
        <div className="container">
          <div className="sd-results__header reveal">
            <p className="eyebrow sd-results__eyebrow">What to Expect</p>
            <h2 className="sd-results__title">Outcomes That Matter.</h2>
          </div>
          <div className="sd-results__grid">
            {service.results.map(({ stat, label, description }, i) => (
              <div className="sd-result-card reveal" key={label} style={{ '--reveal-delay': `${i * 0.12}s` }}>
                <span className="sd-result-card__stat">{stat}</span>
                <h3 className="sd-result-card__label">{label}</h3>
                <p className="sd-result-card__desc">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ── */}
      <section className="sd-faq">
        <div className="container">
          <div className="sd-faq__grid reveal">
            <div className="sd-faq__left">
              <p className="eyebrow">Common Questions</p>
              <h2 className="sd-faq__title">FAQ</h2>
              <p className="sd-faq__sub">
                Can't find what you're looking for?{' '}
                <Link to="/contact" className="sd-faq__link">Ask us directly →</Link>
              </p>
            </div>
            <div className="sd-faq__list">
              {service.faqs.map(({ q, a }, i) => (
                <div
                  key={i}
                  className={`sd-faq-item${openFaq === i ? ' sd-faq-item--open' : ''}`}
                >
                  <button
                    className="sd-faq-item__question"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{q}</span>
                    <span className="sd-faq-item__icon" aria-hidden="true">
                      {openFaq === i ? '−' : '+'}
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="sd-faq-item__answer">
                      <p>{a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Related Case Studies ── */}
      {relatedStudies.length > 0 && (
        <section className="sd-case-studies">
          <div className="container">
            <div className="sd-section-header reveal">
              <p className="eyebrow">Proven Results</p>
              <h2 className="sd-section-title">See It in Action</h2>
            </div>
            <div className="sd-cs-grid">
              {relatedStudies.map(({ slug: csSlug, tag, client, title: csTitle, metrics, services: csServices }, i) => (
                <Link
                  key={csSlug}
                  to={`/case-studies/${csSlug}`}
                  className="sd-cs-card reveal"
                  style={{ '--reveal-delay': `${i * 0.1}s` }}
                >
                  <div className="sd-cs-card__top">
                    <span className="sd-cs-tag">{tag}</span>
                  </div>
                  <p className="sd-cs-card__client">{client}</p>
                  <h3 className="sd-cs-card__title">{csTitle}</h3>
                  <div className="sd-cs-card__metrics">
                    {metrics.slice(0, 2).map(({ num, label }) => (
                      <div className="sd-cs-metric" key={label}>
                        <span className="sd-cs-metric__num">{num}</span>
                        <span className="sd-cs-metric__lbl">{label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="sd-cs-card__services">
                    {csServices.slice(0, 3).map(s => (
                      <span className="sd-cs-pill" key={s}>{s}</span>
                    ))}
                  </div>
                  <span className="sd-cs-card__arrow">View Case Study →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── 8. Final CTA ── */}
      <PageCTA
        eyebrow="Ready to Get Started?"
        title={<>Let's build something<br />great together.</>}
        sub="Tell us about your brand and goals. We'll review your project and get back to you within one business day with a tailored plan."
        primaryLabel="Start Your Project →"
        secondaryLabel="Explore Other Services"
        secondaryTo="/services"
      />

    </main>
  )
}
