'use client'

import { useState, useEffect, useRef } from 'react'

interface Props {
  jobId: string
  jobTitle: string
  variant?: 'primary' | 'sidebar'
}

export default function ApplyModal({ jobId, jobTitle, variant = 'primary' }: Props) {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cvName, setCvName] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set('jobId', jobId)
    try {
      const res = await fetch('/api/apply', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError(data.error ?? 'Something went wrong. Please try again.')
      }
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function handleClose() {
    if (submitting) return
    setOpen(false)
    setTimeout(() => { setSubmitted(false); setError(null); setCvName(null) }, 300)
  }

  return (
    <>
      <button
        type="button"
        className={variant === 'sidebar' ? 'btn jp-sidebar-cta__btn' : 'btn btn-outline'}
        onClick={() => setOpen(true)}
      >
        Apply Now →
      </button>

      {open && (
        <div className="apply-modal-overlay" onClick={handleClose} role="dialog" aria-modal="true" aria-label={`Apply for ${jobTitle}`}>
          <div className="apply-modal" onClick={e => e.stopPropagation()}>
            <div className="apply-modal__header">
              <div>
                <p className="apply-modal__eyebrow">Applying for</p>
                <h2 className="apply-modal__title">{jobTitle}</h2>
              </div>
              <button type="button" className="apply-modal__close" onClick={handleClose} aria-label="Close">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            {submitted ? (
              <div className="apply-modal__success">
                <div className="apply-modal__success-icon" aria-hidden="true">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/></svg>
                </div>
                <h3>Application Submitted!</h3>
                <p>Thanks for applying, we&apos;ll review your application and be in touch soon.</p>
                <button type="button" className="btn apply-modal__done-btn" onClick={handleClose}>Close</button>
              </div>
            ) : (
              <form className="apply-modal__form" onSubmit={handleSubmit} noValidate>
                <div className="apply-modal__row">
                  <div className="apply-modal__field">
                    <label htmlFor="am-name">Full Name <span aria-hidden="true">*</span></label>
                    <input id="am-name" name="name" type="text" placeholder="Your full name" required autoComplete="name" />
                  </div>
                  <div className="apply-modal__field">
                    <label htmlFor="am-email">Email Address <span aria-hidden="true">*</span></label>
                    <input id="am-email" name="email" type="email" placeholder="you@example.com" required autoComplete="email" />
                  </div>
                </div>

                <div className="apply-modal__field">
                  <label htmlFor="am-phone">Phone Number <span className="apply-modal__optional">(optional)</span></label>
                  <input id="am-phone" name="phone" type="tel" placeholder="+880 1700 000000" autoComplete="tel" />
                </div>

                <div className="apply-modal__field">
                  <label htmlFor="am-cover">Cover Letter <span aria-hidden="true">*</span></label>
                  <textarea id="am-cover" name="coverLetter" rows={5} placeholder="Tell us about your experience and why you'd be great for this role..." required />
                </div>

                <div className="apply-modal__field">
                  <label htmlFor="am-cv">Upload Your CV <span className="apply-modal__optional">(PDF or Word, max 5 MB)</span></label>
                  <div className="apply-modal__file-wrap">
                    <input
                      id="am-cv"
                      name="cv"
                      type="file"
                      ref={fileRef}
                      accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="apply-modal__file-input"
                      onChange={e => setCvName(e.target.files?.[0]?.name ?? null)}
                    />
                    <label htmlFor="am-cv" className="apply-modal__file-btn">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      {cvName ? 'Change File' : 'Choose File'}
                    </label>
                    {cvName && <span className="apply-modal__file-name">{cvName}</span>}
                  </div>
                </div>

                <div className="apply-modal__field">
                  <label htmlFor="am-portfolio">Portfolio or LinkedIn URL <span className="apply-modal__optional">(optional)</span></label>
                  <input id="am-portfolio" name="portfolioUrl" type="url" placeholder="https://linkedin.com/in/yourprofile" />
                </div>

                {error && <p className="apply-modal__error" role="alert">{error}</p>}

                <button type="submit" className="btn apply-modal__submit" disabled={submitting}>
                  {submitting ? (
                    <><span className="apply-modal__spinner" aria-hidden="true" /> Submitting…</>
                  ) : (
                    'Submit Application →'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
