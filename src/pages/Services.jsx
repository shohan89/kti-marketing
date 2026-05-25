import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { servicesData } from '../data/servicesData'
import PageCTA from '../components/PageCTA'
import ServiceVideoModal from '../components/ServiceVideoModal'
import ScheduleForm from '../components/ScheduleForm'
import './Services.css'

export default function Services() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [modalService, setModalService] = useState(null)

  const handleCardEnter = useCallback((i) => setActiveIndex(i), [])
  const handleCardLeave = useCallback(() => setActiveIndex(0), [])
  const handleCardFocus = useCallback((i) => setActiveIndex(i), [])
  const handleCardBlur  = useCallback((e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) setActiveIndex(0)
  }, [])
  const openModal  = useCallback((service) => setModalService(service), [])
  const closeModal = useCallback(() => setModalService(null), [])

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

        {/* Crossfade background image layers */}
        <div className="services-bg-layers" aria-hidden="true">
          {servicesData.map((svc, i) => (
            <div
              key={svc.slug}
              className={`services-bg-layer${activeIndex === i ? ' services-bg-layer--active' : ''}`}
              style={{ backgroundImage: `url(${svc.image})` }}
            />
          ))}
          <div className="services-bg-overlay" />
        </div>

        <div className="container">
          <div className="services-grid">
            {servicesData.map((service, i) => (
              <div
                key={service.slug}
                className="service-card reveal"
                style={{ '--reveal-delay': `${Math.min(i * 0.07, 0.4)}s` }}
                onMouseEnter={() => handleCardEnter(i)}
                onMouseLeave={handleCardLeave}
                onFocus={() => handleCardFocus(i)}
                onBlur={handleCardBlur}
              >
                <div className="service-card__content">
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__desc">{service.description}</p>
                </div>

                <div className="service-card__footer">
                  <button
                    className="service-card__play-btn"
                    onClick={() => openModal(service)}
                    aria-label={`Watch ${service.title} overview video`}
                  >
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                      <path d="M4 2l10 6-10 6V2z"/>
                    </svg>
                    Watch Overview
                  </button>

                  <Link
                    to={`/services/${service.slug}`}
                    className="service-card__cta"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Explore service
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Schedule Form ─────────────────────────────────── */}
      <ScheduleForm />

      {/* ── Bottom CTA ────────────────────────────────────── */}
      <PageCTA
        eyebrow="Let's Get to Work"
        title={<>Let's Grow<br />Your Brand.</>}
        sub="Tell us where you are and where you want to be. We'll build a custom strategy that gets you there — faster than you think."
        primaryLabel="Start Your Project →"
        secondaryLabel="Meet the Team"
        secondaryTo="/about"
      />

      {/* ── Video modal ───────────────────────────────────── */}
      {modalService && (
        <ServiceVideoModal service={modalService} onClose={closeModal} />
      )}

    </main>
  )
}
