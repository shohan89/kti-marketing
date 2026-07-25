'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Service } from '@/data/staticData'
import PageCTA from '@/components/ui/PageCTA'
import ServiceVideoModal from '@/components/ui/ServiceVideoModal'
import ScheduleForm from '@/components/ui/ScheduleForm'
import './Services.css'

export default function ServicesClient({ services, whatsappUrl = '' }: { services: Service[]; whatsappUrl?: string }) {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [modalService, setModalService] = useState<Service | null>(null)

  const handleCardEnter = useCallback((i: number) => setActiveIndex(i), [])
  const handleCardLeave = useCallback(() => setActiveIndex(null), [])
  const handleCardFocus = useCallback((i: number) => setActiveIndex(i), [])
  const handleCardBlur  = useCallback((e: React.FocusEvent) => { if (!e.currentTarget.contains(e.relatedTarget)) setActiveIndex(null) }, [])
  const goToService = useCallback((slug: string) => router.push(`/services/${slug}`), [router])

  return (
    <main className="services-page">
      <section className="services-hero">
        <div className="container">
          <p className="eyebrow fade-up">Full-Service Agency</p>
          <h1 className="services-hero__title fade-up-1">Everything Your Brand Needs.<br /><span className="accent">All In One Place.</span></h1>
          <p className="services-hero__sub fade-up-2">From social media and paid ads to video and content — every service is built for one goal: measurable, sustainable growth.</p>
          <div className="services-hero__badges fade-up-3">
            <span className="services-badge"><span className="services-badge__dot" aria-hidden="true" />9 Core Services</span>
            <span className="services-badge"><span className="services-badge__dot" aria-hidden="true" />100% In-House</span>
            <span className="services-badge"><span className="services-badge__dot" aria-hidden="true" />Strategy-First</span>
            <span className="services-badge"><span className="services-badge__dot" aria-hidden="true" />Results Guaranteed</span>
          </div>
        </div>
      </section>

      <section className="services-grid-section">
        <div className="container">
          <div className="services-grid">
            {services.map((service, i) => {
              const isActive = activeIndex === i
              const isDimmed = activeIndex !== null && !isActive
              return (
              <div
                key={service.slug}
                className="service-card reveal"
                data-state={isActive ? 'active' : isDimmed ? 'dimmed' : undefined}
                style={{ '--reveal-delay': `${Math.min(i * 0.07, 0.4)}s` } as React.CSSProperties}
                role="link"
                tabIndex={0}
                onMouseEnter={() => handleCardEnter(i)} onMouseLeave={handleCardLeave}
                onFocus={() => handleCardFocus(i)} onBlur={handleCardBlur}
                onClick={() => goToService(service.slug)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToService(service.slug) } }}
              >
                <div className="service-card__bg" aria-hidden="true" style={{ backgroundImage: `url(${service.image})` }} />
                <div className="service-card__content">
                  <h3 className="service-card__title">{service.title}</h3>
                  <p className="service-card__desc">{service.description}</p>
                </div>
                <div className="service-card__footer">
                  <button className="service-card__play-btn" onClick={e => { e.stopPropagation(); setModalService(service) }} aria-label={`Watch ${service.title} overview video`}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M4 2l10 6-10 6V2z"/></svg>
                    Watch Overview
                  </button>
                  <Link href={`/services/${service.slug}`} className="service-card__cta" onClick={e => e.stopPropagation()}>
                    Explore service
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </Link>
                </div>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      <ScheduleForm whatsappUrl={whatsappUrl} />

      <PageCTA
        eyebrow="Let's Get to Work"
        title={<>Let&apos;s Grow<br />Your Brand.</>}
        sub="Tell us where you are and where you want to be. We'll build a custom strategy that gets you there — faster than you think."
        primaryLabel="Start Your Project →"
        secondaryLabel="Meet the Team"
        secondaryTo="/about"
      />

      {modalService && <ServiceVideoModal service={modalService} onClose={() => setModalService(null)} />}
    </main>
  )
}
