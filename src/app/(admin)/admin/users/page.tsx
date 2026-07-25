import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ROLE_LABELS } from '@/lib/permissions'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Users — KTI Admin' }

type DbAdminUser = {
  id: string; email: string; name: string | null; roleLabel: string
  isActive: boolean; departments: string[]; createdAt: Date
}

async function getUsers(): Promise<DbAdminUser[]> {
  try {
    return await prisma.adminUser.findMany({ orderBy: { createdAt: 'asc' } }) as unknown as DbAdminUser[]
  } catch {
    return []
  }
}

export default async function AdminUsersPage() {
  const users = await getUsers()

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Users</h1>
          <p className="admin-page-sub">{users.length} accounts</p>
        </div>
        <Link href="/admin/users/new" className="admin-btn admin-btn--primary">+ Add User</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Role</th>
              <th>Departments</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem 1rem' }}>
                  No admin accounts yet. Click <strong style={{ color: 'rgba(255,255,255,0.6)' }}>+ Add User</strong> to get started.
                </td>
              </tr>
            ) : users.map(u => (
              <tr key={u.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>{u.email}</td>
                <td style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>{u.name || '—'}</td>
                <td><span className="admin-badge admin-badge--gray">{ROLE_LABELS[u.roleLabel] ?? u.roleLabel}</span></td>
                <td style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.82rem' }}>{u.departments.length > 0 ? u.departments.join(', ') : '—'}</td>
                <td>
                  <span className={`admin-badge admin-badge--${u.isActive ? 'green' : 'gray'}`}>{u.isActive ? 'Active' : 'Disabled'}</span>
                </td>
                <td>
                  <Link href={`/admin/users/${u.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
