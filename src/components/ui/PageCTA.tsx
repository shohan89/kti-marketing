import Link from 'next/link'
import type { ReactNode } from 'react'
import '@/components/ui/PageCTA.css'

interface PageCTAProps {
  eyebrow?: string
  title?: ReactNode
  sub?: string
  primaryLabel?: string
  primaryTo?: string
  secondaryLabel?: string
  secondaryTo?: string
  note?: string
}

export default function PageCTA({
  eyebrow = 'Ready to Grow?',
  title,
  sub,
  primaryLabel = 'Get a Free Strategy Call →',
  primaryTo = '/contact',
  secondaryLabel,
  secondaryTo,
  note = 'No commitment required · Strategy session is 100% free',
}: PageCTAProps) {
  return (
    <section className="page-cta">
      <div className="container">
        <p className="eyebrow page-cta__eyebrow">{eyebrow}</p>
        <h2 className="page-cta__title">{title}</h2>
        <p className="page-cta__sub">{sub}</p>
        <div className="page-cta__actions">
          <Link href={primaryTo} className="btn btn-white">{primaryLabel}</Link>
          {secondaryLabel && secondaryTo && (
            <Link href={secondaryTo} className="page-cta__secondary-link">{secondaryLabel}</Link>
          )}
        </div>
        {note && <p className="page-cta__note">{note}</p>}
      </div>
    </section>
  )
}
