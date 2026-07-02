import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Website Development — KTI Admin' }

type Theme = { id: string; name: string; tags: string[]; url: string; isPublished: boolean; sortOrder: number }

async function getThemes(): Promise<Theme[]> {
  try {
    return await prisma.websiteTheme.findMany({ orderBy: { sortOrder: 'asc' } }) as unknown as Theme[]
  } catch { return [] }
}

export default async function AdminWebsiteDevelopmentPage() {
  const themes = await getThemes()

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Website Development</h1>
          <p className="admin-page-sub">{themes.length} theme{themes.length !== 1 ? 's' : ''} configured</p>
        </div>
        <Link href="/admin/website-development/new" className="admin-btn admin-btn--primary">+ New Theme</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Tags</th>
              <th>Live Preview URL</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {themes.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>No themes yet. <Link href="/admin/website-development/new" style={{ color: '#D7262E' }}>Create one →</Link></td></tr>
            )}
            {themes.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{t.name}</td>
                <td style={{ color: 'rgba(255,255,255,0.55)' }}>{t.tags.join(', ')}</td>
                <td style={{ color: 'rgba(255,255,255,0.55)' }}>
                  <a href={t.url} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>{t.url.replace('https://', '')}</a>
                </td>
                <td>
                  <span className={`admin-badge admin-badge--${t.isPublished ? 'green' : 'gray'}`}>
                    {t.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/website-development/${t.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
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
