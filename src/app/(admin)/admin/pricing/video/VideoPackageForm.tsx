'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type VideoPkg = {
  id: string; shootingType: string; category: string; name: string; price: number
  priceLabel: string | null; durationTiers?: unknown; sortOrder: number; isPublished: boolean
}

type QtyTierInput = { qty: string; price: string }
type DurationTierInput = { label: string; qtyTiers: QtyTierInput[] }

const SHOOTING_TYPES = ['Indoor Shooting', 'Outdoor Shooting']
const CATEGORIES = ['Video Services', 'Branding Videos']

function parseDurationTiers(raw: unknown): DurationTierInput[] {
  if (!Array.isArray(raw)) return []
  return raw.map(d => {
    const dd = (d ?? {}) as Record<string, unknown>
    const rawTiers = Array.isArray(dd.qtyTiers) ? dd.qtyTiers : []
    const qtyTiers = rawTiers.map(q => {
      const qq = (q ?? {}) as Record<string, unknown>
      return { qty: String(qq.qty ?? ''), price: String(qq.price ?? '') }
    })
    return { label: String(dd.label ?? ''), qtyTiers: qtyTiers.length > 0 ? qtyTiers : [{ qty: '', price: '' }] }
  })
}

export default function VideoPackageForm({ initialData }: { initialData: VideoPkg | null }) {
  const router = useRouter()

  const [shootingType, setShootingType] = useState(initialData?.shootingType ?? SHOOTING_TYPES[0])
  const [category, setCategory] = useState(initialData?.category ?? CATEGORIES[0])
  const [name, setName] = useState(initialData?.name ?? '')
  const [price, setPrice] = useState(String(initialData?.price ?? ''))
  const [priceLabel, setPriceLabel] = useState(initialData?.priceLabel ?? '')
  const [sortOrder, setSortOrder] = useState(String(initialData?.sortOrder ?? 0))
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)
  const [durationTiers, setDurationTiers] = useState<DurationTierInput[]>(() => parseDurationTiers(initialData?.durationTiers))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function addDuration() {
    setDurationTiers(prev => [...prev, { label: '', qtyTiers: [{ qty: '', price: '' }] }])
  }
  function removeDuration(i: number) {
    setDurationTiers(prev => prev.filter((_, idx) => idx !== i))
  }
  function updateDurationLabel(i: number, label: string) {
    setDurationTiers(prev => prev.map((d, idx) => idx === i ? { ...d, label } : d))
  }
  function addQtyTier(i: number) {
    setDurationTiers(prev => prev.map((d, idx) => idx === i ? { ...d, qtyTiers: [...d.qtyTiers, { qty: '', price: '' }] } : d))
  }
  function removeQtyTier(i: number, qi: number) {
    setDurationTiers(prev => prev.map((d, idx) => idx === i ? { ...d, qtyTiers: d.qtyTiers.filter((_, qidx) => qidx !== qi) } : d))
  }
  function updateQtyTier(i: number, qi: number, field: 'qty' | 'price', value: string) {
    setDurationTiers(prev => prev.map((d, idx) => idx === i ? { ...d, qtyTiers: d.qtyTiers.map((q, qidx) => qidx === qi ? { ...q, [field]: value } : q) } : d))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const cleanedDurationTiers = durationTiers
      .filter(d => d.label.trim())
      .map(d => ({
        label: d.label.trim(),
        qtyTiers: d.qtyTiers
          .filter(q => q.qty !== '' && q.price !== '')
          .map(q => ({ qty: Number(q.qty) || 0, price: Number(q.price) || 0 })),
      }))
      .filter(d => d.qtyTiers.length > 0)
    const payload = {
      shootingType, category, name, price,
      priceLabel: priceLabel || null,
      durationTiers: cleanedDurationTiers,
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
              <label className="admin-label">Shooting Type *</label>
              <select className="admin-select" value={shootingType} onChange={e => setShootingType(e.target.value)} required>
                {SHOOTING_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Top-level group shown on the public pricing page.</p>
            </div>
            <div className="admin-field">
              <label className="admin-label">Category *</label>
              <select className="admin-select" value={category} onChange={e => setCategory(e.target.value)} required>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Sub-group heading within the shooting type.</p>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Name *</label>
              <input className="admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Model Video (Promotional)" required />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Price (BDT) *</label>
              <input className="admin-input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="8000" required />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Flat price shown on the Video Package tab. Used as-is if no duration/quantity tiers are set below.</p>
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

        <div className="admin-card">
          <h2 className="admin-section-title">Duration &amp; Quantity Pricing (optional)</h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
            Define exact prices per video length and quantity. When set, customers pick a duration and quantity in the Price Calculator and see the exact price you set here instead of the flat price above.
          </p>

          {durationTiers.map((d, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
                <div className="admin-field" style={{ flex: 1 }}>
                  <label className="admin-label">Duration Label</label>
                  <input className="admin-input" value={d.label} onChange={e => updateDurationLabel(i, e.target.value)} placeholder="e.g. 15–20 sec" />
                </div>
                <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => removeDuration(i)}>Remove Duration</button>
              </div>

              {d.qtyTiers.map((q, qi) => (
                <div key={qi} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', marginBottom: '0.6rem' }}>
                  <div className="admin-field">
                    <label className="admin-label">Quantity</label>
                    <input className="admin-input" type="number" min="1" value={q.qty} onChange={e => updateQtyTier(i, qi, 'qty', e.target.value)} placeholder="1" />
                  </div>
                  <div className="admin-field">
                    <label className="admin-label">Price (BDT)</label>
                    <input className="admin-input" type="number" min="0" value={q.price} onChange={e => updateQtyTier(i, qi, 'price', e.target.value)} placeholder="8000" />
                  </div>
                  <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => removeQtyTier(i, qi)}>×</button>
                </div>
              ))}
              <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => addQtyTier(i)}>+ Add Quantity Tier</button>
            </div>
          ))}

          <button type="button" className="admin-btn admin-btn--outline" onClick={addDuration}>+ Add Duration Option</button>
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
