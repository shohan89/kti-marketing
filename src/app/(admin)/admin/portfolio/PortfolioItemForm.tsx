'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Phase = { num: string; title: string; body: string }
type Result = { stat: string; label: string }

type PortfolioItem = {
  id: string
  slug: string
  title: string
  client: string | null
  description: string | null
  category: string | null
  imageUrls: unknown
  videoUrls: unknown
  youtubeUrl: string | null
  challenge: string | null
  solution: string | null
  phases: unknown
  results: unknown
  services: string[]
  deliverables: string[]
  quote: string | null
  quoteName: string | null
  quoteRole: string | null
  quoteCompany: string | null
  isPublished: boolean
  sortOrder: number
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function parseArr(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : []
}

function parsePhases(v: unknown): Phase[] {
  if (!Array.isArray(v)) return []
  return v.map((p: unknown) => {
    const obj = p as Record<string, unknown>
    return { num: String(obj?.num ?? ''), title: String(obj?.title ?? ''), body: String(obj?.body ?? '') }
  })
}

function parseResults(v: unknown): Result[] {
  if (!Array.isArray(v)) return []
  return v.map((r: unknown) => {
    const obj = r as Record<string, unknown>
    return { stat: String(obj?.stat ?? ''), label: String(obj?.label ?? '') }
  })
}

function toEmbedUrl(url: string): string {
  if (!url) return ''
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (m) return `https://www.youtube.com/embed/${m[1]}`
  if (url.includes('youtube.com/embed/')) return url
  return ''
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.9rem',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px', color: '#fff', fontSize: '0.9rem', boxSizing: 'border-box',
}

const textareaStyle: React.CSSProperties = { ...inputStyle, resize: 'vertical' }

export default function PortfolioItemForm({ initialData }: { initialData: PortfolioItem | null }) {
  const router = useRouter()

  // Basic Info
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [client, setClient] = useState(initialData?.client ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [sortOrder, setSortOrder] = useState(String(initialData?.sortOrder ?? 0))
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)

  // Image Gallery
  const [imageUrls, setImageUrls] = useState<string[]>(parseArr(initialData?.imageUrls))
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')

  // Video Gallery – merge legacy youtubeUrl into videoUrls
  const [videoUrls, setVideoUrls] = useState<string[]>(() => {
    const vids = parseArr(initialData?.videoUrls)
    if (vids.length === 0 && initialData?.youtubeUrl) return [initialData.youtubeUrl]
    return vids
  })
  const [newVideoUrl, setNewVideoUrl] = useState('')

  // Case Study
  const [challenge, setChallenge] = useState(initialData?.challenge ?? '')
  const [solution, setSolution] = useState(initialData?.solution ?? '')

  // Process Phases
  const [phases, setPhases] = useState<Phase[]>(parsePhases(initialData?.phases))

  // Results / Metrics
  const [results, setResults] = useState<Result[]>(parseResults(initialData?.results))

  // Services & Deliverables
  const [services, setServices] = useState<string[]>(initialData?.services ?? [])
  const [deliverables, setDeliverables] = useState<string[]>(initialData?.deliverables ?? [])
  const [newService, setNewService] = useState('')
  const [newDeliverable, setNewDeliverable] = useState('')

  // Testimonial
  const [quote, setQuote] = useState(initialData?.quote ?? '')
  const [quoteName, setQuoteName] = useState(initialData?.quoteName ?? '')
  const [quoteRole, setQuoteRole] = useState(initialData?.quoteRole ?? '')
  const [quoteCompany, setQuoteCompany] = useState(initialData?.quoteCompany ?? '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // ── Image upload ────────────────────────────────────────
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true); setImageUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file); fd.append('folder', 'portfolio')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setImageUploadError(data.error ?? 'Upload failed'); return }
      setImageUrls(prev => [...prev, data.url])
    } catch { setImageUploadError('Upload failed') }
    finally { setImageUploading(false); e.target.value = '' }
  }

  // ── Video URLs ──────────────────────────────────────────
  function addVideo() {
    const url = newVideoUrl.trim()
    if (!url) return
    setVideoUrls(prev => [...prev, url])
    setNewVideoUrl('')
  }

  // ── Phase helpers ───────────────────────────────────────
  function addPhase() {
    setPhases(prev => [...prev, { num: String(prev.length + 1), title: '', body: '' }])
  }
  function updatePhase(i: number, field: keyof Phase, val: string) {
    setPhases(prev => prev.map((p, j) => j === i ? { ...p, [field]: val } : p))
  }

  // ── Result helpers ──────────────────────────────────────
  function addResult() {
    setResults(prev => [...prev, { stat: '', label: '' }])
  }
  function updateResult(i: number, field: keyof Result, val: string) {
    setResults(prev => prev.map((r, j) => j === i ? { ...r, [field]: val } : r))
  }

  // ── Submit ──────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = {
      title, slug,
      client: client || null,
      description: description || null,
      category: category || null,
      imageUrls, videoUrls,
      youtubeUrl: null,
      challenge: challenge || null,
      solution: solution || null,
      phases: phases.filter(p => p.title),
      results: results.filter(r => r.stat || r.label),
      services, deliverables,
      quote: quote || null,
      quoteName: quoteName || null,
      quoteRole: quoteRole || null,
      quoteCompany: quoteCompany || null,
      isPublished, sortOrder: Number(sortOrder) || 0,
    }
    const url = initialData ? `/api/admin/portfolio/${initialData.id}` : '/api/admin/portfolio'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/portfolio')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this portfolio item? This cannot be undone.')) return
    const res = await fetch(`/api/admin/portfolio/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/portfolio')
    else setError('Delete failed')
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px', padding: '1.75rem', marginBottom: '1.5rem',
  }
  const sectionTitle: React.CSSProperties = {
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)',
    marginBottom: '1.25rem',
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.8rem', fontWeight: 600,
    color: 'rgba(255,255,255,0.55)', marginBottom: '0.35rem',
  }
  const rowStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }
  const fieldStyle: React.CSSProperties = { marginBottom: '1rem' }
  const pillStyle: React.CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
    background: 'rgba(215,38,46,0.12)', border: '1px solid rgba(215,38,46,0.25)',
    borderRadius: '100px', padding: '0.25rem 0.6rem 0.25rem 0.85rem',
    fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', marginRight: '0.5rem', marginBottom: '0.5rem',
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Portfolio Item' : 'New Portfolio Item'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.title}` : 'Create a new portfolio item'}</p>
        </div>
        {initialData && <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>}
      </div>

      {error && <div style={{ ...cardStyle, borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form onSubmit={handleSubmit}>

        {/* ── 1. Basic Info ──────────────────────────────── */}
        <div style={cardStyle}>
          <p style={sectionTitle}>Basic Info</p>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Title *</label>
              <input style={inputStyle} value={title} onChange={e => { setTitle(e.target.value); if (!initialData) setSlug(slugify(e.target.value)) }} required />
            </div>
            <div>
              <label style={labelStyle}>Slug *</label>
              <input style={inputStyle} value={slug} onChange={e => setSlug(e.target.value)} required />
            </div>
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Client / Brand</label>
              <input style={inputStyle} value={client} onChange={e => setClient(e.target.value)} placeholder="e.g. Lux, Nike, Acme Corp" />
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <input style={inputStyle} value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Branding, Photography" />
            </div>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Short Description</label>
            <textarea style={{ ...textareaStyle, minHeight: '80px' }} rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="One or two sentences shown on the portfolio card and hero" />
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Sort Order</label>
              <input style={inputStyle} type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.6rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
                <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Published</span>
              </label>
            </div>
          </div>
        </div>

        {/* ── 2. Image Gallery ───────────────────────────── */}
        <div style={cardStyle}>
          <p style={sectionTitle}>Image Gallery</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>Upload work images. The first image is used as the card cover.</p>
          {imageUploadError && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginBottom: '0.75rem' }}>{imageUploadError}</p>}
          {imageUrls.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {imageUrls.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={url} alt={`Image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setImageUrls(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  {i === 0 && <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(215,38,46,0.85)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', textTransform: 'uppercase' }}>Cover</span>}
                </div>
              ))}
            </div>
          )}
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
            {imageUploading ? 'Uploading…' : '+ Upload Image'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={imageUploading} />
          </label>
        </div>

        {/* ── 3. Video Gallery ───────────────────────────── */}
        <div style={cardStyle}>
          <p style={sectionTitle}>Video Gallery</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>Add multiple YouTube video URLs to showcase video work.</p>
          {videoUrls.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              {videoUrls.map((url, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <input style={{ ...inputStyle, flex: 1 }} value={url} onChange={e => setVideoUrls(prev => prev.map((v, j) => j === i ? e.target.value : v))} placeholder="https://www.youtube.com/watch?v=..." />
                  {toEmbedUrl(url) && <span style={{ fontSize: '0.75rem', color: '#4ade80' }}>✓</span>}
                  <button type="button" onClick={() => setVideoUrls(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', padding: '0 0.25rem' }}>×</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <input style={{ ...inputStyle, flex: 1 }} value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVideo() } }} />
            <button type="button" onClick={addVideo} style={{ padding: '0.6rem 1.1rem', background: 'rgba(215,38,46,0.18)', border: '1px solid rgba(215,38,46,0.3)', borderRadius: '8px', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>+ Add Video</button>
          </div>
        </div>

        {/* ── 4. Case Study ──────────────────────────────── */}
        <div style={cardStyle}>
          <p style={sectionTitle}>Case Study</p>
          <div style={fieldStyle}>
            <label style={labelStyle}>Challenge</label>
            <textarea style={{ ...textareaStyle, minHeight: '100px' }} rows={4} value={challenge} onChange={e => setChallenge(e.target.value)} placeholder="What problem did the client face? What were their goals?" />
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle}>Solution</label>
            <textarea style={{ ...textareaStyle, minHeight: '100px' }} rows={4} value={solution} onChange={e => setSolution(e.target.value)} placeholder="How did KTI Marketing solve the challenge? What was the strategy?" />
          </div>
        </div>

        {/* ── 5. Process Phases ──────────────────────────── */}
        <div style={cardStyle}>
          <p style={sectionTitle}>Process Phases</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>Break down how the project was executed step by step.</p>
          {phases.map((phase, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 1fr 2fr auto', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'start' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Phase #</label>
                <input style={inputStyle} value={phase.num} onChange={e => updatePhase(i, 'num', e.target.value)} placeholder="01" />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Title</label>
                <input style={inputStyle} value={phase.title} onChange={e => updatePhase(i, 'title', e.target.value)} placeholder="Strategy" />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Description</label>
                <textarea style={{ ...textareaStyle, minHeight: '60px' }} rows={2} value={phase.body} onChange={e => updatePhase(i, 'body', e.target.value)} placeholder="What happened in this phase..." />
              </div>
              <div style={{ paddingTop: '1.6rem' }}>
                <button type="button" onClick={() => setPhases(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.4rem 0.6rem' }}>×</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addPhase} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Phase</button>
        </div>

        {/* ── 6. Results / Metrics ───────────────────────── */}
        <div style={cardStyle}>
          <p style={sectionTitle}>Results & Metrics</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>Numbers that prove the impact (e.g. "+320% reach", "2.5× ROAS").</p>
          {results.map((r, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '0.75rem', marginBottom: '0.75rem', alignItems: 'start' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Stat / Number</label>
                <input style={inputStyle} value={r.stat} onChange={e => updateResult(i, 'stat', e.target.value)} placeholder="+320%" />
              </div>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Label</label>
                <input style={inputStyle} value={r.label} onChange={e => updateResult(i, 'label', e.target.value)} placeholder="Organic reach increase" />
              </div>
              <div style={{ paddingTop: '1.6rem' }}>
                <button type="button" onClick={() => setResults(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '6px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '0.4rem 0.6rem' }}>×</button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addResult} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.85rem' }}>+ Add Result</button>
        </div>

        {/* ── 7. Services & Deliverables ─────────────────── */}
        <div style={cardStyle}>
          <p style={sectionTitle}>Services & Deliverables</p>
          <div style={rowStyle}>
            {/* Services */}
            <div>
              <label style={labelStyle}>Services Provided</label>
              <div style={{ marginBottom: '0.75rem' }}>
                {services.map((s, i) => (
                  <span key={i} style={pillStyle}>
                    {s}
                    <button type="button" onClick={() => setServices(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.9rem' }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input style={{ ...inputStyle, flex: 1 }} value={newService} onChange={e => setNewService(e.target.value)} placeholder="e.g. Social Media Management" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newService.trim()) { setServices(prev => [...prev, newService.trim()]); setNewService('') } } }} />
                <button type="button" onClick={() => { if (newService.trim()) { setServices(prev => [...prev, newService.trim()]); setNewService('') } }} style={{ padding: '0.6rem 0.9rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>+</button>
              </div>
            </div>
            {/* Deliverables */}
            <div>
              <label style={labelStyle}>Deliverables</label>
              <div style={{ marginBottom: '0.75rem' }}>
                {deliverables.map((d, i) => (
                  <span key={i} style={pillStyle}>
                    {d}
                    <button type="button" onClick={() => setDeliverables(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 0, lineHeight: 1, fontSize: '0.9rem' }}>×</button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input style={{ ...inputStyle, flex: 1 }} value={newDeliverable} onChange={e => setNewDeliverable(e.target.value)} placeholder="e.g. 30 Instagram posts/month" onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newDeliverable.trim()) { setDeliverables(prev => [...prev, newDeliverable.trim()]); setNewDeliverable('') } } }} />
                <button type="button" onClick={() => { if (newDeliverable.trim()) { setDeliverables(prev => [...prev, newDeliverable.trim()]); setNewDeliverable('') } }} style={{ padding: '0.6rem 0.9rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>+</button>
              </div>
            </div>
          </div>
        </div>

        {/* ── 8. Client Testimonial ──────────────────────── */}
        <div style={cardStyle}>
          <p style={sectionTitle}>Client Testimonial</p>
          <div style={fieldStyle}>
            <label style={labelStyle}>Quote</label>
            <textarea style={{ ...textareaStyle, minHeight: '90px' }} rows={3} value={quote} onChange={e => setQuote(e.target.value)} placeholder="What did the client say about working with KTI Marketing?" />
          </div>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Client Name</label>
              <input style={inputStyle} value={quoteName} onChange={e => setQuoteName(e.target.value)} placeholder="Jane Smith" />
            </div>
            <div>
              <label style={labelStyle}>Role / Title</label>
              <input style={inputStyle} value={quoteRole} onChange={e => setQuoteRole(e.target.value)} placeholder="Marketing Director" />
            </div>
          </div>
          <div>
            <label style={labelStyle}>Company</label>
            <input style={inputStyle} value={quoteCompany} onChange={e => setQuoteCompany(e.target.value)} placeholder="Lux Brand" />
          </div>
        </div>

        {/* ── Actions ────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : (initialData ? 'Update Portfolio Item' : 'Create Portfolio Item')}
          </button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/portfolio')}>Cancel</button>
        </div>

      </form>
    </>
  )
}
