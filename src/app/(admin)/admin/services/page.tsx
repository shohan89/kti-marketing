import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { servicesData } from '@/data/staticData'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Services — KTI Admin' }

async function getServices() {
  try {
    return await prisma.service.findMany({ orderBy: { sortOrder: 'asc' } })
  } catch {
    return servicesData.map((s, i) => ({ ...s, id: String(i), isPublished: true, sortOrder: i, videoUrl: null, metaTitle: null, metaDescription: null, ogImageUrl: null, imageUrl: null, updatedAt: new Date() }))
  }
}

export default async function AdminServicesPage() {
  const services = await getServices()

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Services</h1><p className="admin-page-sub">{services.length} services configured</p></div>
        <Link href="/admin/services/new" className="admin-btn admin-btn--primary">+ New Service</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Title</th><th>Slug</th><th>Status</th><th>Updated</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {services.map(s => (
              <tr key={s.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{s.title}</td>
                <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'rgba(255,255,255,0.45)' }}>{s.slug}</td>
                <td><span className={`admin-badge admin-badge--${s.isPublished ? 'green' : 'gray'}`}>{s.isPublished ? 'Published' : 'Draft'}</span></td>
                <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{new Date(s.updatedAt).toLocaleDateString()}</td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/services/${s.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
                    <Link href={`/services/${s.slug}`} className="admin-btn admin-btn--outline admin-btn--sm" target="_blank">View ↗</Link>
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
