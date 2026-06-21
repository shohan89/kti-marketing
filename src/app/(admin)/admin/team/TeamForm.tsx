'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

type TeamMember = {
  id: string; name: string; role: string; bio: string | null
  imageUrl: string | null; socialLinks: unknown
  sortOrder: number; isPublished: boolean
}

const SOCIAL_PLATFORMS = [
  { key: 'linkedin',   label: 'LinkedIn',          placeholder: 'https://linkedin.com/in/username' },
  { key: 'instagram',  label: 'Instagram',          placeholder: 'https://instagram.com/username' },
  { key: 'facebook',   label: 'Facebook',           placeholder: 'https://facebook.com/username' },
  { key: 'twitter',    label: 'Twitter / X',        placeholder: 'https://x.com/username' },
  { key: 'youtube',    label: 'YouTube',            placeholder: 'https://youtube.com/@channel' },
  { key: 'tiktok',     label: 'TikTok',             placeholder: 'https://tiktok.com/@username' },
  { key: 'whatsapp',   label: 'WhatsApp',           placeholder: 'https://wa.me/8801XXXXXXXXX' },
  { key: 'behance',    label: 'Behance',            placeholder: 'https://behance.net/username' },
  { key: 'dribbble',   label: 'Dribbble',           placeholder: 'https://dribbble.com/username' },
  { key: 'github',     label: 'GitHub',             placeholder: 'https://github.com/username' },
  { key: 'pinterest',  label: 'Pinterest',          placeholder: 'https://pinterest.com/username' },
  { key: 'website',    label: 'Personal Website',   placeholder: 'https://yoursite.com' },
  { key: 'email',      label: 'Email',              placeholder: 'mailto:name@example.com' },
]

function parseSocialLinks(raw: unknown): Record<string, string> {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    return raw as Record<string, string>
  }
  return {}
}

export default function TeamForm({ initialData }: { initialData: TeamMember | null }) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [bio, setBio] = useState(initialData?.bio ?? '')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '')
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(parseSocialLinks(initialData?.socialLinks))
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const addedKeys = Object.keys(socialLinks)
  const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !addedKeys.includes(p.key))

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'team')
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) setImageUrl(data.url)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  function addPlatform(key: string) {
    setSocialLinks(prev => ({ ...prev, [key]: '' }))
  }

  function removePlatform(key: string) {
    setSocialLinks(prev => {
      const copy = { ...prev }
      delete copy[key]
      return copy
    })
  }

  function updateSocialUrl(key: string, url: string) {
    setSocialLinks(prev => ({ ...prev, [key]: url }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { name, role, bio: bio || null, imageUrl: imageUrl || null, socialLinks, sortOrder, isPublished }
    const url = initialData ? `/api/admin/team/${initialData.id}` : '/api/admin/team'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/team')
    } else {
      const data = await res.json()
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm('Delete this team member? This cannot be undone.')) return
    const res = await fetch(`/api/admin/team/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/team')
    else setError('Delete failed')
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit Team Member' : 'New Team Member'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.name}` : 'Add a new team member'}</p>
        </div>
        {initialData && <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete}>Delete</button>}
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        {/* Profile Photo */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Profile Photo</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{
              width: 80, height: 80, borderRadius: '50%', flexShrink: 0,
              background: imageUrl ? 'transparent' : 'rgba(255,255,255,0.06)',
              border: '2px solid rgba(255,255,255,0.12)',
              overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.6rem', color: 'rgba(255,255,255,0.25)',
            }}>
              {imageUrl
                ? <img src={imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '👤'
              }
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
              <button
                type="button"
                className="admin-btn admin-btn--outline admin-btn--sm"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading…' : imageUrl ? 'Change Photo' : '+ Upload Photo'}
              </button>
              {imageUrl && (
                <button type="button" style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.78rem', textAlign: 'left', padding: 0 }} onClick={() => setImageUrl('')}>
                  Remove photo
                </button>
              )}
            </div>
            <div className="admin-field" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="admin-label">Or paste image URL</label>
              <input className="admin-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://…" />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Basic Info</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Name *</label>
              <input className="admin-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="admin-field">
              <label className="admin-label">Role *</label>
              <input className="admin-input" placeholder="e.g. Co-Founder & CEO" value={role} onChange={e => setRole(e.target.value)} required />
            </div>
          </div>
          <div className="admin-field">
            <label className="admin-label">Bio</label>
            <textarea className="admin-textarea" rows={4} value={bio} onChange={e => setBio(e.target.value)} />
          </div>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Sort Order</label>
              <input className="admin-input" type="number" value={sortOrder} onChange={e => setSortOrder(Number(e.target.value))} />
            </div>
            <div className="admin-field" style={{ justifyContent: 'flex-end', paddingBottom: '0.25rem' }}>
              <label className="admin-toggle"><input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} /><span>Published</span></label>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="admin-card" style={{ marginBottom: '1.25rem' }}>
          <h2 className="admin-section-title">Social Media Links</h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.1rem' }}>Only platforms you add here will appear on the public team card.</p>

          {addedKeys.length > 0 && (
            <div style={{ marginBottom: '0.75rem' }}>
              {addedKeys.map(key => {
                const platform = SOCIAL_PLATFORMS.find(p => p.key === key)
                if (!platform) return null
                return (
                  <div key={key} style={{ display: 'flex', gap: '0.65rem', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <span style={{
                      flexShrink: 0, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
                      padding: '0.3rem 0.65rem', borderRadius: '6px',
                      background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)',
                      minWidth: '100px', textAlign: 'center', whiteSpace: 'nowrap',
                    }}>
                      {platform.label}
                    </span>
                    <input
                      className="admin-input"
                      style={{ flex: 1, marginBottom: 0 }}
                      value={socialLinks[key] ?? ''}
                      onChange={e => updateSocialUrl(key, e.target.value)}
                      placeholder={platform.placeholder}
                    />
                    <button
                      type="button"
                      onClick={() => removePlatform(key)}
                      style={{ background: 'none', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', cursor: 'pointer', borderRadius: '8px', padding: '0.45rem 0.65rem', fontSize: '0.8rem', flexShrink: 0 }}
                    >✕</button>
                  </div>
                )
              })}
            </div>
          )}

          {availablePlatforms.length > 0 && (
            <select
              className="admin-input"
              style={{ maxWidth: '240px', background: '#1a1a1a', color: '#fff', colorScheme: 'dark' }}
              value=""
              onChange={e => { if (e.target.value) addPlatform(e.target.value) }}
            >
              <option value="" style={{ background: '#1a1a1a', color: '#fff' }}>+ Add social platform…</option>
              {availablePlatforms.map(p => (
                <option key={p.key} value={p.key} style={{ background: '#1a1a1a', color: '#fff' }}>{p.label}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : (initialData ? 'Update Member' : 'Add Member')}</button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/team')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
