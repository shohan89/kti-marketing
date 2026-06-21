import Link from 'next/link'
import './Footer.css'

const SERVICES_LINKS = [
  { to: '/services/social-media-management',  label: 'Social Media Management' },
  { to: '/services/content-creation',         label: 'Content Creation' },
  { to: '/services/ads-campaign-management',  label: 'Ads Campaign Management' },
  { to: '/services/video-production',         label: 'Video Production' },
  { to: '/services/influencer-marketing',     label: 'Influencer Marketing' },
]

const COMPANY_LINKS = [
  { to: '/',         label: 'Home' },
  { to: '/about',    label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/careers',  label: 'Careers' },
  { to: '/contact',  label: 'Contact' },
]

interface FooterProps {
  isHiring: boolean
  phones?: { id: string; label: string; number: string }[]
  emails?: { id: string; label: string; address: string }[]
  address?: string
  mapEmbedUrl?: string
}

export default function Footer({ isHiring, phones = [], emails = [], address = '', mapEmbedUrl = '' }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">

            {/* Column 1 — Brand + contact info */}
            <div className="footer-brand">
              <Link href="/" className="footer-logo">KTI <span>Marketing</span></Link>
              <p className="footer-tagline">
                A results-obsessed, full-service marketing agency building brands that dominate their markets.
              </p>

              {/* Email rows */}
              {emails.map(em => (
                <div key={em.id} className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <a href={`mailto:${em.address}`} className="footer-contact-link">{em.address}</a>
                </div>
              ))}

              {/* Phone rows */}
              {phones.map(ph => (
                <div key={ph.id} className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.45 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </span>
                  <a href={`tel:${ph.number.replace(/\s/g, '')}`} className="footer-contact-link">{ph.number}</a>
                </div>
              ))}

              {/* Address */}
              {address && (
                <div className="footer-contact-item">
                  <span className="footer-contact-icon" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </span>
                  <span className="footer-contact-text">{address}</span>
                </div>
              )}

              <div className="footer-social">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social__link" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social__link" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social__link" aria-label="Twitter / X">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Column 2 — Company */}
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                {COMPANY_LINKS.map(({ to, label }) => (
                  <li key={to} className={label === 'Careers' && isHiring ? 'footer-nav-item--has-badge' : undefined}>
                    <Link href={to}>{label}</Link>
                    {label === 'Careers' && isHiring && <span className="footer-hiring-badge">Hiring</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Services */}
            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                {SERVICES_LINKS.map(({ to, label }) => (
                  <li key={to}><Link href={to}>{label}</Link></li>
                ))}
              </ul>
              <Link href="/services" className="footer-see-all-btn">See All Services →</Link>
            </div>

            {/* Column 4 — Map */}
            <div className="footer-col footer-map-col">
              <h4>Find Us</h4>
              {mapEmbedUrl ? (
                <div className="footer-map">
                  <iframe
                    src={mapEmbedUrl}
                    title="Office location"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="footer-map footer-map--placeholder">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Add a map in Settings → Contact</span>
                </div>
              )}
              <Link href="/contact" className="footer-cta-btn">Start a Project →</Link>
            </div>

          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>© {new Date().getFullYear()} KTI Marketing. All rights reserved.</p>
          <p className="footer-bottom__right">Built for ambitious brands.</p>
        </div>
      </div>
    </footer>
  )
}
