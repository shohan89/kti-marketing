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
  socials?: { id: string; platform: string; url: string }[]
}

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'facebook':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    case 'linkedin':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    case 'twitter':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    case 'youtube':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="#ff0000"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 0 0-1.95 1.95A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon fill="#fff" points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"/></svg>
    case 'tiktok':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.29 6.29 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.76a8.18 8.18 0 0 0 4.78 1.52V6.82a4.85 4.85 0 0 1-1.01-.13z"/></svg>
    case 'whatsapp':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.527 5.853L0 24l6.326-1.511A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818A9.825 9.825 0 0 1 6.5 20.163l-.358-.213-3.759.897.943-3.645-.234-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
    case 'instagram':
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
    default:
      return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  }
}

export default function Footer({ isHiring, phones = [], emails = [], address = '', mapEmbedUrl = '', socials = [] }: FooterProps) {
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

              {socials.length > 0 && (
                <div className="footer-social">
                  {socials.map(s => (
                    <a key={s.id} href={s.url} target="_blank" rel="noopener noreferrer" className="footer-social__link" aria-label={s.platform}>
                      <SocialIcon platform={s.platform} />
                    </a>
                  ))}
                </div>
              )}
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
