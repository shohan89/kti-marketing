'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Submission { id: string; name: string; email: string; company: string | null; budget: string | null; message: string; status: string; createdAt: string }

export default function InboxDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [sub, setSub] = useState<Submission | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/admin/inbox/${id}`).then(r => r.json()).then(d => { setSub(d); setLoading(false) }).catch(() => setLoading(false))
  }, [id])

  async function updateStatus(status: string) {
    await fetch(`/api/admin/inbox/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    router.refresh()
    setSub(prev => prev ? { ...prev, status } : prev)
  }

  if (loading) return <div style={{ color: 'rgba(255,255,255,0.45)', padding: '2rem' }}>Loading…</div>
  if (!sub) return <div style={{ color: '#f87171', padding: '2rem' }}>Submission not found. <Link href="/admin/inbox">← Back to Inbox</Link></div>

  const statusColor: Record<string, string> = { NEW: 'yellow', READ: 'gray', REPLIED: 'green', ARCHIVED: 'gray' }

  return (
    <>
      <div className="admin-page-header">
        <div><Link href="/admin/inbox" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', textDecoration: 'none' }}>← Inbox</Link><h1 className="admin-page-title" style={{ marginTop: '0.25rem' }}>Message from {sub.name}</h1></div>
        <span className={`admin-badge admin-badge--${statusColor[sub.status] ?? 'gray'}`} style={{ fontSize: '0.85rem', padding: '0.3rem 0.75rem' }}>{sub.status}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '1.5rem', alignItems: 'start' }}>
        <div className="admin-card">
          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1rem' }}>Received {new Date(sub.createdAt).toLocaleString()}</p>
          <div style={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap' }}>{sub.message}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="admin-card">
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Contact Details</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[['Name', sub.name], ['Email', sub.email], ['Company', sub.company || '—'], ['Budget', sub.budget || '—']].map(([k, v]) => (
                <li key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)' }}>{k}</span>
                  <span style={{ color: '#fff', fontWeight: 500 }}>{v}</span>
                </li>
              ))}
            </ul>
            <a href={`mailto:${sub.email}`} className="admin-btn admin-btn--primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>Reply via Email →</a>
          </div>

          <div className="admin-card">
            <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Update Status</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {['NEW', 'READ', 'REPLIED', 'ARCHIVED'].map(s => (
                <button key={s} className={`admin-btn admin-btn--sm ${sub.status === s ? 'admin-btn--primary' : 'admin-btn--outline'}`} onClick={() => updateStatus(s)} style={{ justifyContent: 'center' }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
