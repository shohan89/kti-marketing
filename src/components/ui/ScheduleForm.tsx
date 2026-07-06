'use client'

import { useState } from 'react'
import { servicesData } from '@/data/staticData'
import '@/components/ui/ScheduleForm.css'

const BUSINESS_TYPES = ['Business type', 'New Business', 'Existing Business', 'Startup / Early Stage', 'Scale-up / Growth Stage', 'Enterprise']

function InlineInput({ name, placeholder, value, onChange, type = 'text', required }: { name: string; placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; required?: boolean }) {
  return (
    <span className="inline-field">
      <input className="inline-input" type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} autoComplete="off" spellCheck={false} />
    </span>
  )
}

function InlineSelect({ name, value, onChange, options, required }: { name: string; value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; options: string[]; required?: boolean }) {
  return (
    <span className="inline-field inline-field--select">
      <select className="inline-select" name={name} value={value} onChange={onChange} required={required}>
        {options.map((opt, i) => (
          <option key={opt} value={i === 0 ? '' : opt} disabled={i === 0}>{opt}</option>
        ))}
      </select>
      <svg className="inline-select__arrow" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
        <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  )
}

export default function ScheduleForm({ whatsappUrl = '' }: { whatsappUrl?: string }) {
  const [form, setForm] = useState({ name: '', role: '', company: '', service: '', businessType: '', phone: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const isReady = form.name.trim() && form.service && (form.phone.trim() || form.email.trim())
  const serviceOptions = ['Select a service', ...servicesData.map(s => s.title)]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isReady) return
    if (whatsappUrl) {
      const lines = [
        `Hi! My name is ${form.name}${form.role ? `, ${form.role}` : ''}${form.company ? ` at ${form.company}` : ''}.`,
        `I am planning a ${form.service}${form.businessType ? ` for my ${form.businessType}` : ''} that I want to make awesome with KTI.`,
        form.phone && `You can reach me on ${form.phone}.`,
        form.email && `Email: ${form.email}.`,
      ].filter(Boolean)
      const base = whatsappUrl.split('?')[0]
      window.open(`${base}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener,noreferrer')
    }
    setSubmitted(true)
  }

  return (
    <section className="schedule-section reveal">
      <div className="container">
        {submitted ? (
          <div className="schedule-success">
            <div className="schedule-success__icon" aria-hidden="true">✓</div>
            <h2>Thanks, {form.name.split(' ')[0]}!</h2>
            <p>We've received your request and will be in touch within 24 hours.</p>
            <button onClick={() => { setForm({ name:'',role:'',company:'',service:'',businessType:'',phone:'',email:'' }); setSubmitted(false) }}>
              Submit Another Request
            </button>
          </div>
        ) : (
          <form className="schedule-form" onSubmit={handleSubmit} noValidate>
            <p className="schedule-hi">Hi!</p>
            <p className="schedule-line">
              My name is <InlineInput name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
              {' '}and I&apos;m a{' '}<InlineInput name="role" placeholder="your role" value={form.role} onChange={handleChange} />
              {' '}at a place called{' '}<InlineInput name="company" placeholder="Company name" value={form.company} onChange={handleChange} />.
            </p>
            <p className="schedule-line">
              I am planning a{' '}<InlineSelect name="service" value={form.service} onChange={handleChange} required options={serviceOptions} />.
              {' '}For my{' '}<InlineSelect name="businessType" value={form.businessType} onChange={handleChange} options={BUSINESS_TYPES} />
              {' '}that I want to make awesome with KTI.
            </p>
            <p className="schedule-line">
              You can give me a buzz on{' '}<InlineInput name="phone" type="tel" placeholder="phone number" value={form.phone} onChange={handleChange} />
              {' '}or mail at{' '}<InlineInput name="email" type="email" placeholder="email address" value={form.email} onChange={handleChange} />.
            </p>
            <div className="schedule-actions">
              <button type="submit" className={`schedule-btn${isReady ? ' schedule-btn--ready' : ''}`} disabled={!isReady} aria-disabled={!isReady}>
                Submit The Schedule Request
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
