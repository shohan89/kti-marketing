'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type VideoPkg = {
  id: string; category: string; name: string; price: number
  priceLabel: string | null; sortOrder: number; isPublished: boolean
}

export default function VideoPackageForm({ initialData }: { initialData: VideoPkg | null }) {
  const router = useRouter()

  const [category, setCategory] = useState(initialData?.category ?? '')
  const [name, setName] = useState(initialData?.name ?? '')
  const [price, setPrice] = useState(String(initialData?.price ?? ''))
  const [priceLabel, setPriceLabel] = useState(initialData?.priceLabel ?? '')
  const [sortOrder, setSortOrder] = useState(String(initialData?.sortOrder ?? 0))
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = {
      category, name, price,
      priceLabel: priceLabel || null,
      sortOrder: Number(sortOrder) || 0,
      isPublished,
    }
    const url = initialData ? `/api/admin/video-packages/${initialData.id}` : '/api/admin/video-packages'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/pricing')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this video package?')) return
    const res = await fetch(`/api/admin/video-packages/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/pricing')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Video Package' : 'New Video Package'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.name}` : 'Create a new video package'}</p>
        </div>
        {initialData && <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>}
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="admin-section-title">Basic Info</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Category *</label>
              <input className="admin-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Video Services" required />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Group heading shown on the public pricing page. Use the same text to group items together.</p>
            </div>
            <div className="admin-field">
              <label className="admin-label">Name *</label>
              <input className="admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Model Video (Promotional)" required />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Price (BDT) *</label>
              <input className="admin-input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="8000" required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Price Label (optional)</label>
              <input className="admin-input" value={priceLabel} onChange={e => setPriceLabel(e.target.value)} placeholder="e.g. per video, 15–20 sec" />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Sort Order</label>
              <input className="admin-input" type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
            </div>
            <div className="admin-field" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.6rem' }}>
              <label className="admin-toggle">
                <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
                <span>Published</span>
              </label>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : (initialData ? 'Update Package' : 'Create Package')}
          </button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/pricing')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
