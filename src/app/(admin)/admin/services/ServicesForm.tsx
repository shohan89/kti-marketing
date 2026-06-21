'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ProcessStep = { num: string; title: string; body: string }
type ResultItem = { stat: string; label: string; description: string }
type FaqItem = { q: string; a: string }

type Service = {
  id: string; slug: string; title: string; description: string; longDescription: string
  headline: string; imageUrl: string | null; videoUrl: string | null
  imageGallery: unknown; videoGallery: unknown
  sortOrder: number; isPublished: boolean; deliverables: string[]
  processSteps: unknown; results: unknown; faqs: unknown
  metaTitle: string | null; metaDescription: string | null; ogImageUrl: string | null
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function parseGallery(raw: unknown): string[] {
  return Array.isArray(raw) ? raw.map(String) : []
}

function toEmbedUrl(url: string): string {
  if (!url) return ''
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (m) return `https://www.youtube.com/embed/${m[1]}`
  if (url.includes('youtube.com/embed/')) return url
  return ''
}

function parseSteps(raw: unknown): ProcessStep[] {
  if (!Array.isArray(raw)) return [{ num: '01', title: '', body: '' }, { num: '02', title: '', body: '' }, { num: '03', title: '', body: '' }]
  return raw.map((s: Record<string, string>) => ({ num: String(s.num ?? ''), title: String(s.title ?? ''), body: String(s.body ?? '') }))
}

function parseResults(raw: unknown): ResultItem[] {
  if (!Array.isArray(raw)) return [{ stat: '', label: '', description: '' }]
  return raw.map((r: Record<string, string>) => ({ stat: String(r.stat ?? ''), label: String(r.label ?? ''), description: String(r.description ?? '') }))
}

function parseFaqs(raw: unknown): FaqItem[] {
  if (!Array.isArray(raw)) return [{ q: '', a: '' }]
  return raw.map((f: Record<string, string>) => ({ q: String(f.q ?? ''), a: String(f.a ?? '') }))
}

export default function ServicesForm({ initialData }: { initialData: Service | null }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [headline, setHeadline] = useState(initialData?.headline ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [longDescription, setLongDescription] = useState(initialData?.longDescription ?? '')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '')
  const [videoUrl, setVideoUrl] = useState(initialData?.videoUrl ?? '')
  const [imageGallery, setImageGallery] = useState<string[]>(parseGallery(initialData?.imageGallery))
  const [videoGallery, setVideoGallery] = useState<string[]>(parseGallery(initialData?.videoGallery))
  const [galleryImgUploading, setGalleryImgUploading] = useState(false)
  const [galleryImgError, setGalleryImgError] = useState('')
  const [newVideoUrl, setNewVideoUrl] = useState('')
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)
  const [deliverables, setDeliverables] = useState(
    Array.isArray(initialData?.deliverables) ? initialData.deliverables.join('\n') : ''
  )
  const [steps, setSteps] = useState<ProcessStep[]>(parseSteps(initialData?.processSteps))
  const [results, setResults] = useState<ResultItem[]>(parseResults(initialData?.results))
  const [faqs, setFaqs] = useState<FaqItem[]>(parseFaqs(initialData?.faqs))
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? '')
  const [ogImageUrl, setOgImageUrl] = useState(initialData?.ogImageUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleGalleryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setGalleryImgUploading(true)
    setGalleryImgError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'services')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) { setGalleryImgError(data.error ?? 'Upload failed'); return }
      setImageGallery(prev => [...prev, data.url])
    } catch {
      setGalleryImgError('Upload failed')
    } finally {
      setGalleryImgUploading(false)
      e.target.value = ''
    }
  }

  function addVideoGalleryUrl() {
    const url = newVideoUrl.trim()
    if (!url) return
    setVideoGallery(prev => [...prev, url])
    setNewVideoUrl('')
  }

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!initialData) setSlug(slugify(v))
  }

  function updateStep(i: number, field: keyof ProcessStep, val: string) {
    setSteps(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s))
  }

  function updateResult(i: number, field: keyof ResultItem, val: string) {
    setResults(prev => prev.map((r, idx) => idx === i ? { ...r, [field]: val } : r))
  }

  function updateFaq(i: number, field: keyof FaqItem, val: string) {
    setFaqs(prev => prev.map((f, idx) => idx === i ? { ...f, [field]: val } : f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const processSteps = steps.filter(s => s.title)
    const resultsClean = results.filter(r => r.stat || r.label)
    const faqsClean = faqs.filter(f => f.q)
    const payload = {
      title, slug, headline, description, longDescription,
      imageUrl: imageUrl || null, videoUrl: videoUrl || null,
      imageGallery, videoGallery,
      sortOrder, isPublished, deliverables,
      processSteps, results: resultsClean, faqs: faqsClean,
      metaTitle: metaTitle || null, metaDescription: metaDescription || null,
      ogImageUrl: ogImageUrl || null,
    }
    const url = initialData ? `/api/admin/services/${initialData.id}` : '/api/admin/services'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/services')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this service? This cannot be undone.')) return
    const res = await fetch(`/api/admin/services/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/services')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Service' : 'New Service'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.title}` : 'Create a new service page'}</p>
        </div>
        <div className="admin-actions">
          {initialData && (
            <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>

      {error && (
        <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">

        {/* Basic Info */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Basic Info</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Title *</label>
              <input className="admin-input" required value={title} onChange={e => handleTitleChange(e.target.value)} placeholder="e.g. SEO & Growth Marketing" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Slug *</label>
              <input className="admin-input" required value={slug} onChange={e => setSlug(e.target.value)} placeholder="e.g. seo-growth-marketing" />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Headline</label>
            <input className="admin-input" value={headline} onChange={e => setHeadline(e.target.value)} placeholder="Short bold tagline for the service hero" />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Sort Order</label>
              <input className="admin-input" type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} />
            </div>
            <div className="admin-field" style={{ justifyContent: 'flex-end', display: 'flex', alignItems: 'center', gap: '0.75rem', paddingTop: '1.25rem' }}>
              <label className="admin-label" style={{ margin: 0 }}>Published</label>
              <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} style={{ width: 18, height: 18, cursor: 'pointer' }} />
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Media</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Image URL</label>
              <input className="admin-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Video URL</label>
              <input className="admin-input" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} placeholder="https://youtube.com/…" />
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Image Gallery</h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Upload images to display in a gallery on the service page.</p>
          {galleryImgError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{galleryImgError}</p>}
          {imageGallery.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {imageGallery.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={url} alt={`Gallery image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => setImageGallery(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                </div>
              ))}
            </div>
          )}
          <label className="admin-btn admin-btn--outline" style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            {galleryImgUploading ? 'Uploading…' : '+ Upload Image'}
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleGalleryImageUpload} disabled={galleryImgUploading} />
          </label>
        </div>

        {/* Video Gallery */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Video Gallery</h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Add YouTube video URLs to display as embedded videos on the service page.</p>
          {videoGallery.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {videoGallery.map((url, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '0.5rem 0.75rem' }}>
                  {toEmbedUrl(url) && (
                    <img
                      src={`https://img.youtube.com/vi/${url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)?.[1]}/mqdefault.jpg`}
                      alt=""
                      style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }}
                    />
                  )}
                  <span style={{ flex: 1, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{url}</span>
                  <button type="button" onClick={() => setVideoGallery(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>Remove</button>
                </div>
              ))}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="admin-input"
              style={{ flex: 1 }}
              value={newVideoUrl}
              onChange={e => setNewVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addVideoGalleryUrl() } }}
            />
            <button type="button" className="admin-btn admin-btn--outline" onClick={addVideoGalleryUrl}>+ Add</button>
          </div>
        </div>

        {/* Content */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Content</h2>
          <div className="admin-field">
            <label className="admin-label">Short Description</label>
            <textarea className="admin-textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Used in cards and overview sections" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Long Description</label>
            <textarea className="admin-textarea" rows={6} value={longDescription} onChange={e => setLongDescription(e.target.value)} placeholder="Full service description shown on the service detail page" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Deliverables <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>(one per line)</span></label>
            <textarea className="admin-textarea" rows={5} value={deliverables} onChange={e => setDeliverables(e.target.value)} placeholder={"Keyword research & strategy\nOn-page optimization\nTechnical SEO audit"} />
          </div>
        </div>

        {/* Process Steps */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Process Steps</h2>
          {steps.map((step, i) => (
            <div key={i} style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: i < steps.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: 600 }}>Step {i + 1}</div>
              <div className="admin-form-row">
                <div className="admin-field" style={{ flex: '0 0 80px' }}>
                  <label className="admin-label">Num</label>
                  <input className="admin-input" value={step.num} onChange={e => updateStep(i, 'num', e.target.value)} placeholder="01" />
                </div>
                <div className="admin-field" style={{ flex: 1 }}>
                  <label className="admin-label">Step Title</label>
                  <input className="admin-input" value={step.title} onChange={e => updateStep(i, 'title', e.target.value)} placeholder="e.g. Discovery & Audit" />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Step Description</label>
                <textarea className="admin-textarea" rows={3} value={step.body} onChange={e => updateStep(i, 'body', e.target.value)} placeholder="Describe what happens in this step…" />
              </div>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setSteps(prev => [...prev, { num: String(prev.length + 1).padStart(2, '0'), title: '', body: '' }])}>
            + Add Step
          </button>
        </div>

        {/* Results */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Results / Stats</h2>
          {results.map((r, i) => (
            <div key={i} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: i < results.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: 600 }}>Result {i + 1}</div>
              <div className="admin-form-row">
                <div className="admin-field">
                  <label className="admin-label">Stat</label>
                  <input className="admin-input" value={r.stat} onChange={e => updateResult(i, 'stat', e.target.value)} placeholder="e.g. 300%" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Label</label>
                  <input className="admin-input" value={r.label} onChange={e => updateResult(i, 'label', e.target.value)} placeholder="e.g. Organic Traffic Increase" />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Description</label>
                  <input className="admin-input" value={r.description} onChange={e => updateResult(i, 'description', e.target.value)} placeholder="Brief context" />
                </div>
              </div>
            </div>
          ))}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setResults(prev => [...prev, { stat: '', label: '', description: '' }])}>
              + Add Result
            </button>
            {results.length > 1 && (
              <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" style={{ color: '#f87171' }} onClick={() => setResults(prev => prev.slice(0, -1))}>
                Remove Last
              </button>
            )}
          </div>
        </div>

        {/* FAQs */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">FAQs</h2>
          {faqs.map((f, i) => (
            <div key={i} style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: i < faqs.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
                <span>FAQ {i + 1}</span>
                {faqs.length > 1 && (
                  <button type="button" style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.72rem' }} onClick={() => setFaqs(prev => prev.filter((_, idx) => idx !== i))}>Remove</button>
                )}
              </div>
              <div className="admin-field">
                <label className="admin-label">Question</label>
                <input className="admin-input" value={f.q} onChange={e => updateFaq(i, 'q', e.target.value)} placeholder="What does this service include?" />
              </div>
              <div className="admin-field">
                <label className="admin-label">Answer</label>
                <textarea className="admin-textarea" rows={3} value={f.a} onChange={e => updateFaq(i, 'a', e.target.value)} placeholder="Detailed answer to the question…" />
              </div>
            </div>
          ))}
          <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setFaqs(prev => [...prev, { q: '', a: '' }])}>
            + Add FAQ
          </button>
        </div>

        {/* SEO */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">SEO</h2>
          <div className="admin-field">
            <label className="admin-label">Meta Title <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>{metaTitle.length}/60</span></label>
            <input className="admin-input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder="Falls back to service title" />
          </div>
          <div className="admin-field">
            <label className="admin-label">Meta Description <span style={{ color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>{metaDescription.length}/160</span></label>
            <textarea className="admin-textarea" rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder="Falls back to short description" />
          </div>
          <div className="admin-field">
            <label className="admin-label">OG Image URL</label>
            <input className="admin-input" value={ogImageUrl} onChange={e => setOgImageUrl(e.target.value)} placeholder="https://… (1200×630px recommended)" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', paddingBottom: '2rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : initialData ? 'Save Changes' : 'Create Service'}
          </button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/services')}>
            Cancel
          </button>
        </div>

      </form>
    </>
  )
}
