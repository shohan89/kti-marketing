import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Testimonials — KTI Admin' }

type DbTestimonial = {
  id: string; name: string; role: string; company: string
  quote: string; rating: number; result: string | null
  isPublished: boolean; sortOrder: number
}

async function getTestimonials(): Promise<DbTestimonial[]> {
  try {
    return await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' } }) as unknown as DbTestimonial[]
  } catch {
    return []
  }
}

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials()

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Testimonials</h1>
          <p className="admin-page-sub">{testimonials.length} testimonials</p>
        </div>
        <Link href="/admin/testimonials/new" className="admin-btn admin-btn--primary">+ Add Testimonial</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Person</th>
              <th>Company</th>
              <th>Rating</th>
              <th>Quote</th>
              <th>Result</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem 1rem' }}>
                  No testimonials yet. Click <strong style={{ color: 'rgba(255,255,255,0.6)' }}>+ Add Testimonial</strong> to get started.
                </td>
              </tr>
            ) : testimonials.map(t => (
              <tr key={t.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>
                  <div>{t.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{t.role}</div>
                </td>
                <td style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>{t.company}</td>
                <td style={{ letterSpacing: '-1px', fontSize: '0.9rem' }}>
                  <span style={{ color: '#F59E0B' }}>{'★'.repeat(t.rating)}</span>
                  <span style={{ color: 'rgba(255,255,255,0.15)' }}>{'★'.repeat(5 - t.rating)}</span>
                </td>
                <td style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  &ldquo;{t.quote}&rdquo;
                </td>
                <td>
                  {t.result
                    ? <span className="admin-badge admin-badge--yellow">{t.result}</span>
                    : <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>—</span>
                  }
                </td>
                <td>
                  <span className={`admin-badge admin-badge--${t.isPublished ? 'green' : 'gray'}`}>
                    {t.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/testimonials/${t.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
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
