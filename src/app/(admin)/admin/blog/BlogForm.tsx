'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type BlogPost = {
  id: string; slug: string; title: string; category: string; excerpt: string
  readTime: string; publishDate: string; author: string; tags: string[]
  featured: boolean; isPublished: boolean; body: unknown
  metaTitle: string | null; metaDescription: string | null
  canonicalUrl: string | null; ogImageUrl: string | null
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function BlogForm({ initialData }: { initialData: BlogPost | null }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [category, setCategory] = useState(initialData?.category ?? 'GENERAL')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [readTime, setReadTime] = useState(initialData?.readTime ?? '')
  const [publishDate, setPublishDate] = useState(initialData?.publishDate ?? '')
  const [author, setAuthor] = useState(initialData?.author ?? 'KTI Marketing Team')
  const [tags, setTags] = useState(Array.isArray(initialData?.tags) ? (initialData.tags as string[]).join('\n') : '')
  const bodyRaw = initialData?.body
  const bodyStr = Array.isArray(bodyRaw)
    ? (bodyRaw as {paragraphs?: string[]}[]).flatMap(s => s.paragraphs ?? []).join('\n')
    : ''
  const [body, setBody] = useState(bodyStr)
  const [featured, setFeatured] = useState(initialData?.featured ?? false)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? '')
  const [canonicalUrl, setCanonicalUrl] = useState(initialData?.canonicalUrl ?? '')
  const [ogImageUrl, setOgImageUrl] = useState(initialData?.ogImageUrl ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function handleTitleChange(v: string) {
    setTitle(v)
    if (!initialData) setSlug(slugify(v))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { title, slug, category, excerpt, readTime, publishDate, author, tags, body, featured, isPublished, metaTitle: metaTitle || null, metaDescription: metaDescription || null, canonicalUrl: canonicalUrl || null, ogImageUrl: ogImageUrl || null }
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
                <option value="GENERAL">General</option>
                <option value="ECOMMERCE">E-commerce</option>
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
              <input className="admin-input" placeholder="June 2026" value={publishDate} onChange={e => setPublishDate(e.target.value)} />
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
            <label className="admin-label">Body (one paragraph per line)</label>
            <textarea className="admin-textarea" rows={10} value={body} onChange={e => setBody(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
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
