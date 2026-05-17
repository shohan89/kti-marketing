import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import useTheme from '../hooks/useTheme'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

const NAV_LINKS = [
  { to: '/',         label: 'Home',     end: true },
  { to: '/about',    label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/contact',  label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = () => setOpen(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="navbar-inner">

        <NavLink to="/" className="navbar-brand" onClick={close}>
          KTI <span>Marketing</span>
        </NavLink>

        {/* Desktop nav */}
        <nav className="navbar-nav" aria-label="Main navigation">
          <ul className="navbar-links">
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    ['nav-link', isActive ? 'active' : ''].filter(Boolean).join(' ')
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link to="/contact" className="btn btn-primary navbar-cta" onClick={close}>
          Get Started
        </Link>

        <ThemeToggle theme={theme} onToggle={toggle} />

        {/* Hamburger button — mobile only */}
        <button
          className={`navbar-toggle${open ? ' navbar-toggle--open' : ''}`}
          onClick={() => setOpen(o => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

      </div>

      {/* Mobile drawer */}
      <div
        className={`navbar-mobile${open ? ' navbar-mobile--open' : ''}`}
        aria-hidden={!open}
      >
        <div className="navbar-mobile-inner">
          <ul className="navbar-mobile-links">
            {NAV_LINKS.map(({ to, label, end }) => (
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
            ))}
          </ul>
          <Link to="/contact" className="btn btn-primary mobile-cta" onClick={close}>
            Get Started
          </Link>
        </div>
      </div>

    </header>
  )
}
