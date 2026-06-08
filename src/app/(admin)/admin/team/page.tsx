import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Team — KTI Admin' }

type DbTeamMember = {
  id: string; name: string; role: string; bio: string | null
  imageUrl: string | null; linkedinUrl: string | null
  isPublished: boolean; sortOrder: number; createdAt: Date
}

async function getTeam(): Promise<DbTeamMember[]> {
  try {
    return await prisma.teamMember.findMany({ orderBy: { sortOrder: 'asc' } }) as unknown as DbTeamMember[]
  } catch {
    return []
  }
}

export default async function AdminTeamPage() {
  const members = await getTeam()

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Team</h1>
          <p className="admin-page-sub">{members.length} members</p>
        </div>
        <Link href="/admin/team/new" className="admin-btn admin-btn--primary">+ Add Member</Link>
      </div>

      <div className="admin-card admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>LinkedIn</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', padding: '3rem 1rem' }}>
                  No team members yet. Click <strong style={{ color: 'rgba(255,255,255,0.6)' }}>+ Add Member</strong> to get started.
                </td>
              </tr>
            ) : members.map(m => (
              <tr key={m.id}>
                <td style={{ fontWeight: 500, color: '#fff' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {m.imageUrl ? (
                      <img src={m.imageUrl} alt={m.name} style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                    ) : (
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                        {m.name.charAt(0)}
                      </div>
                    )}
                    {m.name}
                  </div>
                </td>
                <td style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.9rem' }}>{m.role}</td>
                <td>
                  {m.linkedinUrl
                    ? <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer" style={{ color: '#0A66C2', fontSize: '0.85rem', textDecoration: 'none' }}>LinkedIn ↗</a>
                    : <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.8rem' }}>—</span>
                  }
                </td>
                <td>
                  <span className={`admin-badge admin-badge--${m.isPublished ? 'green' : 'gray'}`}>
                    {m.isPublished ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <Link href={`/admin/team/${m.id}/edit`} className="admin-btn admin-btn--outline admin-btn--sm">Edit</Link>
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
