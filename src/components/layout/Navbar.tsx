'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import useTheme from '@/hooks/useTheme'
import ThemeToggle from '@/components/ui/ThemeToggle'
import './Navbar.css'

interface ServiceLink { slug: string; title: string }

const NAV_LINKS = [
  { to: '/',             label: 'Home' },
  { to: '/about',        label: 'About' },
  { to: '/services',     label: 'Services', dropdown: true },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/blog',         label: 'Blog' },
  { to: '/careers',      label: 'Careers' },
  { to: '/themes',       label: 'Our Themes' },
  { to: '/pricing',      label: 'Pricing' },
  { to: '/contact',      label: 'Contact' },
]

export default function Navbar({ services }: { services: ServiceLink[] }) {
  const [open, setOpen]               = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [svcOpen, setSvcOpen]         = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(false)
  const preventOpenRef                = useRef(false)
  const { theme, toggle }             = useTheme()
  const pathname                      = usePathname()

  const close = () => {
    setOpen(false)
    setSvcOpen(false)
    setDesktopOpen(false)
    preventOpenRef.current = true
  }

  useEffect(() => {
    setOpen(false)
    setSvcOpen(false)
    setDesktopOpen(false)
    preventOpenRef.current = false
  }, [pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isServicesActive = pathname.startsWith('/services')

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar-inner">

        <Link href="/" className="navbar-brand" onClick={close}>
          KTI <span>Marketing</span>
        </Link>

        <nav className="navbar-nav" aria-label="Main navigation">
          <ul className="navbar-links">
            {NAV_LINKS.map(({ to, label, dropdown }) => (
              <li
                key={to}
                className={[
                  'nav-item',
                  dropdown ? 'nav-item--dropdown' : '',
                  dropdown && desktopOpen ? 'nav-item--open' : '',
                ].filter(Boolean).join(' ')}
                onMouseEnter={dropdown ? () => { if (!preventOpenRef.current) setDesktopOpen(true) } : undefined}
                onMouseLeave={dropdown ? () => { preventOpenRef.current = false; setDesktopOpen(false) } : undefined}
              >
                <Link
                  href={to}
                  className={[
                    'nav-link',
                    to === '/' ? pathname === '/' ? 'active' : '' : pathname.startsWith(to) ? 'active' : '',
                  ].filter(Boolean).join(' ')}
                >
                  {label}
                  {dropdown && <span className="nav-dropdown-caret" aria-hidden="true">▾</span>}
                </Link>

                {dropdown && (
                  <div className="nav-dropdown" role="menu">
                    {services.map(s => (
                      <Link key={s.slug} href={`/services/${s.slug}`} className="nav-dropdown-item" role="menuitem" onClick={close}>
                        {s.title}
                      </Link>
                    ))}
                    <div className="nav-dropdown-divider" />
                    <Link href="/services" className="nav-dropdown-item nav-dropdown-item--all" role="menuitem" onClick={close}>
                      View All Services →
                    </Link>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="navbar-actions">
          <ThemeToggle theme={theme} onToggle={toggle} />
          <Link href="/contact" className="btn btn-primary navbar-cta" onClick={close}>
            Get Started
          </Link>
        </div>

        <button
          className={`navbar-toggle${open ? ' navbar-toggle--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>

      </div>

      <div className={`navbar-mobile${open ? ' navbar-mobile--open' : ''}`} aria-hidden={!open}>
        <div className="navbar-mobile-inner">
          <ul className="navbar-mobile-links">
            {NAV_LINKS.map(({ to, label, dropdown }) =>
              dropdown ? (
                <li key={to}>
                  <button
                    className={`mobile-nav-link mobile-nav-group-toggle${isServicesActive ? ' active' : ''}`}
                    onClick={() => setSvcOpen(o => !o)}
                    aria-expanded={svcOpen}
                  >
                    {label}
                    <span className={`mobile-nav-caret${svcOpen ? ' mobile-nav-caret--open' : ''}`} aria-hidden="true">▾</span>
                  </button>
                  <div className={`mobile-nav-sub${svcOpen ? ' mobile-nav-sub--open' : ''}`}>
                    <Link href="/services" className="mobile-nav-sub-link mobile-nav-sub-link--all" onClick={close}>
                      All Services
                    </Link>
                    {services.map(s => (
                      <Link key={s.slug} href={`/services/${s.slug}`} className="mobile-nav-sub-link" onClick={close}>
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={to}>
                  <Link
                    href={to}
                    className={[
                      'mobile-nav-link',
                      to === '/' ? pathname === '/' ? 'active' : '' : pathname.startsWith(to) ? 'active' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={close}
                  >
                    {label}
                  </Link>
                </li>
              )
            )}
          </ul>
          <Link href="/contact" className="btn btn-primary mobile-cta" onClick={close}>
            Get Started
          </Link>
        </div>
      </div>
    </header>
  )
}
