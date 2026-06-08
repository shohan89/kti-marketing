'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Testimonial = {
  id: string; name: string; role: string; company: string; quote: string
  result: string | null; rating: number; sortOrder: number; isPublished: boolean
}

export default function TestimonialForm({ initialData }: { initialData: Testimonial | null }) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [company, setCompany] = useState(initialData?.company ?? '')
  const [quote, setQuote] = useState(initialData?.quote ?? '')
  const [result, setResult] = useState(initialData?.result ?? '')
  const [rating, setRating] = useState(initialData?.rating ?? 5)
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { name, role, company, quote, result: result || null, rating, sortOrder, isPublished }
    const url = initialData ? `/api/admin/testimonials/${initialData.id}` : '/api/admin/testimonials'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/testimonials')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this testimonial? This cannot be undone.')) return
    const res = await fetch(`/api/admin/testimonials/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/testimonials')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Testimonial' : 'New Testimonial'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.name}` : 'Add a new client testimonial'}</p>
        </div>
        {initialData && <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>}
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Name *</label>
              <input className="admin-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Role</label>
              <input className="admin-input" placeholder="e.g. CEO" value={role} onChange={e => setRole(e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Company</label>
              <input className="admin-input" value={company} onChange={e => setCompany(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Result (badge text)</label>
              <input className="admin-input" placeholder="e.g. 3× Revenue Growth" value={result} onChange={e => setResult(e.target.value)} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Quote *</label>
            <textarea className="admin-textarea" rows={4} value={quote} onChange={e => setQuote(e.target.value)} required />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Rating (1–5)</label>
              <select className="admin-select" value={rating} onChange={e => setRating(Number(e.target.value))}>
                <option value={5}>5 — Excellent</option>
                <option value={4}>4 — Great</option>
                <option value={3}>3 — Good</option>
                <option value={2}>2 — Fair</option>
                <option value={1}>1 — Poor</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Sort Order</label>
              <input className="admin-input" type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} />
            </div>
          </div>
          <label className="admin-toggle"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /><span>Published</span></label>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : (initialData ? 'Update Testimonial' : 'Create Testimonial')}</button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/testimonials')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
