import type { Metadata } from 'next'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Dashboard — KTI Admin' }

async function getStats() {
  try {
    const [services, blog, caseStudies, jobs, inbox, applications] = await Promise.all([
      prisma.service.count({ where: { isPublished: true } }),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.caseStudy.count({ where: { isPublished: true } }),
      prisma.jobListing.count({ where: { isPublished: true } }),
      prisma.contactSubmission.count({ where: { status: 'NEW' } }),
      prisma.jobApplication.count({ where: { status: 'NEW' } }),
    ])
    return { services, blog, caseStudies, jobs, inbox, applications }
  } catch {
    return { services: 0, blog: 0, caseStudies: 0, jobs: 0, inbox: 0, applications: 0 }
  }
}

async function getRecentActivity() {
  try {
    const [contacts, apps] = await Promise.all([
      prisma.contactSubmission.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, company: true, createdAt: true, status: true } }),
      prisma.jobApplication.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, name: true, createdAt: true, status: true, job: { select: { title: true } } } }),
    ])
    return { contacts, apps }
  } catch {
    return { contacts: [], apps: [] }
  }
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()])

  const STAT_CARDS = [
    { label: 'Services', num: stats.services, href: '/admin/services', color: '#f87171' },
    { label: 'Blog Posts', num: stats.blog, href: '/admin/blog', color: '#60a5fa' },
    { label: 'Case Studies', num: stats.caseStudies, href: '/admin/case-studies', color: '#a78bfa' },
    { label: 'Open Jobs', num: stats.jobs, href: '/admin/jobs', color: '#34d399' },
    { label: 'New Messages', num: stats.inbox, href: '/admin/inbox', color: '#fbbf24' },
    { label: 'New Applications', num: stats.applications, href: '/admin/applications', color: '#f472b6' },
  ]

  return (
    <>
      <div className="admin-page-header">
        <div><h1 className="admin-page-title">Dashboard</h1><p className="admin-page-sub">Overview of your website content and activity.</p></div>
        <Link href="/" className="admin-btn admin-btn--outline" target="_blank">View Live Site ↗</Link>
      </div>

      <div className="admin-stats-grid">
        {STAT_CARDS.map(({ label, num, href, color }) => (
          <Link key={label} href={href} className="admin-stat-card" style={{ textDecoration: 'none', display: 'block', borderTop: `3px solid ${color}` }}>
            <span className="admin-stat-card__num" style={{ color }}>{num}</span>
            <span className="admin-stat-card__label">{label}</span>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="admin-card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Recent Messages</h2>
          {activity.contacts.length === 0 ? (
            <p className="admin-empty">No messages yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activity.contacts.map(c => (
                <Link key={c.id} href={`/admin/inbox/${c.id}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 500 }}>{c.name}</div>
                    {c.company && <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{c.company}</div>}
                  </div>
                  <span className={`admin-badge admin-badge--${c.status === 'NEW' ? 'yellow' : c.status === 'REPLIED' ? 'green' : 'gray'}`}>{c.status}</span>
                </Link>
              ))}
            </div>
          )}
          <Link href="/admin/inbox" className="admin-btn admin-btn--outline admin-btn--sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>View All →</Link>
        </div>

        <div className="admin-card">
          <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Recent Applications</h2>
          {activity.apps.length === 0 ? (
            <p className="admin-empty">No applications yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {activity.apps.map(a => (
                <Link key={a.id} href={`/admin/applications/${a.id}`} style={{ textDecoration: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <div>
                    <div style={{ fontSize: '0.875rem', color: '#fff', fontWeight: 500 }}>{a.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{a.job?.title}</div>
                  </div>
                  <span className={`admin-badge admin-badge--${a.status === 'NEW' ? 'yellow' : a.status === 'SHORTLISTED' ? 'green' : a.status === 'REJECTED' ? 'red' : 'gray'}`}>{a.status}</span>
                </Link>
              ))}
            </div>
          )}
          <Link href="/admin/applications" className="admin-btn admin-btn--outline admin-btn--sm" style={{ marginTop: '1rem', display: 'inline-flex' }}>View All →</Link>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: '1.5rem' }}>
        <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { label: '+ New Service', href: '/admin/services/new' },
            { label: '+ New Blog Post', href: '/admin/blog/new' },
            { label: '+ New Case Study', href: '/admin/case-studies/new' },
            { label: '+ New Job', href: '/admin/jobs/new' },
            { label: 'Edit Pricing', href: '/admin/pricing' },
            { label: 'Site Settings', href: '/admin/settings' },
          ].map(({ label, href }) => (
            <Link key={href} href={href} className="admin-btn admin-btn--outline">{label}</Link>
          ))}
        </div>
      </div>
    </>
  )
}
