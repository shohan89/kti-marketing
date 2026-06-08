'use client'

import { useState } from 'react'

interface Setting { key: string; value: string; label: string; group: string }

export default function SettingsClient({ settings, groups }: { settings: Setting[]; groups: string[] }) {
  const [values, setValues] = useState<Record<string, string>>(Object.fromEntries(settings.map(s => [s.key, s.value])))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Settings</h1><p className="admin-page-sub">Site-wide configuration stored in the database.</p></div>
        {saved && <span style={{ color: '#4ade80', fontSize: '0.875rem' }}>✓ Saved successfully</span>}
      </div>

      <form className="admin-form" onSubmit={handleSave}>
        {groups.map(group => (
          <div key={group} className="admin-card">
            <h2 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#fff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{group}</h2>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {settings.filter(s => s.group === group).map(s => (
                <div key={s.key} className="admin-field">
                  <label className="admin-label" htmlFor={s.key}>{s.label}</label>
                  <input
                    id={s.key}
                    className="admin-input"
                    value={values[s.key] ?? ''}
                    onChange={e => setValues(prev => ({ ...prev, [s.key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </form>
    </>
  )
}
