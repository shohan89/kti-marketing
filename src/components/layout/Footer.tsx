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

export default function Footer({ isHiring }: { isHiring: boolean }) {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">

            <div className="footer-brand">
              <Link href="/" className="footer-logo">KTI <span>Marketing</span></Link>
              <p className="footer-tagline">
                A results-obsessed, full-service marketing agency building brands that dominate their markets.
              </p>
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

            <div className="footer-col">
              <h4>Services</h4>
              <ul>
                {SERVICES_LINKS.map(({ to, label }) => (
                  <li key={to}><Link href={to}>{label}</Link></li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4>Get in Touch</h4>
              <ul className="footer-contact-list">
                <li><a href="mailto:hello@ktimarketing.com">hello@ktimarketing.com</a></li>
                <li><a href="tel:+8801700000000">+880 170 000 0000</a></li>
                <li className="footer-address">Dhaka, Bangladesh</li>
              </ul>
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
