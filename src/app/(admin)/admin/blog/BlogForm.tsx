'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(() => import('@/components/ui/RichTextEditor'), { ssr: false })

type BlogPost = {
  id: string; slug: string; title: string; category: string; excerpt: string
  readTime: string; publishDate: string; author: string; tags: string[]
  featured: boolean; isPublished: boolean; body: unknown; coverImageUrl: string | null
  metaTitle: string | null; metaDescription: string | null
  canonicalUrl: string | null; ogImageUrl: string | null
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

function bodyToHtml(body: unknown): string {
  if (typeof body === 'string') return body
  if (!Array.isArray(body)) return ''
  return (body as { heading?: string; paragraphs?: string[] }[]).map(s => {
    const h = s.heading ? `<h2>${s.heading}</h2>` : ''
    const ps = (s.paragraphs ?? []).map(p => `<p>${p}</p>`).join('')
    return h + ps
  }).join('')
}

function parseIsoDate(displayDate: string): string {
  if (!displayDate) return ''
  try {
    const d = new Date(displayDate)
    if (isNaN(d.getTime())) return ''
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch { return '' }
}

function formatDateDisplay(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogForm({ initialData }: { initialData: BlogPost | null }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'MARKETING')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [readTime, setReadTime] = useState(initialData?.readTime ?? '')
  const [publishDateISO, setPublishDateISO] = useState(() => parseIsoDate(initialData?.publishDate ?? ''))
  const [author, setAuthor] = useState(initialData?.author ?? 'KTI Marketing Team')
  const [tags, setTags] = useState(Array.isArray(initialData?.tags) ? (initialData.tags as string[]).join('\n') : '')
  const [body, setBody] = useState(() => bodyToHtml(initialData?.body))
  const [featured, setFeatured] = useState(initialData?.featured ?? false)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? '')
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl ?? '')
  const [ogImageUrl, setOgImageUrl] = useState(initialData?.ogImageUrl ?? '')
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl ?? '')
  const [coverUploading, setCoverUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!initialData) setSlug(slugify(v))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const publishDate = formatDateDisplay(publishDateISO)
    const tagsArr = tags.split('\n').map(t => t.trim()).filter(Boolean)
    const payload = {
      title, slug, category, excerpt, readTime, publishDate,
      author, tags: tagsArr, body, featured, isPublished,
      coverImageUrl: coverImageUrl || null,
      metaTitle: metaTitle || null, metaDescription: metaDescription || null,
      canonicalUrl: canonicalUrl || null, ogImageUrl: ogImageUrl || null,
    }
    const url = initialData ? `/api/admin/blog/${initialData.id}` : '/api/admin/blog'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/blog')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this post? This cannot be undone.')) return
    const res = await fetch(`/api/admin/blog/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/blog')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Post' : 'New Post'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.title}` : 'Create a new blog article'}</p>
        </div>
        <div className="admin-actions">
          {initialData && (
            <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="admin-section-title">Content</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Title *</label>
              <input className="admin-input" value={title} onChange={e => handleTitleChange(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Slug *</label>
              <input className="admin-input" value={slug} onChange={e => setSlug(e.target.value)} required />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Category</label>
              <select className="admin-select" value={category} onChange={e => setCategory(e.target.value)}>
                <option value="MARKETING">Marketing</option>
                <option value="IMPORT">Import</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Read Time</label>
              <input className="admin-input" placeholder="5 min read" value={readTime} onChange={e => setReadTime(e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Author</label>
              <input className="admin-input" value={author} onChange={e => setAuthor(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Publish Date</label>
              <input
                className="admin-input"
                type="date"
                value={publishDateISO}
                onChange={e => setPublishDateISO(e.target.value)}
              />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Excerpt</label>
            <textarea className="admin-textarea" rows={3} value={excerpt} onChange={e => setExcerpt(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Tags (one per line)</label>
            <textarea className="admin-textarea" rows={3} placeholder="SEO&#10;Digital Marketing&#10;E-commerce" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Featured Image</label>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              {coverImageUrl && (
                <img
                  src={coverImageUrl}
                  alt="Featured"
                  style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }}
                />
              )}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  className="admin-input"
                  value={coverImageUrl}
                  onChange={e => setCoverImageUrl(e.target.value)}
                  placeholder="https://... or upload below"
                />
                <label className="admin-btn admin-btn--outline" style={{ cursor: 'pointer', width: 'fit-content' }}>
                  {coverUploading ? 'Uploading…' : 'Upload Image'}
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    disabled={coverUploading}
                    onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setCoverUploading(true)
                      const fd = new FormData()
                      fd.append('file', file)
                      fd.append('folder', 'blog')
                      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
                      const data = await res.json()
                      if (data.url) setCoverImageUrl(data.url)
                      setCoverUploading(false)
                      e.target.value = ''
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Body</label>
            <RichTextEditor value={body} onChange={setBody} />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <label className="admin-toggle"><input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} /><span>Featured</span></label>
            <label className="admin-toggle"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /><span>Published</span></label>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">SEO</h2>
          <div className="admin-field">
            <label className="admin-label">Meta Title</label>
            <input className="admin-input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder={title || 'Falls back to post title'} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Meta Description</label>
            <textarea className="admin-textarea" rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder={excerpt || 'Falls back to excerpt'} />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Canonical URL</label>
              <input className="admin-input" value={canonicalUrl} onChange={e => setCanonicalUrl(e.target.value)} placeholder={`/blog/${slug}`} />
            </div>
            <div className="admin-field">
              <label className="admin-label">OG Image URL</label>
              <input className="admin-input" value={ogImageUrl} onChange={e => setOgImageUrl(e.target.value)} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : (initialData ? 'Update Post' : 'Create Post')}</button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/blog')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
