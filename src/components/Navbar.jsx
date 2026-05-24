import { useState, useEffect, useRef } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import useTheme from '../hooks/useTheme'
import ThemeToggle from './ThemeToggle'
import { servicesData } from '../data/servicesData'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/',             label: 'Home',         end: true },
  { to: '/about',        label: 'About' },
  { to: '/services',     label: 'Services',     dropdown: true },
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/blog',         label: 'Blog' },
  { to: '/pricing',      label: 'Pricing' },
  { to: '/contact',      label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen]               = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [svcOpen, setSvcOpen]         = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(false)
  const preventOpenRef                = useRef(false)
  const { theme, toggle }             = useTheme()
  const { pathname }                  = useLocation()

  const close = () => {
    setOpen(false)
    setSvcOpen(false)
    setDesktopOpen(false)
    preventOpenRef.current = true
  }

  useEffect(() => { close() }, [pathname])

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

        <NavLink to="/" className="navbar-brand" onClick={close}>
          KTI <span>Marketing</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="navbar-nav" aria-label="Main navigation">
          <ul className="navbar-links">
            {NAV_LINKS.map(({ to, label, end, dropdown }) => (
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
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    ['nav-link', isActive ? 'active' : ''].filter(Boolean).join(' ')
                  }
                >
                  {label}
                  {dropdown && <span className="nav-dropdown-caret" aria-hidden="true">▾</span>}
                </NavLink>

                {dropdown && (
                  <div className="nav-dropdown" role="menu">
                    {servicesData.map(s => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        className="nav-dropdown-item"
                        role="menuitem"
                        onClick={close}
                      >
                        {s.title}
                      </Link>
                    ))}
                    <div className="nav-dropdown-divider" />
                    <Link
                      to="/services"
                      className="nav-dropdown-item nav-dropdown-item--all"
                      role="menuitem"
                      onClick={close}
                    >
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
          <Link to="/contact" className="btn btn-primary navbar-cta" onClick={close}>
            Get Started
          </Link>
        </div>

        {/* Hamburger button — mobile only */}
        <button
          className={`navbar-toggle${open ? ' navbar-toggle--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span /><span /><span />
        </button>

      </div>

      {/* Mobile drawer */}
      <div
        className={`navbar-mobile${open ? ' navbar-mobile--open' : ''}`}
        aria-hidden={!open}
      >
        <div className="navbar-mobile-inner">
          <ul className="navbar-mobile-links">
            {NAV_LINKS.map(({ to, label, end, dropdown }) =>
              dropdown ? (
                <li key={to}>
                  <button
                    className={`mobile-nav-link mobile-nav-group-toggle${isServicesActive ? ' active' : ''}`}
                    onClick={() => setSvcOpen(o => !o)}
                    aria-expanded={svcOpen}
                  >
                    {label}
                    <span className={`mobile-nav-caret${svcOpen ? ' mobile-nav-caret--open' : ''}`} aria-hidden="true">
                      ▾
                    </span>
                  </button>
                  <div className={`mobile-nav-sub${svcOpen ? ' mobile-nav-sub--open' : ''}`}>
                    <Link to="/services" className="mobile-nav-sub-link mobile-nav-sub-link--all" onClick={close}>
                      All Services
                    </Link>
                    {servicesData.map(s => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        className="mobile-nav-sub-link"
                        onClick={close}
                      >
                        {s.title}
                      </Link>
                    ))}
                  </div>
                </li>
              ) : (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      ['mobile-nav-link', isActive ? 'active' : ''].filter(Boolean).join(' ')
                    }
                    onClick={close}
                  >
                    {label}
                  </NavLink>
                </li>
              )
            )}
          </ul>
          <Link to="/contact" className="btn btn-primary mobile-cta" onClick={close}>
            Get Started
          </Link>
        </div>
      </div>

    </header>
  )
}
