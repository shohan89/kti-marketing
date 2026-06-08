'use client'

import { useState } from 'react'

const BUDGETS = [
  'Under ৳50,000 / month',
  '৳50,000 – ৳1,50,000 / month',
  '৳1,50,000 – ৳5,00,000 / month',
  '৳5,00,000 – ৳15,00,000 / month',
  '৳15,00,000+ / month',
]

type FormState = { name: string; email: string; company: string; budget: string; message: string }
const EMPTY: FormState = { name: '', email: '', company: '', budget: '', message: '' }

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
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">Full Name <span aria-hidden="true">*</span></label>
          <input id="name" name="name" type="text" required placeholder="Jane Smith" value={form.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email Address <span aria-hidden="true">*</span></label>
          <input id="email" name="email" type="email" required placeholder="jane@company.com" value={form.email} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="company">Company / Brand</label>
          <input id="company" name="company" type="text" placeholder="Acme Inc." value={form.company} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label htmlFor="budget">Monthly Budget</label>
          <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
            <option value="">Select a range…</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="message">Tell Us About Your Project <span aria-hidden="true">*</span></label>
        <textarea id="message" name="message" rows={6} required placeholder="What are your goals? What does success look like for you?" value={form.message} onChange={handleChange} />
      </div>

      {error && <p style={{ color: 'var(--red)', fontSize: '0.9rem', margin: 0 }}>{error}</p>}

      <button type="submit" className="btn btn-primary contact-submit" disabled={loading}>
        {loading ? 'Sending…' : 'Send Message →'}
      </button>
    </form>
  )
}
