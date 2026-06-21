'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import './admin.css'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: '◈' },
  { href: '/admin/media', label: 'Media Library', icon: '⊞' },
  { href: '/admin/homepage', label: 'Homepage', icon: '⌂' },
  { href: '/admin/about', label: 'About Page', icon: '◈' },
  { href: '/admin/services', label: 'Services', icon: '⚙' },
  { href: '/admin/blog', label: 'Blog', icon: '✎' },
  { href: '/admin/portfolio', label: 'Portfolio', icon: '◉' },
  { href: '/admin/pricing', label: 'Pricing', icon: '৳' },
  { href: '/admin/jobs', label: 'Jobs', icon: '◎' },
  { href: '/admin/team', label: 'Team', icon: '◉' },
  { href: '/admin/testimonials', label: 'Testimonials', icon: '❝' },
  { href: '/admin/inbox', label: 'Inbox', icon: '✉' },
  { href: '/admin/applications', label: 'Applications', icon: '📋' },
  { href: '/admin/seo', label: 'SEO Manager', icon: '◎' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (pathname === '/admin/login') return <>{children}</>

  async function handleSignOut() {
    try {
      const { createSupabaseBrowserClient } = await import('@/lib/supabase-client')
      const supabase = createSupabaseBrowserClient()
      await supabase.auth.signOut()
    } catch {}
    router.push('/admin/login')
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${sidebarOpen ? ' admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <Link href="/admin" className="admin-sidebar__logo">KTI<span className="admin-sidebar__logo-dot">.</span></Link>
          <span className="admin-sidebar__badge">Admin</span>
        </div>
        <nav className="admin-nav" aria-label="Admin navigation">
          {NAV.map(({ href, label, icon }) => {
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
            {NAV.find(n => n.href === '/admin' ? pathname === '/admin' : pathname.startsWith(n.href))?.label ?? 'Admin'}
          </span>
          <Link href="/" className="admin-topbar__site-link" target="_blank">← View Site</Link>
        </header>
        <div className="admin-content">{children}</div>
      </div>

      {sidebarOpen && <div className="admin-sidebar__backdrop" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
    </div>
  )
}
