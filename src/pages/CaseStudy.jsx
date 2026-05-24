import { useParams, Link, Navigate } from 'react-router-dom'
import { caseStudies } from '../data/caseStudies'
import PageCTA from '../components/PageCTA'
import './CaseStudy.css'

export default function CaseStudy() {
  const { slug } = useParams()
  const study = caseStudies.find(c => c.slug === slug)

  if (!study) return <Navigate to="/case-studies" replace />

  const related = caseStudies.filter(c => c.slug !== slug).slice(0, 3)

  const {
    tag, category, industry, client, title, subtitle,
    challenge, solution, phases, deliverables,
    metrics, duration, services,
    quote, quoteName, quoteRole, quoteCompany, quoteResult,
  } = study

  return (
    <main className="cs-detail">

      {/* ── 1. Hero ──────────────────────────────────────── */}
      <section className="csd-hero">
        <div className="csd-hero__bg" aria-hidden="true">
          <div className="csd-hero__shape--1" />
          <div className="csd-hero__shape--2" />
          <div className="csd-hero__grid" />
        </div>
        <div className="container csd-hero__inner">
          <nav className="csd-breadcrumb" aria-label="Breadcrumb">
            <Link to="/case-studies">Case Studies</Link>
            <span aria-hidden="true">›</span>
            <span>{client}</span>
          </nav>
          <div className="csd-hero__badges">
            <span className="csd-tag">{tag}</span>
            <span className="csd-category">{category}</span>
          </div>
          <p className="csd-hero__client">{client}</p>
          <h1 className="csd-hero__title">{title}</h1>
          <p className="csd-hero__sub">{subtitle}</p>

          <div className="csd-hero__metrics">
            {metrics.map(({ num, label }) => (
              <div className="csd-hero__metric" key={label}>
                <span className="csd-hero__metric-num">{num}</span>
                <span className="csd-hero__metric-lbl">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Overview ──────────────────────────────────── */}
      <section className="csd-overview">
        <div className="container csd-overview__grid">

          <div className="csd-overview__body">
            <p className="eyebrow">The Situation</p>
            <h2 className="csd-overview__title">Where They Started</h2>
            <p className="csd-overview__text">{challenge}</p>

            {/* Inline CTA — first conversion point */}
            <div className="csd-inline-cta">
              <div className="csd-inline-cta__text">
                <strong>Facing a similar challenge?</strong>
                <span>We offer a free 30-minute strategy session — no pitch, just clarity.</span>
              </div>
              <Link to="/contact" className="btn btn-primary csd-inline-cta__btn">
                Book a Free Call
              </Link>
            </div>
          </div>

          <aside className="csd-meta-card">
            <div className="csd-meta-row">
              <span className="csd-meta-label">Client</span>
              <span className="csd-meta-value">{client}</span>
            </div>
            <div className="csd-meta-row">
              <span className="csd-meta-label">Industry</span>
              <span className="csd-meta-value">{industry}</span>
            </div>
            <div className="csd-meta-row">
              <span className="csd-meta-label">Duration</span>
              <span className="csd-meta-value">{duration}</span>
            </div>
            <div className="csd-meta-row csd-meta-row--services">
              <span className="csd-meta-label">Services</span>
              <div className="csd-meta-pills">
                {services.map(s => (
                  <span className="csd-pill" key={s}>{s}</span>
                ))}
              </div>
            </div>
            <Link to="/contact" className="btn btn-primary csd-meta-cta">
              Start a Similar Project →
            </Link>
          </aside>

        </div>
      </section>

      {/* ── 3. The Challenge ─────────────────────────────── */}
      <section className="csd-challenge">
        <div className="container">
          <div className="csd-challenge__inner">
            <div className="csd-challenge__left">
              <p className="eyebrow">The Problem</p>
              <h2 className="csd-challenge__title">
                Why the Status Quo<br />Wasn't Working
              </h2>
            </div>
            <div className="csd-challenge__right">
              <p className="csd-challenge__body">{challenge}</p>
              <div className="csd-challenge__pain-points">
                {[
                  'No clear attribution or performance visibility',
                  'Poor conversion rates across all digital channels',
                  'Inconsistent brand presence and messaging',
                ].map((point, i) => (
                  <div className="csd-pain-point" key={i}>
                    <span className="csd-pain-point__icon" aria-hidden="true">✗</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. Mid-page CTA Banner ───────────────────────── */}
      <div className="csd-mid-cta">
        <div className="container csd-mid-cta__inner">
          <p className="csd-mid-cta__text">
            <strong>Working with a similar challenge?</strong>{' '}
            Let's map out your growth strategy — free, no commitment.
          </p>
          <Link to="/contact" className="csd-mid-cta__btn">
            Book a Strategy Call →
          </Link>
        </div>
      </div>

      {/* ── 5. Our Approach ──────────────────────────────── */}
      <section className="csd-approach">
        <div className="container">
          <div className="csd-approach__header">
            <p className="eyebrow">How We Did It</p>
            <h2 className="csd-approach__title">
              A Phased Approach.<br />
              <span className="accent">Compounding Results.</span>
            </h2>
            <p className="csd-approach__sub">
              Every engagement follows a disciplined three-phase system.
              Each phase builds on the last to deliver results that compound — not just a one-time spike.
            </p>
          </div>
          <div className="csd-phases">
            {phases.map(({ num, title: phaseTitle, body }, i) => (
              <div className="csd-phase" key={num}>
                <div className="csd-phase__num">{num}</div>
                <div className="csd-phase__content">
                  <h3 className="csd-phase__title">{phaseTitle}</h3>
                  <p className="csd-phase__body">{body}</p>
                </div>
                {i < phases.length - 1 && (
                  <div className="csd-phase__connector" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Results ───────────────────────────────────── */}
      <section className="csd-results">
        <div className="csd-results__bg" aria-hidden="true" />
        <div className="container">
          <div className="csd-results__header">
            <p className="eyebrow" style={{ color: 'rgba(255,255,255,0.45)' }}>The Outcome</p>
            <h2 className="csd-results__title">
              Numbers That<br />
              <span className="csd-results__accent">Changed the Business.</span>
            </h2>
          </div>
          <div className="csd-results__grid">
            {metrics.map(({ num, label }) => (
              <div className="csd-result-card" key={label}>
                <span className="csd-result-card__num">{num}</span>
                <span className="csd-result-card__label">{label}</span>
              </div>
            ))}
          </div>
          <p className="csd-results__note">
            Results achieved over {duration} · All data verified and attributed
          </p>
        </div>
      </section>

      {/* ── 7. What We Delivered ─────────────────────────── */}
      <section className="csd-deliverables">
        <div className="container csd-deliverables__grid">
          <div className="csd-deliverables__left">
            <p className="eyebrow">The Work</p>
            <h2 className="csd-deliverables__title">
              What We<br />Actually Built
            </h2>
            <p className="csd-deliverables__sub">
              Every deliverable was designed with one goal: measurable business impact.
              No filler, no vanity output.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Get the Same for Your Brand →
            </Link>
          </div>
          <ul className="csd-deliverables__list">
            {deliverables.map((item, i) => (
              <li className="csd-deliverable-item" key={i}>
                <span className="csd-deliverable-item__check" aria-hidden="true">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 8. Client Testimonial ────────────────────────── */}
      <section className="csd-testimonial">
        <div className="container">
          <div className="csd-testimonial__card">
            <div className="csd-testimonial__quote-mark" aria-hidden="true">"</div>
            <blockquote className="csd-testimonial__quote">
              {quote}
            </blockquote>
            <div className="csd-testimonial__footer">
              <div className="csd-testimonial__avatar" aria-hidden="true">
                {quoteName.charAt(0)}
              </div>
              <div className="csd-testimonial__author">
                <strong>{quoteName}</strong>
                <span>{quoteRole} · {quoteCompany}</span>
              </div>
              <div className="csd-testimonial__result">
                <span className="csd-testimonial__result-badge">{quoteResult}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. Approach summary CTA ──────────────────────── */}
      <div className="csd-approach-cta">
        <div className="container csd-approach-cta__inner">
          <div>
            <p className="csd-approach-cta__label">Ready for results like these?</p>
            <p className="csd-approach-cta__sub">
              We apply the same proven system to every client engagement. Let's talk about yours.
            </p>
          </div>
          <div className="csd-approach-cta__actions">
            <Link to="/contact" className="btn btn-primary">Get a Free Strategy Call</Link>
            <Link to="/services" className="btn btn-outline">View Our Services</Link>
          </div>
        </div>
      </div>

      {/* ── 10. More Case Studies ────────────────────────── */}
      <section className="csd-more">
        <div className="container">
          <div className="csd-more__header">
            <p className="eyebrow">More Work</p>
            <h2 className="csd-more__title">More Results Like This</h2>
          </div>
          <div className="csd-more__grid">
            {related.map(({ slug: relSlug, tag: relTag, client: relClient, title: relTitle, metrics: relMetrics }) => (
              <Link
                to={`/case-studies/${relSlug}`}
                className="csd-more-card"
                key={relSlug}
              >
                <div className="csd-more-card__top">
                  <span className="csd-tag">{relTag}</span>
                </div>
                <p className="csd-more-card__client">{relClient}</p>
                <h3 className="csd-more-card__title">{relTitle}</h3>
                <div className="csd-more-card__metrics">
                  {relMetrics.slice(0, 2).map(({ num, label }) => (
                    <div className="csd-more-metric" key={label}>
                      <span className="csd-more-metric__num">{num}</span>
                      <span className="csd-more-metric__lbl">{label}</span>
                    </div>
                  ))}
                </div>
                <span className="csd-more-card__arrow">View Case Study →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. Final CTA ────────────────────────────────── */}
      <PageCTA
        eyebrow="Ready to Be Next?"
        title={<>Let's Write Your<br />Success Story.</>}
        sub="Every case study above started with one conversation. Tell us where you are and where you need to go."
        primaryLabel="Get a Free Strategy Call →"
        secondaryLabel="← Back to All Case Studies"
        secondaryTo="/case-studies"
        note="No commitment · Free 30-minute strategy session"
      />

    </main>
  )
}
