import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Applications — KTI Admin' }

async function getApplications() {
  try {
    return await prisma.jobApplication.findMany({ orderBy: { createdAt: 'desc' }, include: { job: { select: { title: true } } } })
  } catch {
    return []
  }
}

export default async function ApplicationsPage() {
  const apps = await getApplications()
  const statusColor: Record<string, string> = { NEW: 'yellow', REVIEWING: 'gray', SHORTLISTED: 'green', REJECTED: 'red', HIRED: 'green' }

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Applications</h1><p className="admin-page-sub">{apps.filter(a => a.status === 'NEW').length} new · {apps.length} total</p></div>
      </div>

      {apps.length === 0 ? (
        <div className="admin-card"><p className="admin-empty">No job applications yet. They appear here when candidates apply via the contact form.</p></div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Applicant</th><th>Position</th><th>Email</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: a.status === 'NEW' ? 600 : 400, color: '#fff' }}>{a.name}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{a.job?.title ?? '—'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{a.email}</td>
                  <td><span className={`admin-badge admin-badge--${statusColor[a.status] ?? 'gray'}`}>{a.status}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><Link href={`/admin/applications/${a.id}`} className="admin-btn admin-btn--outline admin-btn--sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
