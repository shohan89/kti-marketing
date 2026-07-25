'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import type { ModuleKey, PermissionMap } from '@/lib/permissions'
import './admin.css'

const NAV: { href: string; label: string; icon: string; module: ModuleKey | null }[] = [
  { href: '/admin', label: 'Dashboard', icon: '◈', module: null },
  { href: '/admin/media', label: 'Media Library', icon: '⊞', module: 'media' },
  { href: '/admin/homepage', label: 'Homepage', icon: '⌂', module: 'homepage' },
  { href: '/admin/about', label: 'About Page', icon: '◈', module: 'about' },
  { href: '/admin/services', label: 'Services', icon: '⚙', module: 'services' },
  { href: '/admin/blog', label: 'Blog', icon: '✎', module: 'blog' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '◉', module: 'portfolio' },
  { href: '/admin/pricing', label: 'Pricing', icon: '৳', module: 'pricing' },
  { href: '/admin/website-development', label: 'Website Development', icon: '🎨', module: 'website_development' },
  { href: '/admin/jobs', label: 'Jobs', icon: '◎', module: 'jobs' },
  { href: '/admin/team', label: 'Team', icon: '◉', module: 'team' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '❝', module: 'testimonials' },
  { href: '/admin/inbox', label: 'Inbox', icon: '✉', module: 'inbox' },
  { href: '/admin/applications', label: 'Applications', icon: '📋', module: 'applications' },
  { href: '/admin/seo', label: 'SEO Manager', icon: '◎', module: 'seo' },
  { href: '/admin/users', label: 'Users', icon: '👤', module: 'users' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙', module: 'settings' },
]

export default function AdminShell({ children, permissions, roleLabel }: { children: React.ReactNode; permissions: PermissionMap | null; roleLabel: string | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (pathname === '/admin/login') return <>{children}</>

  // No resolved permissions (e.g. mid-rollout) fails open for *display* only —
  // real enforcement always happens server-side in proxy.ts and the API routes.
  const visibleNav = permissions
    ? NAV.filter(item => item.module === null || permissions[item.module] !== 'none')
    : NAV

  async function handleSignOut() {
    // The session cookie is HttpOnly, so only the server can clear it.
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
    } catch {}
    router.push('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link href="/admin" className="admin-sidebar__logo">KTI<span className="admin-sidebar__logo-dot">.</span></Link>
          <span className="admin-sidebar__badge">{roleLabel ?? 'Admin'}</span>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {visibleNav.map(({ href, label, icon }) => {
            const active = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
            return (
              <Link key={href} href={href} className={`admin-nav__item${active ? ' admin-nav__item--active' : ''}`} onClick={() => setSidebarOpen(false)}>
                <span className="admin-nav__icon" aria-hidden="true">{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="admin-sidebar__footer">
          <Link href="/" className="admin-sidebar__view-site" target="_blank">View Site ↗</Link>
          <button className="admin-sidebar__signout" onClick={handleSignOut}>Sign Out</button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <button className="admin-topbar__menu" onClick={() => setSidebarOpen(v => !v)} aria-label="Toggle sidebar">
            <span /><span /><span />
          </button>
          <span className="admin-topbar__title">
            {visibleNav.find(n => n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href))?.label ?? 'Admin'}
          </span>
          <Link href="/" className="admin-topbar__site-link" target="_blank">← View Site</Link>
        </header>
        <div className="admin-content">{children}</div>
      </div>

      {sidebarOpen && <div className="admin-sidebar__backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
    </div>
  )
}
