import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Inbox — KTI Admin' }

async function getSubmissions() {
  try {
    return await prisma.contactSubmission.findMany({ orderBy: { createdAt: 'desc' } })
  } catch {
    return []
  }
}

export default async function InboxPage() {
  const submissions = await getSubmissions()

  const statusColor: Record<string, string> = { NEW: 'yellow', READ: 'gray', REPLIED: 'green', ARCHIVED: 'gray' }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Inbox</h1>
          <p className="admin-page-sub">{submissions.filter(s => s.status === 'NEW').length} unread · {submissions.length} total</p>
        </div>
      </div>

      {submissions.length === 0 ? (
        <div className="admin-card"><p className="admin-empty">No contact submissions yet. They will appear here when someone fills out the contact form.</p></div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Company</th><th>Budget</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {submissions.map(s => (
                <tr key={s.id} style={s.status === 'NEW' ? { background: 'rgba(251,191,36,0.03)' } : undefined}>
                  <td style={{ fontWeight: s.status === 'NEW' ? 600 : 400, color: '#fff' }}>{s.name}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{s.email}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{s.company || '—'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{s.budget || '—'}</td>
                  <td><span className={`admin-badge admin-badge--${statusColor[s.status] ?? 'gray'}`}>{s.status}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td><Link href={`/admin/inbox/${s.id}`} className="admin-btn admin-btn--outline admin-btn--sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
