import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import './Contact.css'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('contact')
  return buildMetadata(seo, { title: 'Contact Us', description: 'Start your marketing growth journey with KTI Marketing. Get in touch — we respond within one business day.' })
}

const CONTACT_INFO = [
  { icon: '✉️', label: 'Email Us',   value: 'hello@ktimarketing.com', href: 'mailto:hello@ktimarketing.com' },
  { icon: '📞', label: 'Call Us',    value: '+880 170 000 0000',      href: 'tel:+8801700000000' },
  { icon: '📍', label: 'Our Office', value: 'Dhaka, Bangladesh',       href: null },
  { icon: '💬', label: 'Instagram',  value: '@ktimarketing',           href: 'https://instagram.com/ktimarketing' },
]

export default function ContactPage() {
  return (
    <div className="contact-page">

      <section className="contact-hero">
        <div className="container">
          <p className="eyebrow fade-up">Let&apos;s Work Together</p>
          <h1 className="contact-hero__title fade-up-1">
            Start Your <span className="accent">Growth Journey</span>
          </h1>
          <p className="contact-hero__sub fade-up-2">
            Tell us about your brand and goals. We will review your project and
            get back to you within one business day with a tailored plan.
          </p>
        </div>
      </section>

      <section className="contact-body">
        <div className="container">
          <div className="contact-grid">

            <div className="contact-form-wrap reveal">
              <ContactForm />
            </div>

            <div className="contact-info reveal" style={{ '--reveal-delay': '0.15s' } as React.CSSProperties}>
              <div className="contact-info__card">
                <h3>We typically respond within <span className="accent">24 hours</span></h3>
                <p>Not a fan of forms? Drop us a direct email or give us a call — we are always happy to chat about your brand and goals.</p>

                <ul className="contact-info__list">
                  {CONTACT_INFO.map(({ icon, label, value, href }) => (
                    <li key={label} className="contact-info__item">
                      <span className="contact-info__icon" aria-hidden="true">{icon}</span>
                      <div>
                        <span className="contact-info__label">{label}</span>
                        {href ? (
                          <a href={href} className="contact-info__value" {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                            {value}
                          </a>
                        ) : (
                          <span className="contact-info__value">{value}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="contact-info__promise">
                  <span className="contact-info__promise-icon">🔒</span>
                  <p>Your information is 100% confidential. We never share client data with third parties.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
