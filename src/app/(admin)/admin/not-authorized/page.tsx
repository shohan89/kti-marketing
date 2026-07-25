import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Not Authorized — KTI Admin' }

export default function NotAuthorizedPage() {
  return (
    <div className="admin-card admin-empty">
      <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>You don&apos;t have access to this page</p>
      <p style={{ marginBottom: '1.5rem' }}>Ask an Admin to grant your account permission for this section.</p>
      <Link href="/admin" className="admin-btn admin-btn--outline">← Back to Dashboard</Link>
    </div>
  )
}
