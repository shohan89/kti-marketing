import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { jobListings } from '@/data/staticData'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Jobs — KTI Admin' }

async function getJobs() {
  try {
    return await prisma.jobListing.findMany({ orderBy: { postedAt: 'desc' }, include: { _count: { select: { applications: true } } } })
  } catch {
    return jobListings.map((j, i) => ({ ...j, id: String(i), isPublished: true, postedAt: new Date(), expiresAt: null, updatedAt: new Date(), _count: { applications: 0 } }))
  }
}

export default async function AdminJobsPage() {
  const jobs = await getJobs()

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Jobs</h1><p className="admin-page-sub">{jobs.filter(j => j.isPublished).length} active listings</p></div>
        <Link href="/admin/jobs/new" className="admin-btn admin-btn--primary">+ New Job</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Department</th><th>Location</th><th>Type</th><th>Applications</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {jobs.map(j => (
              <tr key={j.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{j.title}</td>
                <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{j.department}</td>
                <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{j.location}</td>
                <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{j.type}</td>
                <td style={{ fontWeight: 600, color: j._count.applications > 0 ? '#fbbf24' : 'rgba(255,255,255,0.35)' }}>{j._count.applications}</td>
                <td><span className={`admin-badge admin-badge--${j.isPublished ? 'green' : 'gray'}`}>{j.isPublished ? 'Active' : 'Draft'}</span></td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/jobs/${j.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
                    <Link href={`/careers/${j.slug}`} className="admin-btn admin-btn--outline admin-btn--sm" target="_blank">View ↗</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
