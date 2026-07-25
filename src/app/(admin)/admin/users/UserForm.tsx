'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MODULES, MODULE_LABELS, ROLE_PRESETS, ROLE_LABELS, type PermissionMap, type PermLevel } from '@/lib/permissions'

type AdminUserData = {
  id: string; email: string; name: string | null; roleLabel: string
  permissions: PermissionMap; departments: string[]; isActive: boolean
}

const ROLE_KEYS = Object.keys(ROLE_LABELS)
const LEVELS: PermLevel[] = ['none', 'view', 'manage']

export default function UserForm({ initialData, currentUserRole, currentUserId }: { initialData: AdminUserData | null; currentUserRole: string; currentUserId: string }) {
  const router = useRouter()
  const isSelf = initialData?.id === currentUserId

  const [email, setEmail] = useState(initialData?.email ?? '')
  const [password, setPassword] = useState('')
  const [name, setName] = useState(initialData?.name ?? '')
  const [roleLabel, setRoleLabel] = useState(initialData?.roleLabel ?? 'VIEWER')
  const [permissions, setPermissions] = useState<PermissionMap>(initialData?.permissions ?? ROLE_PRESETS.VIEWER)
  const [departments, setDepartments] = useState((initialData?.departments ?? []).join(', '))
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const targetIsSuperAdmin = initialData?.roleLabel === 'SUPER_ADMIN'
  const canTouchSuperAdmin = currentUserRole === 'SUPER_ADMIN'
  const locked = targetIsSuperAdmin && !canTouchSuperAdmin

  function applyRolePreset(role: string) {
    setRoleLabel(role)
    setPermissions(ROLE_PRESETS[role] ?? ROLE_PRESETS.CUSTOM)
  }

  function setLevel(module: typeof MODULES[number], level: PermLevel) {
    setPermissions(prev => ({ ...prev, [module]: level }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    const payload = {
      email, name: name || null, roleLabel, permissions,
      departments: departments.split(',').map(d => d.trim()).filter(Boolean),
      isActive,
      ...(initialData ? {} : { password }),
    }
    const url = initialData ? `/api/admin/users/${initialData.id}` : '/api/admin/users'
    const method = initialData ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    if (res.ok) {
      router.push('/admin/users')
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Save failed')
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!initialData || !window.confirm(`Remove ${initialData.email}? This also disables their login.`)) return
    const res = await fetch(`/api/admin/users/${initialData.id}`, { method: 'DELETE' })
    if (res.ok) router.push('/admin/users')
    else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Delete failed')
    }
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">{initialData ? 'Edit User' : 'New User'}</h1>
          <p className="admin-page-sub">{initialData ? `Editing: ${initialData.email}` : 'Create a new admin account with a specific role and permissions'}</p>
        </div>
        {initialData && !isSelf && (
          <button type="button" className="admin-btn admin-btn--danger" onClick={handleDelete} disabled={locked}>Delete</button>
        )}
      </div>

      {error && <div className="admin-card" style={{ borderColor: '#ef4444', color: '#ef4444', marginBottom: '1rem' }}>{error}</div>}
      {locked && <div className="admin-card" style={{ borderColor: 'rgba(251,191,36,0.4)', color: '#fbbf24', marginBottom: '1rem' }}>Only a Super Admin can modify a Super Admin account.</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-card">
          <h2 className="admin-section-title">Account</h2>
          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Email *</label>
              <input className="admin-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@ktimarketing.com" required disabled={!!initialData || locked} />
            </div>
            <div className="admin-field">
              <label className="admin-label">Name</label>
              <input className="admin-input" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" disabled={locked} />
            </div>
          </div>

          {!initialData && (
            <div className="admin-field">
              <label className="admin-label">Password *</label>
              <input className="admin-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" required minLength={8} />
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Share this with the new user — they can sign in immediately at /admin/login.</p>
            </div>
          )}

          <div className="admin-form-row">
            <div className="admin-field">
              <label className="admin-label">Role *</label>
              <select className="admin-select" value={roleLabel} onChange={e => applyRolePreset(e.target.value)} disabled={locked}>
                {ROLE_KEYS.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Picking a role pre-fills the permission matrix below — you can still adjust any row after.</p>
            </div>
            <div className="admin-field" style={{ display: 'flex', alignItems: 'center', paddingTop: '1.6rem' }}>
              <label className="admin-toggle">
                <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} disabled={locked} />
                <span>Active (can log in)</span>
              </label>
            </div>
          </div>

          <div className="admin-field">
            <label className="admin-label">Assigned Departments (optional)</label>
            <input className="admin-input" value={departments} onChange={e => setDepartments(e.target.value)} placeholder="e.g. Marketing, Creative" disabled={locked} />
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.35rem' }}>Comma-separated. Only matters for Manager / HR roles — leave blank for unrestricted access to their modules. Names must match the Department field used on job listings.</p>
          </div>
        </div>

        <div className="admin-card">
          <h2 className="admin-section-title">Module Permissions</h2>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)', marginBottom: '1.25rem' }}>What this user can see and change in each part of the dashboard.</p>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Module</th><th>Access</th></tr>
              </thead>
              <tbody>
                {MODULES.map(m => (
                  <tr key={m}>
                    <td style={{ color: '#fff' }}>{MODULE_LABELS[m]}</td>
                    <td>
                      <select
                        className="admin-select"
                        style={{ maxWidth: '160px' }}
                        value={permissions[m]}
                        onChange={e => setLevel(m, e.target.value as PermLevel)}
                        disabled={locked}
                      >
                        {LEVELS.map(l => <option key={l} value={l}>{l === 'none' ? 'No Access' : l === 'view' ? 'View Only' : 'Manage'}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving || locked}>
            {saving ? 'Saving…' : (initialData ? 'Update User' : 'Create User')}
          </button>
          <button type="button" className="admin-btn admin-btn--outline" onClick={() => router.push('/admin/users')}>Cancel</button>
        </div>
      </form>
    </>
  )
}
