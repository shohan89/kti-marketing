'use client'

import { useState } from 'react'
import { SCHEMA_TYPES, getSchemaTemplate } from '@/lib/seo-utils'

interface Schema {
  id: string
  schemaType: string
  label: string | null
  data: unknown
  isActive: boolean
}

interface Props {
  pageId: string
  initialSchemas: Schema[]
  onCountChange: (count: number) => void
}

export default function SchemaBuilder({ pageId, initialSchemas, onCountChange }: Props) {
  const [schemas, setSchemas] = useState<Schema[]>(initialSchemas)
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form state for add/edit
  const [schemaType, setSchemaType] = useState<string>('Organization')
  const [schemaLabel, setSchemaLabel] = useState('')
  const [schemaJson, setSchemaJson] = useState('')
  const [jsonError, setJsonError] = useState('')
  const [saving, setSaving] = useState(false)

  function openAdd() {
    setAdding(true)
    setEditingId(null)
    setSchemaType('Organization')
    setSchemaLabel('')
    setSchemaJson(JSON.stringify(getSchemaTemplate('Organization'), null, 2))
    setJsonError('')
  }

  function openEdit(s: Schema) {
    setEditingId(s.id)
    setAdding(false)
    setSchemaType(s.schemaType)
    setSchemaLabel(s.label ?? '')
    setSchemaJson(JSON.stringify(s.data, null, 2))
    setJsonError('')
  }

  function handleTypeChange(type: string) {
    setSchemaType(type)
    setSchemaJson(JSON.stringify(getSchemaTemplate(type), null, 2))
    setJsonError('')
  }

  function validateJson(val: string): object | null {
    try {
      return JSON.parse(val)
    } catch {
      return null
    }
  }

  async function handleSave() {
    const parsed = validateJson(schemaJson)
    if (!parsed) { setJsonError('Invalid JSON — please fix the syntax'); return }
    setJsonError('')
    setSaving(true)

    if (editingId) {
      const res = await fetch(`/api/admin/seo/${pageId}/schemas/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemaType, label: schemaLabel || null, data: parsed }),
      })
      if (res.ok) {
        const updated = await res.json()
        const next = schemas.map(s => s.id === editingId ? { ...updated } : s)
        setSchemas(next)
        onCountChange(next.filter(s => s.isActive).length)
        setEditingId(null)
      }
    } else {
      const res = await fetch(`/api/admin/seo/${pageId}/schemas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemaType, label: schemaLabel || null, data: parsed, isActive: true }),
      })
      if (res.ok) {
        const created = await res.json()
        const next = [...schemas, created]
        setSchemas(next)
        onCountChange(next.filter(s => s.isActive).length)
        setAdding(false)
      }
    }
    setSaving(false)
  }

  async function handleToggleActive(id: string, current: boolean) {
    const s = schemas.find(x => x.id === id)
    if (!s) return
    const res = await fetch(`/api/admin/seo/${pageId}/schemas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemaType: s.schemaType, label: s.label, data: s.data, isActive: !current }),
    })
    if (res.ok) {
      const next = schemas.map(x => x.id === id ? { ...x, isActive: !current } : x)
      setSchemas(next)
      onCountChange(next.filter(x => x.isActive).length)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this schema? This cannot be undone.')) return
    const res = await fetch(`/api/admin/seo/${pageId}/schemas/${id}`, { method: 'DELETE' })
    if (res.ok) {
      const next = schemas.filter(s => s.id !== id)
      setSchemas(next)
      onCountChange(next.filter(s => s.isActive).length)
      if (editingId === id) setEditingId(null)
    }
  }

  const showForm = adding || editingId !== null

  return (
    <div>
      {/* Existing Schemas */}
      {schemas.length > 0 && (
        <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {schemas.map(s => (
            <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className={`admin-badge admin-badge--${s.isActive ? 'green' : 'gray'}`} style={{ fontSize: '0.7rem', flexShrink: 0 }}>{s.schemaType}</span>
              <span style={{ flex: 1, fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.label || s.schemaType}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button
                  type="button"
                  className={`admin-btn admin-btn--sm ${s.isActive ? 'admin-btn--outline' : 'admin-btn--outline'}`}
                  style={{ fontSize: '0.7rem', color: s.isActive ? '#4ade80' : 'rgba(255,255,255,0.3)', borderColor: s.isActive ? 'rgba(74,222,128,0.3)' : 'rgba(255,255,255,0.1)' }}
                  onClick={() => handleToggleActive(s.id, s.isActive)}
                >
                  {s.isActive ? 'Active' : 'Inactive'}
                </button>
                <button type="button" className="admin-btn admin-btn--outline admin-btn--sm" onClick={() => openEdit(s)}>Edit</button>
                <button type="button" className="admin-btn admin-btn--danger admin-btn--sm" onClick={() => handleDelete(s.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {schemas.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem', marginBottom: '1rem' }}>
          No schema markup added yet. Schema helps search engines understand your page.
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.09)', marginBottom: '1rem' }}>
          <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem', marginBottom: '1rem' }}>
            {editingId ? 'Edit Schema' : 'Add New Schema'}
          </div>
          <div className="admin-form-row" style={{ marginBottom: '1rem' }}>
            <div className="admin-field">
              <label className="admin-label">Schema Type</label>
              <select className="admin-select" value={schemaType} onChange={e => handleTypeChange(e.target.value)}>
                {SCHEMA_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="admin-field">
              <label className="admin-label">Label (optional)</label>
              <input className="admin-input" placeholder="e.g. Main Organization" value={schemaLabel} onChange={e => setSchemaLabel(e.target.value)} />
            </div>
          </div>
          <div className="admin-field" style={{ marginBottom: '0.5rem' }}>
            <label className="admin-label">JSON-LD Data</label>
            <textarea
              className="admin-textarea"
              rows={12}
              value={schemaJson}
              onChange={e => { setSchemaJson(e.target.value); setJsonError('') }}
              style={{ fontFamily: '"Fira Code", "Courier New", monospace', fontSize: '0.78rem', lineHeight: 1.5 }}
            />
            {jsonError && <div style={{ color: '#f87171', fontSize: '0.75rem', marginTop: '0.25rem' }}>{jsonError}</div>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : (editingId ? 'Update Schema' : 'Add Schema')}</button>
            <button type="button" className="admin-btn admin-btn--outline" onClick={() => { setAdding(false); setEditingId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      {!showForm && (
        <button type="button" className="admin-btn admin-btn--outline" onClick={openAdd}>
          + Add Schema Markup
        </button>
      )}
    </div>
  )
}
