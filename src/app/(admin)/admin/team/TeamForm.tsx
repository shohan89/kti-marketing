'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type TeamMember = {
  id: string; name: string; role: string; bio: string | null
  imageUrl: string | null; linkedinUrl: string | null
  sortOrder: number; isPublished: boolean
}

export default function TeamForm({ initialData }: { initialData: TeamMember | null }) {
  const router = useRouter()
  const [name, setName] = useState(initialData?.name ?? '')
  const [role, setRole] = useState(initialData?.role ?? '')
  const [bio, setBio] = useState(initialData?.bio ?? '')
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? '')
  const [linkedinUrl, setLinkedinUrl] = useState(initialData?.linkedinUrl ?? '')
  const [sortOrder, setSortOrder] = useState(initialData?.sortOrder ?? 0)
  const [isPublished, setIsPublished] = useState(initialData?.isPublished ?? true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = { name, role, bio: bio || null, imageUrl: imageUrl || null, linkedinUrl: linkedinUrl || null, sortOrder, isPublished }
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
        <div className="admin-card">
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
              <label className="admin-label">Image URL</label>
              <input className="admin-input" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            </div>
            <div className="admin-field">
              <label className="admin-label">LinkedIn URL</label>
              <input className="admin-input" value={linkedinUrl} onChange={e => setLinkedinUrl(e.target.value)} />
            </div>
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

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : (initialData ? 'Update Member' : 'Add Member')}</button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/team')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
