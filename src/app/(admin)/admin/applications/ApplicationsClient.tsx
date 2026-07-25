'use client'

import { useState } from 'react'
import Link from 'next/link'

interface AppRow {
  id: string
  name: string
  email: string
  status: string
  createdAt: string | Date
  job: { title: string; department: string } | null
}

const STATUS_COLOR: Record<string, string> = { NEW: 'yellow', REVIEWING: 'gray', SHORTLISTED: 'green', REJECTED: 'red', HIRED: 'green' }

export default function ApplicationsClient({ apps }: { apps: AppRow[] }) {
  const departments = Array.from(new Set(apps.map(a => a.job?.department).filter((d): d is string => !!d))).sort()
  const [activeDept, setActiveDept] = useState<string>('All')

  const filtered = activeDept === 'All' ? apps : apps.filter(a => a.job?.department === activeDept)
  const newCount = (list: AppRow[]) => list.filter(a => a.status === 'NEW').length

  return (
    <>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Applications</h1>
          <p className="admin-page-sub">{newCount(filtered)} new · {filtered.length} total{activeDept !== 'All' ? ` in ${activeDept}` : ''}</p>
        </div>
      </div>

      {departments.length > 1 && (
        <div className="admin-dept-tabs">
          <button
            className={`admin-dept-tab${activeDept === 'All' ? ' admin-dept-tab--active' : ''}`}
            onClick={() => setActiveDept('All')}
          >
            All <span className="admin-dept-tab__count">{apps.length}</span>
          </button>
          {departments.map(dept => (
            <button
              key={dept}
              className={`admin-dept-tab${activeDept === dept ? ' admin-dept-tab--active' : ''}`}
              onClick={() => setActiveDept(dept)}
            >
              {dept} <span className="admin-dept-tab__count">{apps.filter(a => a.job?.department === dept).length}</span>
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty">
            {apps.length === 0
              ? 'No job applications yet. They appear here when candidates apply via the contact form.'
              : `No applications for ${activeDept}.`}
          </p>
        </div>
      ) : (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Applicant</th><th>Position</th><th>Department</th><th>Email</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td style={{ fontWeight: a.status === 'NEW' ? 600 : 400, color: '#fff' }}>{a.name}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{a.job?.title ?? '—'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{a.job?.department ?? '—'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>{a.email}</td>
                  <td><span className={`admin-badge admin-badge--${STATUS_COLOR[a.status] ?? 'gray'}`}>{a.status}</span></td>
                  <td style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td><Link href={`/admin/applications/${a.id}`} className="admin-btn admin-btn--outline admin-btn--sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
