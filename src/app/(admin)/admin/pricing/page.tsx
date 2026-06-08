import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { marketingPackages } from '@/data/staticData'

export const metadata: Metadata = { title: 'Pricing — KTI Admin' }

type DbPackage = { id: string; name: string; price: number; badge: string | null; highlight: boolean; isPublished: boolean; sortOrder: number }

async function getPackages(): Promise<DbPackage[]> {
  try {
    return await prisma.marketingPackage.findMany({ orderBy: { sortOrder: 'asc' } }) as unknown as DbPackage[]
  } catch {
    return marketingPackages.map((p, i) => ({
      id: String(p.id), name: p.name, price: p.price,
      badge: p.badge ?? null, highlight: p.highlight ?? false,
      isPublished: true, sortOrder: i,
    }))
  }
}

export default async function AdminPricingPage() {
  const packages = await getPackages()

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pricing</h1>
          <p className="admin-page-sub">{packages.length} packages configured</p>
        </div>
        <Link href="/admin/pricing/new" className="admin-btn admin-btn--primary">+ New Package</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Price (BDT)</th>
              <th>Badge</th>
              <th>Highlighted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{p.name}</td>
                <td style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>৳{p.price.toLocaleString()}</td>
                <td>
                  {p.badge
                    ? <span className="admin-badge admin-badge--yellow">{p.badge}</span>
                    : <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>—</span>
                  }
                </td>
                <td>
                  {p.highlight
                    ? <span className="admin-badge admin-badge--green">Featured</span>
                    : <span className="admin-badge admin-badge--gray">Normal</span>
                  }
                </td>
                <td>
                  <span className={`admin-badge admin-badge--${p.isPublished ? 'green' : 'gray'}`}>
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/pricing/${p.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
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
