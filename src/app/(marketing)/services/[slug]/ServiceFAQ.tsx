'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function ServiceFAQ({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="sd-faq__list">
      {faqs.map(({ q, a }, i) => (
        <div key={i} className={`sd-faq-item${open === i ? ' sd-faq-item--open' : ''}`}>
          <button className="sd-faq-item__question" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
            <span>{q}</span><span className="sd-faq-item__icon" aria-hidden="true">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && <div className="sd-faq-item__answer"><p>{a}</p></div>}
        </div>
      ))}
      <p className="sd-faq__sub" style={{ marginTop: '1.5rem' }}>Can&apos;t find what you&apos;re looking for?{' '}<Link href="/contact" className="sd-faq__link">Ask us directly →</Link></p>
    </div>
  )
}
