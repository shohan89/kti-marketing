'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type MarketingPackage = {
  id: string; name: string; price: number; badge: string | null
  highlight: boolean; description: string; platforms: string[]
  deliverables: string[]; cta: string; sortOrder: number; isPublished: boolean
}

export default function PricingForm({ initialData }: { initialData: MarketingPackage | null }) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [price, setPrice] = useState(initialData?.price ?? 0)
  const [badge, setBadge] = useState(initialData?.badge ?? '')
  const [highlight, setHighlight] = useState(initialData?.highlight ?? false)
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [platforms, setPlatforms] = useState((initialData?.platforms ?? []).join('\n'))
  const [deliverables, setDeliverables] = useState((initialData?.deliverables ?? []).join('\n'))
  const [cta, setCta] = useState(initialData?.cta ?? 'Get Started')
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { name, price, badge: badge || null, highlight, description, platforms, deliverables, cta, sortOrder, isPublished }
    const url = initialData ? `/api/admin/pricing/${initialData.id}` : '/api/admin/pricing'
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
    if (!initialData || !window.confirm('Delete this package? This cannot be undone.')) return
    const res = await fetch(`/api/admin/pricing/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/pricing')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Package' : 'New Package'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.name}` : 'Create a new marketing package'}</p>
        </div>
        {initialData && <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>}
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Package Name *</label>
              <input className="admin-input" placeholder="e.g. Growth Package" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Price (BDT, per month)</label>
              <input className="admin-input" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Badge (e.g. Most Popular)</label>
              <input className="admin-input" value={badge} onChange={e => setBadge(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">CTA Button Text</label>
              <input className="admin-input" value={cta} onChange={e => setCta(e.target.value)} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Platforms (one per line)</label>
              <textarea className="admin-textarea" rows={5} placeholder="Facebook&#10;Instagram&#10;Google Ads" value={platforms} onChange={e => setPlatforms(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Deliverables (one per line)</label>
              <textarea className="admin-textarea" rows={5} placeholder="Weekly reports&#10;Ad creative&#10;Campaign management" value={deliverables} onChange={e => setDeliverables(e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Sort Order</label>
              <input className="admin-input" type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <label className="admin-toggle"><input type="checkbox" checked={highlight} onChange={e => setHighlight(e.target.checked)} /><span>Highlighted (featured card)</span></label>
            <label className="admin-toggle"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /><span>Published</span></label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : (initialData ? 'Update Package' : 'Create Package')}</button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/pricing')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
