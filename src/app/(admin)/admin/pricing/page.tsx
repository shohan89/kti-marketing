import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { marketingPackages, photoshootPackages as staticPhotoshoot } from '@/data/staticData'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Pricing — KTI Admin' }

function getPPI(qtyConfig: unknown): number {
  if (!qtyConfig || typeof qtyConfig !== 'object') return 0
  const q = qtyConfig as Record<string, unknown>
  const img = q.imagesConfig
  if (!img || typeof img !== 'object') return 0
  return Number((img as Record<string, unknown>).pricePerImage ?? 0)
}

export default async function AdminPricingPage() {
  let mPkgs: { id: string; name: string; price: number; badge: string | null; highlight: boolean; isPublished: boolean }[] = []
  let pPkgs: { id: string; type: string; icon: string; price: string; priceNumeric: number; unit: string; isPublished: boolean; qtyConfig: unknown }[] = []

  try {
    const [mRows, pRows] = await Promise.all([
      prisma.marketingPackage.findMany({ orderBy: { sortOrder: 'asc' } }),
      prisma.photoshootPackage.findMany({ orderBy: { sortOrder: 'asc' } }),
    ])
    mPkgs = mRows.length > 0
      ? mRows.map(r => ({ id: r.id, name: r.name, price: r.price, badge: r.badge, highlight: r.highlight, isPublished: r.isPublished }))
      : marketingPackages.map((p, i) => ({ id: String(i), name: p.name, price: p.price, badge: p.badge ?? null, highlight: p.highlight, isPublished: true }))
    pPkgs = pRows.length > 0
      ? pRows.map(r => ({ id: r.id, type: r.type, icon: r.icon ?? '', price: r.price, priceNumeric: r.priceNumeric, unit: r.unit, isPublished: r.isPublished, qtyConfig: r.qtyConfig }))
      : staticPhotoshoot.map((p, i) => ({ id: `s${i}`, type: p.type, icon: p.icon, price: p.price, priceNumeric: p.priceNumeric, unit: p.unit, isPublished: true, qtyConfig: p.qtyConfig }))
  } catch {
    mPkgs = marketingPackages.map((p, i) => ({ id: String(i), name: p.name, price: p.price, badge: p.badge ?? null, highlight: p.highlight, isPublished: true }))
    pPkgs = staticPhotoshoot.map((p, i) => ({ id: `s${i}`, type: p.type, icon: p.icon, price: p.price, priceNumeric: p.priceNumeric, unit: p.unit, isPublished: true, qtyConfig: p.qtyConfig }))
  }

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Pricing</h1>
          <p className="admin-page-sub">{mPkgs.length} marketing · {pPkgs.length} photoshoot packages</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link href="/admin/pricing/photoshoot/new" className="admin-btn admin-btn--outline">+ Photoshoot Package</Link>
          <Link href="/admin/pricing/new" className="admin-btn admin-btn--primary">+ Marketing Package</Link>
        </div>
      </div>

      {/* ── Marketing Packages ─────────────────────────── */}
      <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Marketing Packages</p>
      <div className="admin-card admin-table-wrap" style={{ marginBottom: '2rem' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Package Name</th>
              <th>Monthly Price</th>
              <th>Badge</th>
              <th>Highlighted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mPkgs.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{p.name}</td>
                <td style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'monospace' }}>
                  ৳{p.price.toLocaleString()}<span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>/mo</span>
                </td>
                <td>
                  {p.badge ? <span className="admin-badge admin-badge--yellow">{p.badge}</span> : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                </td>
                <td>
                  {p.highlight ? <span className="admin-badge admin-badge--green">Featured</span> : <span className="admin-badge admin-badge--gray">Normal</span>}
                </td>
                <td>
                  <span className={`admin-badge admin-badge--${p.isPublished ? 'green' : 'gray'}`}>{p.isPublished ? 'Published' : 'Draft'}</span>
                </td>
                <td>
                  <Link href={`/admin/pricing/${p.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Photoshoot Packages ────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: 0 }}>Photoshoot Packages</p>
        <Link href="/admin/pricing/photoshoot" style={{ fontSize: '0.78rem', color: '#D7262E', textDecoration: 'none', fontWeight: 600 }}>Manage all →</Link>
      </div>
      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Package Type</th>
              <th>Per Session</th>
              <th>Per Image</th>
              <th>Display Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pPkgs.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '1.5rem' }}>
                  No photoshoot packages. <Link href="/admin/pricing/photoshoot/new" style={{ color: '#D7262E' }}>Create one →</Link>
                </td>
              </tr>
            )}
            {pPkgs.map(p => {
              const ppi = getPPI(p.qtyConfig)
              const isStatic = p.id.startsWith('s') && !p.id.includes('-')
              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 500, color: '#fff' }}>
                    {p.icon && <span style={{ marginRight: '0.5rem' }}>{p.icon}</span>}{p.type}
                    {isStatic && <span style={{ marginLeft: '0.5rem', fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', padding: '0.1rem 0.45rem', borderRadius: '4px', color: 'rgba(255,255,255,0.35)' }}>static</span>}
                  </td>
                  <td style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>
                    ৳{p.priceNumeric.toLocaleString()}
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', fontWeight: 400 }}> /session</span>
                  </td>
                  <td style={{ fontFamily: 'monospace', color: ppi > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)' }}>
                    {ppi > 0 ? <>৳{ppi.toLocaleString()}<span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}> /image</span></> : '—'}
                  </td>
                  <td style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    {p.price} <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem' }}>{p.unit}</span>
                  </td>
                  <td>
                    <span className={`admin-badge admin-badge--${p.isPublished ? 'green' : 'gray'}`}>{p.isPublished ? 'Published' : 'Draft'}</span>
                  </td>
                  <td>
                    {!isStatic
                      ? <Link href={`/admin/pricing/photoshoot/${p.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
                      : <Link href="/admin/pricing/photoshoot/new" className="admin-btn admin-btn--outline admin-btn--sm">Add to DB</Link>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </>
  )
}
