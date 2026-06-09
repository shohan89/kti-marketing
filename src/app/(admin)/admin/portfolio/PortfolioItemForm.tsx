'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type PortfolioItem = {
  id: string
  slug: string
  title: string
  description: string | null
  category: string | null
  imageUrls: unknown
  youtubeUrl: string | null
  isPublished: boolean
  sortOrder: number
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function parseImageUrls(v: unknown): string[] {
  return Array.isArray(v) ? v.map(String) : []
}

function toEmbedUrl(url: string): string {
  if (!url) return ''
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (m) return `https://www.youtube.com/embed/${m[1]}`
  if (url.includes('youtube.com/embed/')) return url
  return ''
}

export default function PortfolioItemForm({ initialData }: { initialData: PortfolioItem | null }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [category, setCategory] = useState(initialData?.category ?? '')
  const [sortOrder, setSortOrder] = useState(String(initialData?.sortOrder ?? 0))
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)
  const [imageUrls, setImageUrls] = useState<string[]>(parseImageUrls(initialData?.imageUrls))
  const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl ?? '')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageUploadError, setImageUploadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

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
    const payload = {
      title, slug, description: description || null, category: category || null,
      imageUrls, youtubeUrl: youtubeUrl || null,
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
          <h2 className="admin-section-title">Details</h2>
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
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of this work (optional)" />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Category</label>
              <input className="admin-input" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g. Branding, Photography, Social Media" />
            </div>
            <div className="admin-field">
              <label className="admin-label">Sort Order</label>
              <input className="admin-input" type="number" value={sortOrder} onChange={e => setSortOrder(e.target.value)} placeholder="0" />
            </div>
          </div>
          <label className="admin-toggle"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /><span>Published</span></label>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Work Images</h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Upload images to showcase this work. The first image is used as the card thumbnail.</p>
          {imageUploadError && <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{imageUploadError}</p>}
          {imageUrls.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
              {imageUrls.map((url, i) => (
                <div key={i} style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={url} alt={`Image ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.75)', color: '#fff', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>×</button>
                  {i === 0 && <span style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(215,38,46,0.85)', color: '#fff', fontSize: '0.6rem', fontWeight: 700, padding: '1px 5px', borderRadius: '3px', textTransform: 'uppercase' }}>Cover</span>}
                </div>
              ))}
            </div>
          )}
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
