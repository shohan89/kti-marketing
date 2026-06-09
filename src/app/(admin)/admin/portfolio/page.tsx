import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { caseStudies } from '@/data/staticData'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Portfolio — KTI Admin' }

type DbCaseStudy = { id: string; slug: string; client: string; title: string; tag: string; isPublished: boolean }

async function getCaseStudies(): Promise<DbCaseStudy[]> {
  try {
    return await prisma.caseStudy.findMany({ orderBy: { createdAt: 'desc' } }) as unknown as DbCaseStudy[]
  } catch {
    return caseStudies.map((cs, i) => ({ id: String(i), slug: cs.slug, client: cs.client, title: cs.title, tag: cs.tag, isPublished: true }))
  }
}

export default async function AdminPortfolioPage() {
  const studies = await getCaseStudies()

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Portfolio</h1><p className="admin-page-sub">{studies.length} portfolio items</p></div>
        <Link href="/admin/portfolio/new" className="admin-btn admin-btn--primary">+ New Portfolio Item</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Client</th><th>Title</th><th>Tag</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {studies.map(cs => (
              <tr key={cs.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{cs.client}</td>
                <td style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cs.title}</td>
                <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{cs.tag}</td>
                <td><span className={`admin-badge admin-badge--${cs.isPublished ? 'green' : 'gray'}`}>{cs.isPublished ? 'Published' : 'Draft'}</span></td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/portfolio/${cs.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
                    <Link href={`/portfolio/${cs.slug}`} className="admin-btn admin-btn--outline admin-btn--sm" target="_blank">View ↗</Link>
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
