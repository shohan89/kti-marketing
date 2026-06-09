'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Phase = { num: string; title: string; body: string }
type Metric = { num: string; label: string }
type CaseStudy = {
  id: string; slug: string; title: string; subtitle: string; client: string
  industry: string; category: string; tag: string; duration: string
  challenge: string; solution: string; body: string
  services: string[]; deliverables: string[]
  phases: unknown; metrics: unknown
  quote: string | null; quoteName: string | null; quoteRole: string | null
  quoteCompany: string | null; quoteResult: string | null
  isPublished: boolean; metaTitle: string | null
  metaDescription: string | null; ogImageUrl: string | null
  imageUrls: unknown; youtubeUrl: string | null
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
const parsePhases = (v: unknown): Phase[] => {
  const arr = Array.isArray(v) ? v : []
  const base: Phase[] = [{ num: '1', title: '', body: '' }, { num: '2', title: '', body: '' }, { num: '3', title: '', body: '' }]
  return base.map((b, i) => arr[i] ? { num: String((arr[i] as {num?: unknown}).num ?? b.num), title: String((arr[i] as {title?: unknown}).title ?? ''), body: String((arr[i] as {body?: unknown}).body ?? '') } : b)
}
const parseMetrics = (v: unknown): Metric[] => {
  const arr = Array.isArray(v) ? v : []
  const base: Metric[] = [{ num: '', label: '' }, { num: '', label: '' }, { num: '', label: '' }, { num: '', label: '' }]
  return base.map((b, i) => arr[i] ? { num: String((arr[i] as {num?: unknown}).num ?? ''), label: String((arr[i] as {label?: unknown}).label ?? '') } : b)
}
const parseImageUrls = (v: unknown): string[] => Array.isArray(v) ? v.map(String) : []

function toEmbedUrl(url: string): string {
  if (!url) return ''
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (m) return `https://www.youtube.com/embed/${m[1]}`
  if (url.includes('youtube.com/embed/')) return url
  return url
}

export default function CaseStudyForm({ initialData }: { initialData: CaseStudy | null }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? '')
  const [client, setClient] = useState(initialData?.client ?? '')
  const [industry, setIndustry] = useState(initialData?.industry ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [tag, setTag] = useState(initialData?.tag ?? '')
  const [duration, setDuration] = useState(initialData?.duration ?? '')
  const [challenge, setChallenge] = useState(initialData?.challenge ?? '')
  const [solution, setSolution] = useState(initialData?.solution ?? '')
  const [services, setServices] = useState((initialData?.services ?? []).join('\n'))
  const [deliverables, setDeliverables] = useState((initialData?.deliverables ?? []).join('\n'))
  const [phases, setPhases] = useState<Phase[]>(parsePhases(initialData?.phases))
  const [metrics, setMetrics] = useState<Metric[]>(parseMetrics(initialData?.metrics))
  const [quote, setQuote] = useState(initialData?.quote ?? '')
  const [quoteName, setQuoteName] = useState(initialData?.quoteName ?? '')
  const [quoteRole, setQuoteRole] = useState(initialData?.quoteRole ?? '')
  const [quoteCompany, setQuoteCompany] = useState(initialData?.quoteCompany ?? '')
  const [quoteResult, setQuoteResult] = useState(initialData?.quoteResult ?? '')
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? '')
  const [ogImageUrl, setOgImageUrl] = useState(initialData?.ogImageUrl ?? '')
  const [imageUrls, setImageUrls] = useState<string[]>(parseImageUrls(initialData?.imageUrls))
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? '')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function updatePhase(i: number, field: keyof Phase, val: string) {
    setPhases(prev => prev.map((p, j) => j === i ? { ...p, [field]: val } : p))
  }
  function updateMetric(i: number, field: keyof Metric, val: string) {
    setMetrics(prev => prev.map((m, j) => j === i ? { ...m, [field]: val } : m))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    setImageUploadError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'portfolio')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setImageUploadError(data.error ?? 'Upload failed'); return }
      setImageUrls(prev => [...prev, data.url])
    } catch {
      setImageUploadError('Upload failed')
    } finally {
      setImageUploading(false)
      e.target.value = ''
    }
  }

  function removeImage(i: number) {
    setImageUrls(prev => prev.filter((_, j) => j !== i))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const filteredMetrics = metrics.filter(m => m.num || m.label)
    const filteredPhases = phases.filter(p => p.title || p.body)
    const payload = { title, slug, subtitle, client, industry, category, tag, duration, challenge, solution, services, deliverables, phases: filteredPhases, metrics: filteredMetrics, quote: quote || null, quoteName: quoteName || null, quoteRole: quoteRole || null, quoteCompany: quoteCompany || null, quoteResult: quoteResult || null, isPublished, metaTitle: metaTitle || null, metaDescription: metaDescription || null, ogImageUrl: ogImageUrl || null, imageUrls: imageUrls.length > 0 ? imageUrls : null, youtubeUrl: youtubeUrl || null }
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

  const embedPreview = toEmbedUrl(youtubeUrl)

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Portfolio Item' : 'New Portfolio Item'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.title}` : 'Create a new portfolio item'}</p>
        </div>
        {initialData && <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>}
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="admin-section-title">Overview</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Title *</label>
              <input className="admin-input" value={title} onChange={e => { setTitle(e.target.value); if (!initialData) setSlug(slugify(e.target.value)) }} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Slug *</label>
              <input className="admin-input" value={slug} onChange={e => setSlug(e.target.value)} required />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Subtitle</label>
            <textarea className="admin-textarea" rows={2} value={subtitle} onChange={e => setSubtitle(e.target.value)} />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Client</label>
              <input className="admin-input" value={client} onChange={e => setClient(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Industry</label>
              <input className="admin-input" value={industry} onChange={e => setIndustry(e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Category</label>
              <input className="admin-input" value={category} onChange={e => setCategory(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Tag</label>
              <input className="admin-input" value={tag} onChange={e => setTag(e.target.value)} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Duration</label>
            <input className="admin-input" placeholder="3 months" value={duration} onChange={e => setDuration(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Challenge</label>
            <textarea className="admin-textarea" rows={4} value={challenge} onChange={e => setChallenge(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Solution</label>
            <textarea className="admin-textarea" rows={4} value={solution} onChange={e => setSolution(e.target.value)} />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Services (one per line)</label>
              <textarea className="admin-textarea" rows={4} value={services} onChange={e => setServices(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Deliverables (one per line)</label>
              <textarea className="admin-textarea" rows={4} value={deliverables} onChange={e => setDeliverables(e.target.value)} />
            </div>
          </div>
          <label className="admin-toggle"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /><span>Published</span></label>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Work Images</h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Upload images to showcase on the portfolio detail page.</p>
          {imageUploadError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{imageUploadError}</p>}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            {imageUrls.map((url, i) => (
              <div key={i} style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                <img src={url} alt={`Work image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
              </div>
            ))}
          </div>
          <label className="admin-btn admin-btn--outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {imageUploading ? 'Uploading…' : '+ Upload Image'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={imageUploading} />
          </label>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">YouTube Video</h2>
          <div className="admin-field">
            <label className="admin-label">YouTube URL</label>
            <input className="admin-input" placeholder="https://www.youtube.com/watch?v=..." value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} />
          </div>
          {embedPreview && (
            <div style={{ marginTop: '1rem', position: 'relative', paddingBottom: '56.25%', height: 0, borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
              <iframe
                src={embedPreview}
                title="Video preview"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
              />
            </div>
          )}
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Phases</h2>
          {phases.map((p, i) => (
            <div key={i} style={{ marginBottom: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Phase {i + 1}</div>
              <div className="admin-form-row">
                <div className="admin-field">
                  <label className="admin-label">Phase Number</label>
                  <input className="admin-input" value={p.num} onChange={e => updatePhase(i, 'num', e.target.value)} placeholder={`0${i + 1}`} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Title</label>
                  <input className="admin-input" value={p.title} onChange={e => updatePhase(i, 'title', e.target.value)} />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Body</label>
                <textarea className="admin-textarea" rows={3} value={p.body} onChange={e => updatePhase(i, 'body', e.target.value)} />
              </div>
            </div>
          ))}
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Metrics</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontWeight: 600, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Metric {i + 1}</div>
                <div className="admin-field">
                  <label className="admin-label">Value (e.g. 3×)</label>
                  <input className="admin-input" value={m.num} onChange={e => updateMetric(i, 'num', e.target.value)} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Label</label>
                  <input className="admin-input" value={m.label} onChange={e => updateMetric(i, 'label', e.target.value)} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Client Quote</h2>
          <div className="admin-field">
            <label className="admin-label">Quote</label>
            <textarea className="admin-textarea" rows={3} value={quote} onChange={e => setQuote(e.target.value)} />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Name</label>
              <input className="admin-input" value={quoteName} onChange={e => setQuoteName(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Role</label>
              <input className="admin-input" value={quoteRole} onChange={e => setQuoteRole(e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Company</label>
              <input className="admin-input" value={quoteCompany} onChange={e => setQuoteCompany(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Result</label>
              <input className="admin-input" value={quoteResult} onChange={e => setQuoteResult(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">SEO</h2>
          <div className="admin-field">
            <label className="admin-label">Meta Title</label>
            <input className="admin-input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder={title || 'Falls back to title'} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Meta Description</label>
            <textarea className="admin-textarea" rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">OG Image URL</label>
            <input className="admin-input" value={ogImageUrl} onChange={e => setOgImageUrl(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : (initialData ? 'Update Portfolio Item' : 'Create Portfolio Item')}</button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/portfolio')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
