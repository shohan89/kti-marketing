'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type QtyConfig = {
  inputLabel: string; unit: string; capacity: number
  sessionLabel: string; defaultQty: number
  imagesConfig: { defaultImages: number; pricePerImage: number }
}

type PhotoshootPkg = {
  id: string; type: string; icon: string; description: string
  price: string; priceNumeric: number; unit: string; addOn: string | null
  includes: string[]; qtyConfig: QtyConfig
  sortOrder: number; isPublished: boolean
}

function parseQtyConfig(raw: unknown): QtyConfig {
  const q = raw as Record<string, unknown>
  const img = (q?.imagesConfig ?? {}) as Record<string, unknown>
  return {
    inputLabel: String(q?.inputLabel ?? 'How many?'),
    unit: String(q?.unit ?? 'units'),
    capacity: Number(q?.capacity ?? 1),
    sessionLabel: String(q?.sessionLabel ?? 'session'),
    defaultQty: Number(q?.defaultQty ?? 1),
    imagesConfig: {
      defaultImages: Number(img?.defaultImages ?? 0),
      pricePerImage: Number(img?.pricePerImage ?? 0),
    },
  }
}

export default function PhotoshootForm({ initialData }: { initialData: PhotoshootPkg | null }) {
  const router = useRouter()
  const cfg = parseQtyConfig(initialData?.qtyConfig)

  const [type, setType] = useState(initialData?.type ?? '')
  const [icon, setIcon] = useState(initialData?.icon ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [price, setPrice] = useState(initialData?.price ?? '')
  const [priceNumeric, setPriceNumeric] = useState(String(initialData?.priceNumeric ?? ''))
  const [unit, setUnit] = useState(initialData?.unit ?? 'per session')
  const [addOn, setAddOn] = useState(initialData?.addOn ?? '')
  const [includes, setIncludes] = useState(initialData?.includes?.join('\n') ?? '')
  const [sortOrder, setSortOrder] = useState(String(initialData?.sortOrder ?? 0))
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)

  // qty config
  const [inputLabel, setInputLabel] = useState(cfg.inputLabel)
  const [qtyUnit, setQtyUnit] = useState(cfg.unit)
  const [capacity, setCapacity] = useState(String(cfg.capacity))
  const [sessionLabel, setSessionLabel] = useState(cfg.sessionLabel)
  const [defaultQty, setDefaultQty] = useState(String(cfg.defaultQty))
  const [defaultImages, setDefaultImages] = useState(String(cfg.imagesConfig.defaultImages))
  const [pricePerImage, setPricePerImage] = useState(String(cfg.imagesConfig.pricePerImage))

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = {
      type, icon, description, price, priceNumeric, unit,
      addOn: addOn || null, includes,
      inputLabel, qtyUnit, capacity, sessionLabel, defaultQty,
      defaultImages, pricePerImage,
      sortOrder: Number(sortOrder) || 0,
      isPublished,
    }
    const url = initialData ? `/api/admin/photoshoot/${initialData.id}` : '/api/admin/photoshoot'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/pricing/photoshoot')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this photoshoot package?')) return
    const res = await fetch(`/api/admin/photoshoot/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/pricing/photoshoot')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Photoshoot Package' : 'New Photoshoot Package'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.type}` : 'Create a new photoshoot package'}</p>
        </div>
        {initialData && <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>}
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>

        {/* ── Basic Info ─────────────────────────────────── */}
        <div className="admin-card">
          <h2 className="admin-section-title">Basic Info</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Package Type / Name *</label>
              <input className="admin-input" value={type} onChange={e => setType(e.target.value)} placeholder="e.g. Product Photoshoot" required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Icon (emoji)</label>
              <input className="admin-input" value={icon} onChange={e => setIcon(e.target.value)} placeholder="📷" style={{ fontSize: '1.4rem' }} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of this photoshoot package" />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Display Price *</label>
              <input className="admin-input" value={price} onChange={e => setPrice(e.target.value)} placeholder="৳3,000" required />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Display string shown on the card (e.g. "৳3,000")</p>
            </div>
            <div className="admin-field">
              <label className="admin-label">Price Per Session (numeric) *</label>
              <input className="admin-input" type="number" value={priceNumeric} onChange={e => setPriceNumeric(e.target.value)} placeholder="3000" required />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Used in the Price Calculator to compute totals</p>
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Price Unit Label</label>
              <input className="admin-input" value={unit} onChange={e => setUnit(e.target.value)} placeholder="per session" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Add-On (optional)</label>
              <input className="admin-input" value={addOn} onChange={e => setAddOn(e.target.value)} placeholder="e.g. Extra editing ৳200/image" />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">What&apos;s Included (one per line)</label>
            <textarea className="admin-textarea" rows={5} value={includes} onChange={e => setIncludes(e.target.value)} placeholder={"Professional lighting setup\nEdited high-resolution images\nSame-day preview"} />
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

        {/* ── Calculator Config ──────────────────────────── */}
        <div className="admin-card">
          <h2 className="admin-section-title">Price Calculator Settings</h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.5rem' }}>
            These settings control how the Price Calculator computes costs for this package.
          </p>

          <div style={{ background: 'rgba(215,38,46,0.06)', border: '1px solid rgba(215,38,46,0.18)', borderRadius: '10px', padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>Session Calculation</p>
            <div className="admin-form-row">
              <div className="admin-field">
                <label className="admin-label">Input Label</label>
                <input className="admin-input" value={inputLabel} onChange={e => setInputLabel(e.target.value)} placeholder="How many products?" />
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>Label shown above the quantity input</p>
              </div>
              <div className="admin-field">
                <label className="admin-label">Quantity Unit</label>
                <input className="admin-input" value={qtyUnit} onChange={e => setQtyUnit(e.target.value)} placeholder="products" />
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>Unit label next to the number (e.g. "products", "hours")</p>
              </div>
            </div>
            <div className="admin-form-row">
              <div className="admin-field">
                <label className="admin-label">Session Capacity</label>
                <input className="admin-input" type="number" value={capacity} onChange={e => setCapacity(e.target.value)} min="1" placeholder="20" />
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>How many units fit in one session (e.g. 20 products/session)</p>
              </div>
              <div className="admin-field">
                <label className="admin-label">Session Label</label>
                <input className="admin-input" value={sessionLabel} onChange={e => setSessionLabel(e.target.value)} placeholder="session" />
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>Word used for one session (e.g. "session", "day", "hour")</p>
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Default Quantity</label>
              <input className="admin-input" type="number" value={defaultQty} onChange={e => setDefaultQty(e.target.value)} min="1" placeholder="20" />
              <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>Pre-filled quantity when a user opens the calculator</p>
            </div>
          </div>

          <div style={{ background: 'rgba(74,222,128,0.04)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '10px', padding: '1.25rem 1.5rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1rem' }}>Image Cost (optional)</p>
            <div className="admin-form-row">
              <div className="admin-field">
                <label className="admin-label">Default Image Count</label>
                <input className="admin-input" type="number" value={defaultImages} onChange={e => setDefaultImages(e.target.value)} min="0" placeholder="20" />
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>Pre-filled image count in the calculator (set 0 to disable)</p>
              </div>
              <div className="admin-field">
                <label className="admin-label">Price Per Image (BDT)</label>
                <input className="admin-input" type="number" value={pricePerImage} onChange={e => setPricePerImage(e.target.value)} min="0" placeholder="100" />
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.3rem' }}>Cost per edited image (set 0 to hide image input)</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : (initialData ? 'Update Package' : 'Create Package')}
          </button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/pricing/photoshoot')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
