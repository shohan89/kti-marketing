'use client'

import { useState, useCallback } from 'react'
import AdminToast from '@/components/ui/AdminToast'

type ClientItem = { name: string; logoUrl: string; website: string }
type AchievementItem = { year: string; title: string; description: string }
type FounderTag = { label: string; url: string }

type Props = {
  clients: ClientItem[]
  achievements: AchievementItem[]
  clientsTitle: string
  achievementsTitle: string
  founderTags: FounderTag[]
}

export default function AboutEditorClient({ clients: initClients, achievements: initAchievements, clientsTitle: initClientsTitle, achievementsTitle: initAchievementsTitle, founderTags: initFounderTags }: Props) {
  const [clients, setClients] = useState<ClientItem[]>(initClients)
  const [achievements, setAchievements] = useState<AchievementItem[]>(initAchievements)
  const [clientsTitle, setClientsTitle] = useState(initClientsTitle)
  const [achievementsTitle, setAchievementsTitle] = useState(initAchievementsTitle)
  const [founderTags, setFounderTags] = useState<FounderTag[]>(initFounderTags)
  const [logoUploading, setLogoUploading] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const dismissToast = useCallback(() => setToast(null), [])

  function updateClient(i: number, field: keyof ClientItem, val: string) {
    setClients(prev => prev.map((c, j) => j === i ? { ...c, [field]: val } : c))
  }

  function updateAchievement(i: number, field: keyof AchievementItem, val: string) {
    setAchievements(prev => prev.map((a, j) => j === i ? { ...a, [field]: val } : a))
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>, i: number) {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoUploading(i)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'clients')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) updateClient(i, 'logoUrl', data.url)
    } finally {
      setLogoUploading(null)
      e.target.value = ''
    }
  }

  function updateFounderTag(i: number, field: keyof FounderTag, val: string) {
    setFounderTags(prev => prev.map((t, j) => j === i ? { ...t, [field]: val } : t))
  }

  async function handleSave() {
    setSaving(true); setToast(null)
    try {
      const res = await fetch('/api/admin/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clients, achievements, clientsTitle, achievementsTitle, founderTags }),
      })
      setToast(res.ok
        ? { message: 'Changes saved successfully!', type: 'success' }
        : { message: 'Save failed. Please try again.', type: 'error' }
      )
    } catch {
      setToast({ message: 'Save failed. Please try again.', type: 'error' })
    } finally { setSaving(false) }
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">About Page</h1>
          <p className="admin-page-sub">Manage clients, achievements and more shown on the About page.</p>
        </div>
        <div className="admin-actions">
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      {toast && <AdminToast message={toast.message} type={toast.type} onClose={dismissToast} />}

      {/* Founder Tags */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="admin-section-title">Founder Brand Tags</h2>
        <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>These clickable tags appear under the founder&apos;s name on the About page. Each tag links to a brand or business website.</p>
        {founderTags.map((tag, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div className="admin-field" style={{ flex: '1 1 40%', marginBottom: 0 }}>
              {i === 0 && <label className="admin-label">Tag Label</label>}
              <input className="admin-input" value={tag.label} onChange={e => updateFounderTag(i, 'label', e.target.value)} placeholder="e.g. KIBAN SHOE" />
            </div>
            <div className="admin-field" style={{ flex: '1 1 50%', marginBottom: 0 }}>
              {i === 0 && <label className="admin-label">Link URL</label>}
              <input className="admin-input" value={tag.url} onChange={e => updateFounderTag(i, 'url', e.target.value)} placeholder="https://example.com" />
            </div>
            <div style={{ paddingTop: i === 0 ? '1.75rem' : 0 }}>
              <button type="button" onClick={() => setFounderTags(prev => prev.filter((_, j) => j !== i))} style={{ background: 'none', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', cursor: 'pointer', borderRadius: '8px', padding: '0.45rem 0.65rem', fontSize: '0.8rem' }}>✕</button>
            </div>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" style={{ marginTop: '0.5rem' }} onClick={() => setFounderTags(prev => [...prev, { label: '', url: '' }])}>
          + Add Tag
        </button>
      </div>

      {/* Our Clients */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="admin-section-title">Our Clients</h2>
        <div className="admin-field" style={{ marginBottom: '1.25rem' }}>
          <label className="admin-label">Section Title</label>
          <input className="admin-input" value={clientsTitle} onChange={e => setClientsTitle(e.target.value)} placeholder="Brands We've Helped Grow" />
        </div>
        {clients.map((client, i) => (
          <div key={i} style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: i < clients.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Client {i + 1}</span>
              <button type="button" style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.78rem' }} onClick={() => setClients(prev => prev.filter((_, j) => j !== i))}>Remove</button>
            </div>
            <div className="admin-form-row">
              <div className="admin-field">
                <label className="admin-label">Name *</label>
                <input className="admin-input" value={client.name} onChange={e => updateClient(i, 'name', e.target.value)} placeholder="Client / Brand Name" />
              </div>
              <div className="admin-field">
                <label className="admin-label">Website URL</label>
                <input className="admin-input" value={client.website} onChange={e => updateClient(i, 'website', e.target.value)} placeholder="https://example.com" />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Logo</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {client.logoUrl && (
                  <div style={{ position: 'relative', width: '80px', height: '50px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={client.logoUrl} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    <button type="button" onClick={() => updateClient(i, 'logoUrl', '')} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.6)', color: '#fff', border: 'none', borderRadius: '50%', width: '18px', height: '18px', cursor: 'pointer', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                )}
                <input className="admin-input" style={{ flex: 1, minWidth: 0 }} value={client.logoUrl} onChange={e => updateClient(i, 'logoUrl', e.target.value)} placeholder="Paste logo URL or upload →" />
                <label className="admin-btn admin-btn--outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.8rem' }}>
                  {logoUploading === i ? 'Uploading…' : '+ Upload'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => handleLogoUpload(e, i)} disabled={logoUploading !== null} />
                </label>
              </div>
            </div>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setClients(prev => [...prev, { name: '', logoUrl: '', website: '' }])}>
          + Add Client
        </button>
      </div>

      {/* Achievements */}
      <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
        <h2 className="admin-section-title">Achievements / Milestones</h2>
        <div className="admin-field" style={{ marginBottom: '1.25rem' }}>
          <label className="admin-label">Section Title</label>
          <input className="admin-input" value={achievementsTitle} onChange={e => setAchievementsTitle(e.target.value)} placeholder="Our Milestones" />
        </div>
        {achievements.map((item, i) => (
          <div key={i} style={{ marginBottom: '1.25rem', paddingBottom: '1.25rem', borderBottom: i < achievements.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Milestone {i + 1}</span>
              <button type="button" style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.78rem' }} onClick={() => setAchievements(prev => prev.filter((_, j) => j !== i))}>Remove</button>
            </div>
            <div className="admin-form-row">
              <div className="admin-field" style={{ flex: '0 0 120px' }}>
                <label className="admin-label">Year</label>
                <input className="admin-input" value={item.year} onChange={e => updateAchievement(i, 'year', e.target.value)} placeholder="2024" />
              </div>
              <div className="admin-field" style={{ flex: 1 }}>
                <label className="admin-label">Title *</label>
                <input className="admin-input" value={item.title} onChange={e => updateAchievement(i, 'title', e.target.value)} placeholder="Reached 120+ Clients" />
              </div>
            </div>
            <div className="admin-field">
              <label className="admin-label">Description</label>
              <textarea className="admin-textarea" rows={2} value={item.description} onChange={e => updateAchievement(i, 'description', e.target.value)} placeholder="Brief description of this milestone…" />
            </div>
          </div>
        ))}
        <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => setAchievements(prev => [...prev, { year: '', title: '', description: '' }])}>
          + Add Milestone
        </button>
      </div>

      <div style={{ paddingBottom: '2rem' }}>
        <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </>
  )
}
