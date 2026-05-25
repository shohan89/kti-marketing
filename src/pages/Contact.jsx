import { useState } from 'react'
import './Contact.css'

const BUDGETS = [
  'Under ৳50,000 / month',
  '৳50,000 – ৳1,50,000 / month',
  '৳1,50,000 – ৳5,00,000 / month',
  '৳5,00,000 – ৳15,00,000 / month',
  '৳15,00,000+ / month',
]

const CONTACT_INFO = [
  {
    icon: '✉️',
    label: 'Email Us',
    value: 'hello@ktimarketing.com',
    href: 'mailto:hello@ktimarketing.com',
  },
  {
    icon: '📞',
    label: 'Call Us',
    value: '+1 (555) 234-5678',
    href: 'tel:+15552345678',
  },
  {
    icon: '📍',
    label: 'Our Office',
    value: '123 Marketing Ave, New York, NY 10001',
    href: null,
  },
  {
    icon: '💬',
    label: 'Instagram',
    value: '@ktimarketing',
    href: 'https://instagram.com/ktimarketing',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', company: '', budget: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <main className="contact-page">

      {/* ── Hero ── */}
      <section className="contact-hero">
        <div className="container">
          <p className="eyebrow fade-up">Let's Work Together</p>
          <h1 className="contact-hero__title fade-up-1">
            Start Your <span className="accent">Growth Journey</span>
          </h1>
          <p className="contact-hero__sub fade-up-2">
            Tell us about your brand and goals. We will review your project and
            get back to you within one business day with a tailored plan.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="contact-body">
        <div className="container">
          <div className="contact-grid">

            {/* Form */}
            <div className="contact-form-wrap reveal">
              {submitted ? (
                <div className="contact-success">
                  <div className="contact-success__icon">✓</div>
                  <h2>Message received!</h2>
                  <p>
                    Thanks, <strong>{form.name}</strong>. We have received your
                    message and will be in touch within one business day with next steps.
                  </p>
                  <button
                    className="btn btn-outline"
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', company: '', budget: '', message: '' }) }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit} noValidate>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Full Name <span aria-hidden="true">*</span></label>
                      <input
                        id="name" name="name" type="text" required
                        placeholder="Jane Smith"
                        value={form.name} onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email Address <span aria-hidden="true">*</span></label>
                      <input
                        id="email" name="email" type="email" required
                        placeholder="jane@company.com"
                        value={form.email} onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="company">Company / Brand</label>
                      <input
                        id="company" name="company" type="text"
                        placeholder="Acme Inc."
                        value={form.company} onChange={handleChange}
                      />
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
                    <textarea
                      id="message" name="message" rows={6} required
                      placeholder="What are your goals? What's not working currently? What does success look like for you?"
                      value={form.message} onChange={handleChange}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary contact-submit">
                    Send Message →
                  </button>
                </form>
              )}
            </div>

            {/* Info panel */}
            <div className="contact-info reveal" style={{ '--reveal-delay': '0.15s' }}>
              <div className="contact-info__card">
                <h3>We typically respond within <span className="accent">24 hours</span></h3>
                <p>
                  Not a fan of forms? Drop us a direct email or give us a call —
                  we are always happy to chat about your brand and goals.
                </p>

                <ul className="contact-info__list">
                  {CONTACT_INFO.map(({ icon, label, value, href }) => (
                    <li key={label} className="contact-info__item">
                      <span className="contact-info__icon" aria-hidden="true">{icon}</span>
                      <div>
                        <span className="contact-info__label">{label}</span>
                        {href ? (
                          <a
                            href={href}
                            className="contact-info__value"
                            {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          >
                            {value}
                          </a>
                        ) : (
                          <span className="contact-info__value">{value}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="contact-info__promise">
                  <span className="contact-info__promise-icon">🔒</span>
                  <p>Your information is 100% confidential. We never share client data with third parties.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </main>
  )
}
