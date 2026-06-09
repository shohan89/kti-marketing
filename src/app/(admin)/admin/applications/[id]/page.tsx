'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Application {
  id: string
  name: string
  email: string
  phone: string | null
  coverLetter: string
  cvUrl: string | null
  portfolioUrl: string | null
  status: string
  notes: string | null
  ipAddress: string | null
  createdAt: string
  job: { title: string; slug: string } | null
}

const STATUS_OPTIONS = ['NEW', 'REVIEWING', 'SHORTLISTED', 'REJECTED', 'HIRED']
const STATUS_COLOR: Record<string, string> = {
  NEW: 'yellow', REVIEWING: 'gray', SHORTLISTED: 'green', REJECTED: 'red', HIRED: 'green',
}

function ApplicationActions({ id, initialStatus, initialNotes }: { id: string; initialStatus: string; initialNotes: string | null }) {
  const [status, setStatus] = useState(initialStatus)
  const [notes, setNotes] = useState(initialNotes ?? '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      })
      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2500)
      } else {
        setError('Failed to save. Please try again.')
      }
    } catch {
      setError('Network error.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', margin: 0, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Actions</p>

      <div>
        <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.4rem' }}>Status</label>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          style={{
            width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.4rem',
            border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)',
            color: '#fff', fontSize: '0.875rem', cursor: 'pointer',
          }}
        >
          {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#1a1a1a' }}>{s}</option>)}
        </select>
      </div>

      <div>
        <label style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: '0.4rem' }}>Internal Notes</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={5}
          placeholder="Add notes about this applicant…"
          style={{
            width: '100%', padding: '0.55rem 0.75rem', borderRadius: '0.4rem',
            border: '1.5px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)',
            color: '#fff', fontSize: '0.875rem', resize: 'vertical', fontFamily: 'inherit',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {error && <p style={{ fontSize: '0.82rem', color: '#f87171', margin: 0 }}>{error}</p>}
      {saved && <p style={{ fontSize: '0.82rem', color: '#4ade80', margin: 0 }}>Changes saved.</p>}

      <button
        className="admin-btn admin-btn--primary"
        onClick={handleSave}
        disabled={saving}
        style={{ justifyContent: 'center' }}
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </button>
    </div>
  )
}

export default function ApplicationDetailPage() {
  const { id } = useParams() as { id: string }
  const [app, setApp] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/applications/${id}`)
      .then(r => r.json())
      .then(d => { setApp(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.45)', padding: '2rem' }}>Loading…</div>
  if (!app || 'error' in (app as object)) {
    return (
      <div style={{ color: '#f87171', padding: '2rem' }}>
        Application not found. <Link href="/admin/applications" style={{ color: 'rgba(255,255,255,0.5)' }}>← Back to Applications</Link>
      </div>
    )
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <Link href="/admin/applications" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>← Applications</Link>
          <h1 className="admin-page-title" style={{ marginTop: '0.25rem' }}>{app.name}</h1>
          {app.job && (
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)' }}>
              Applied for{' '}
              <Link href={`/careers/${app.job.slug}`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(255,255,255,0.7)' }}>
                {app.job.title} ↗
              </Link>
            </p>
          )}
        </div>
        <span className={`admin-badge admin-badge--${STATUS_COLOR[app.status] ?? 'gray'}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>
          {app.status}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Cover letter */}
          <div className="admin-card">
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Cover Letter
            </p>
            <div style={{ lineHeight: 1.75, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', fontSize: '0.925rem' }}>
              {app.coverLetter}
            </div>
          </div>

          {/* Links */}
          {(app.cvUrl || app.portfolioUrl) && (
            <div className="admin-card" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {app.cvUrl && (
                <a href={app.cvUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--outline">
                  Download CV ↗
                </a>
              )}
              {app.portfolioUrl && (
                <a href={app.portfolioUrl} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn--outline">
                  Portfolio / LinkedIn ↗
                </a>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Contact details */}
          <div className="admin-card">
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Applicant
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {([
                ['Name', app.name],
                ['Email', app.email],
                ['Phone', app.phone ?? '—'],
                ['Applied', new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })],
              ] as [string, string][]).map(([k, v]) => (
                <li key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', fontSize: '0.85rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }}>{k}</span>
                  <span style={{ color: '#fff', fontWeight: 500, textAlign: 'right', wordBreak: 'break-all' }}>{v}</span>
                </li>
              ))}
            </ul>
            <a href={`mailto:${app.email}`} className="admin-btn admin-btn--primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
              Reply via Email →
            </a>
          </div>

          {/* Status + notes actions */}
          <ApplicationActions id={app.id} initialStatus={app.status} initialNotes={app.notes} />
        </div>
      </div>
    </>
  )
}
