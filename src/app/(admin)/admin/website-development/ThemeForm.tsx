'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type WebsiteTheme = {
  id: string
  name: string
  tags: string[]
  technology: string | null
  description: string
  image: string
  url: string
  sortOrder: number
  isPublished: boolean
}

export default function ThemeForm({ initialData }: { initialData: WebsiteTheme | null }) {
  const router = useRouter()

  const [name, setName] = useState(initialData?.name ?? '')
  const [tags, setTags] = useState(initialData?.tags?.join('\n') ?? '')
  const [technology, setTechnology] = useState(initialData?.technology ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [image, setImage] = useState(initialData?.image ?? '')
  const [url, setUrl] = useState(initialData?.url ?? '')
  const [sortOrder, setSortOrder] = useState(String(initialData?.sortOrder ?? 0))
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)

  const [imageUploading, setImageUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'website-themes')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) setImage(data.url)
    } finally {
      setImageUploading(false)
      e.target.value = ''
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = {
      name, tags, technology, description, image, url,
      sortOrder: Number(sortOrder) || 0,
      isPublished,
    }
    const apiUrl = initialData ? `/api/admin/website-themes/${initialData.id}` : '/api/admin/website-themes'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(apiUrl, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/website-development')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this theme?')) return
    const res = await fetch(`/api/admin/website-themes/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/website-development')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Theme' : 'New Theme'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.name}` : 'Create a new website theme'}</p>
        </div>
        {initialData && <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>}
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="admin-section-title">Theme Details</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Name *</label>
              <input className="admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Theme One" required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Live Preview URL *</label>
              <input className="admin-input" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://ecom.prodevs.com.bd/theme-1" required />
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Tags (one per line, or comma separated)</label>
            <textarea className="admin-textarea" rows={3} value={tags} onChange={e => setTags(e.target.value)} placeholder={'E-commerce\nFashion'} />
          </div>

          <div className="admin-field">
            <label className="admin-label">Technology Used</label>
            <input className="admin-input" value={technology} onChange={e => setTechnology(e.target.value)} placeholder="e.g. WordPress, Laravel, Next.js, Shopify" />
          </div>

          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Short description of this theme" />
          </div>

          <div className="admin-field">
            <label className="admin-label">Preview Image</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              {image && (
                <div style={{ position: 'relative', width: '70px', height: '70px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <img src={image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <input className="admin-input" style={{ flex: 1, minWidth: 0 }} value={image} onChange={e => setImage(e.target.value)} placeholder="Paste image URL or upload →" />
              <label className="admin-btn admin-btn--outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                {imageUploading ? 'Uploading…' : '+ Upload'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} disabled={imageUploading} />
              </label>
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
            {saving ? 'Saving…' : (initialData ? 'Update Theme' : 'Create Theme')}
          </button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/website-development')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
