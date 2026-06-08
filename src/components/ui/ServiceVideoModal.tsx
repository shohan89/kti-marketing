'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import '@/components/ui/ServiceVideoModal.css'

interface Service { slug: string; title: string; description: string; videoUrl?: string }

interface Props { service: Service; onClose: () => void }

export default function ServiceVideoModal({ service, onClose }: Props) {
  const overlayRef  = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    closeBtnRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const modal = overlayRef.current
    if (!modal) return
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = modal.querySelectorAll<HTMLElement>('button, [href], iframe, [tabindex]:not([tabindex="-1"])')
      const first = focusable[0]; const last = focusable[focusable.length - 1]
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus() } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus() } }
    }
    modal.addEventListener('keydown', handleTab)
    return () => modal.removeEventListener('keydown', handleTab)
  }, [])

  return (
    <div className="svm-overlay" ref={overlayRef} onClick={e => { if (e.target === overlayRef.current) onClose() }} role="dialog" aria-modal="true" aria-label={`${service.title} overview video`}>
      <div className="svm-dialog">
        <button className="svm-close" onClick={onClose} ref={closeBtnRef} aria-label="Close video">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div className="svm-header">
          <p className="svm-eyebrow">Service Overview</p>
          <h2 className="svm-title">{service.title}</h2>
          <p className="svm-desc">{service.description}</p>
        </div>
        <div className="svm-video-wrap">
          {service.videoUrl ? (
            <iframe className="svm-iframe" src={`${service.videoUrl}?autoplay=1&rel=0&modestbranding=1`} title={`${service.title} overview video`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          ) : (
            <div className="svm-coming-soon" role="img" aria-label="Video coming soon">
              <div className="svm-coming-soon__icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>
              </div>
              <p className="svm-coming-soon__label">Video Coming Soon</p>
              <p className="svm-coming-soon__sub">We're producing an overview video for this service. Check back soon.</p>
            </div>
          )}
        </div>
        <div className="svm-footer">
          <Link href={`/services/${service.slug}`} className="svm-explore-link" onClick={onClose}>
            Explore {service.title} in full detail →
          </Link>
        </div>
      </div>
    </div>
  )
}
