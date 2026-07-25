'use client'

import { useState } from 'react'

type FormState = { name: string; email: string; phone: string; company: string; budget: string; message: string }
const EMPTY: FormState = { name: '', email: '', phone: '', company: '', budget: '', message: '' }

export default function ContactForm() {
  const [form, setForm]           = useState<FormState>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Something went wrong. Please try again.')
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="contact-success">
        <div className="contact-success__icon">✓</div>
        <h2>Message received!</h2>
        <p>Thanks, <strong>{form.name}</strong>. We will be in touch within one business day.</p>
        <button className="btn btn-outline" onClick={() => { setSubmitted(false); setForm(EMPTY) }}>
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label htmlFor="budget">Monthly Budget (৳)</label>
        <input id="budget" name="budget" type="number" min="0" step="1" inputMode="numeric" placeholder="e.g. 50000" value={form.budget} onChange={handleChange} />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full Name <span aria-hidden="true">*</span></label>
          <input id="name" name="name" type="text" required placeholder="Jane Smith" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input id="email" name="email" type="email" placeholder="jane@company.com" value={form.email} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" placeholder="+880 1XXX-XXXXXX" value={form.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="company">Company / Brand</label>
          <input id="company" name="company" type="text" placeholder="Acme Inc." value={form.company} onChange={handleChange} />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message">Tell Us About Your Project</label>
        <textarea id="message" name="message" rows={6} placeholder="What are your goals? What does success look like for you?" value={form.message} onChange={handleChange} />
      </div>

      {error && <p style={{ color: 'var(--red)', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

      <button type="submit" className="btn btn-primary contact-submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  )
}
