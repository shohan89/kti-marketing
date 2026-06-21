import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Photoshoot Packages — KTI Admin' }

type Pkg = { id: string; type: string; price: string; priceNumeric: number; unit: string; isPublished: boolean; sortOrder: number }

async function getPackages(): Promise<Pkg[]> {
  try {
    return await prisma.photoshootPackage.findMany({ orderBy: { sortOrder: 'asc' } }) as unknown as Pkg[]
  } catch { return [] }
}

export default async function AdminPhotoshootPage() {
  const packages = await getPackages()

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Photoshoot Packages</h1>
          <p className="admin-page-sub">{packages.length} package{packages.length !== 1 ? 's' : ''} configured</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/pricing" className="admin-btn admin-btn--outline">← Marketing Packages</Link>
          <Link href="/admin/pricing/photoshoot/new" className="admin-btn admin-btn--primary">+ New Package</Link>
        </div>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Package Type</th>
              <th>Price Per Session</th>
              <th>Display Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {packages.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '2rem' }}>No photoshoot packages yet. <Link href="/admin/pricing/photoshoot/new" style={{ color: '#D7262E' }}>Create one →</Link></td></tr>
            )}
            {packages.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{p.type}</td>
                <td style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>৳{p.priceNumeric.toLocaleString()}</td>
                <td style={{ color: 'rgba(255,255,255,0.55)' }}>{p.price} <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)' }}>{p.unit}</span></td>
                <td>
                  <span className={`admin-badge admin-badge--${p.isPublished ? 'green' : 'gray'}`}>
                    {p.isPublished ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/pricing/photoshoot/${p.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
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
