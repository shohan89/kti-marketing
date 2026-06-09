import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Portfolio — KTI Admin' }

type DbPortfolioItem = {
  id: string; slug: string; title: string; category: string | null
  imageUrls: unknown; isPublished: boolean; sortOrder: number
}

async function getPortfolioItems(): Promise<DbPortfolioItem[]> {
  try {
    return await prisma.portfolioItem.findMany({ orderBy: { sortOrder: 'asc' } }) as unknown as DbPortfolioItem[]
  } catch {
    return []
  }
}

function getFirstImage(imageUrls: unknown): string | null {
  if (Array.isArray(imageUrls) && imageUrls.length > 0) return String(imageUrls[0])
  return null
}

export default async function AdminPortfolioPage() {
  const items = await getPortfolioItems()

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Portfolio</h1><p className="admin-page-sub">{items.length} item{items.length !== 1 ? 's' : ''}</p></div>
        <Link href="/admin/portfolio/new" className="admin-btn admin-btn--primary">+ New Portfolio Item</Link>
      </div>

      {items.length === 0 ? (
        <div className="admin-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>No portfolio items yet.</p>
          <Link href="/admin/portfolio/new" className="admin-btn admin-btn--primary">Create Your First Item</Link>
        </div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Thumbnail</th><th>Title</th><th>Category</th><th>Order</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {items.map(item => {
                const thumb = getFirstImage(item.imageUrls)
                return (
                  <tr key={item.id}>
                    <td>
                      {thumb ? (
                        <img src={thumb} alt="" style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', display: 'block' }} />
                      ) : (
                        <div style={{ width: '60px', height: '45px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'rgba(255,255,255,0.2)' }}>🖼</div>
                      )}
                    </td>
                    <td style={{ fontWeight: 500, color: '#fff' }}>{item.title}</td>
                    <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{item.category ?? '—'}</td>
                    <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{item.sortOrder}</td>
                    <td><span className={`admin-badge admin-badge--${item.isPublished ? 'green' : 'gray'}`}>{item.isPublished ? 'Published' : 'Draft'}</span></td>
                    <td>
                      <div className="admin-actions">
                        <Link href={`/admin/portfolio/${item.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
                        <Link href={`/portfolio/${item.slug}`} className="admin-btn admin-btn--outline admin-btn--sm" target="_blank">View ↗</Link>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
