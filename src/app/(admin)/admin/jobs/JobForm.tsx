'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type JobListing = {
  id: string; slug: string; title: string; department: string; location: string
  type: string; salary: string | null; posted: string | null; excerpt: string
  description: string; responsibilities: string[]; requirements: string[]
  niceToHave: string[]; benefits: string[]
  isPublished: boolean; metaTitle: string | null; metaDescription: string | null
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

export default function JobForm({ initialData }: { initialData: JobListing | null }) {
  const router = useRouter()
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [slug, setSlug] = useState(initialData?.slug ?? '')
  const [department, setDepartment] = useState(initialData?.department ?? '')
  const [location, setLocation] = useState(initialData?.location ?? '')
  const [type, setType] = useState(initialData?.type ?? 'Full-time')
  const [salary, setSalary] = useState(initialData?.salary ?? '')
  const [posted, setPosted] = useState(initialData?.posted ?? '')
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '')
  const [description, setDescription] = useState(initialData?.description ?? '')
  const [responsibilities, setResponsibilities] = useState((initialData?.responsibilities ?? []).join('\n'))
  const [requirements, setRequirements] = useState((initialData?.requirements ?? []).join('\n'))
  const [niceToHave, setNiceToHave] = useState((initialData?.niceToHave ?? []).join('\n'))
  const [benefits, setBenefits] = useState((initialData?.benefits ?? []).join('\n'))
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? false)
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? '')
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { title, slug, department, location, type, salary: salary || null, posted: posted || null, excerpt, description, responsibilities, requirements, niceToHave, benefits, isPublished, metaTitle: metaTitle || null, metaDescription: metaDescription || null }
    const url = initialData ? `/api/admin/jobs/${initialData.id}` : '/api/admin/jobs'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/jobs')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this job listing? This cannot be undone.')) return
    const res = await fetch(`/api/admin/jobs/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/jobs')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Job' : 'New Job'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.title}` : 'Create a new job listing'}</p>
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
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Department</label>
              <input className="admin-input" value={department} onChange={e => setDepartment(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Location</label>
              <input className="admin-input" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Type</label>
              <select className="admin-select" value={type} onChange={e => setType(e.target.value)}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Remote</option>
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Salary</label>
              <input className="admin-input" placeholder="e.g. BDT 50,000 – 70,000/mo" value={salary} onChange={e => setSalary(e.target.value)} />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Posted Date</label>
            <input className="admin-input" placeholder="June 2026" value={posted} onChange={e => setPosted(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Excerpt</label>
            <textarea className="admin-textarea" rows={2} value={excerpt} onChange={e => setExcerpt(e.target.value)} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Description</label>
            <textarea className="admin-textarea" rows={5} value={description} onChange={e => setDescription(e.target.value)} />
          </div>
          <label className="admin-toggle"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /><span>Published</span></label>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Requirements</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Responsibilities (one per line)</label>
              <textarea className="admin-textarea" rows={6} value={responsibilities} onChange={e => setResponsibilities(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Requirements (one per line)</label>
              <textarea className="admin-textarea" rows={6} value={requirements} onChange={e => setRequirements(e.target.value)} />
            </div>
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Nice to Have (one per line)</label>
              <textarea className="admin-textarea" rows={4} value={niceToHave} onChange={e => setNiceToHave(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Benefits (one per line)</label>
              <textarea className="admin-textarea" rows={4} value={benefits} onChange={e => setBenefits(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">SEO</h2>
          <div className="admin-field">
            <label className="admin-label">Meta Title</label>
            <input className="admin-input" value={metaTitle} onChange={e => setMetaTitle(e.target.value)} placeholder={title || 'Falls back to job title'} />
          </div>
          <div className="admin-field">
            <label className="admin-label">Meta Description</label>
            <textarea className="admin-textarea" rows={3} value={metaDescription} onChange={e => setMetaDescription(e.target.value)} placeholder={excerpt || 'Falls back to excerpt'} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : (initialData ? 'Update Job' : 'Create Job')}</button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/jobs')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
