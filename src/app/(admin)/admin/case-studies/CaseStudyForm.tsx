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
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function updatePhase(i: number, field: keyof Phase, val: string) {
    setPhases(prev => prev.map((p, j) => j === i ? { ...p, [field]: val } : p))
  }
  function updateMetric(i: number, field: keyof Metric, val: string) {
    setMetrics(prev => prev.map((m, j) => j === i ? { ...m, [field]: val } : m))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const filteredMetrics = metrics.filter(m => m.num || m.label)
    const filteredPhases = phases.filter(p => p.title || p.body)
    const payload = { title, slug, subtitle, client, industry, category, tag, duration, challenge, solution, services, deliverables, phases: filteredPhases, metrics: filteredMetrics, quote: quote || null, quoteName: quoteName || null, quoteRole: quoteRole || null, quoteCompany: quoteCompany || null, quoteResult: quoteResult || null, isPublished, metaTitle: metaTitle || null, metaDescription: metaDescription || null, ogImageUrl: ogImageUrl || null }
    const url = initialData ? `/api/admin/case-studies/${initialData.id}` : '/api/admin/case-studies'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/case-studies')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this case study? This cannot be undone.')) return
    const res = await fetch(`/api/admin/case-studies/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/case-studies')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Case Study' : 'New Case Study'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.title}` : 'Create a new case study'}</p>
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
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : (initialData ? 'Update Case Study' : 'Create Case Study')}</button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/case-studies')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
