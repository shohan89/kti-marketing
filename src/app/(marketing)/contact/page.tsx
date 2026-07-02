import type { Metadata } from 'next'
import ContactForm from './ContactForm'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import './Contact.css'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('contact')
  return buildMetadata(seo, { title: 'Contact Us', description: 'Start your marketing growth journey with KTI Marketing. Get in touch — we respond within one business day.' })
}

function safeParse<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

const SOCIAL_ICONS: Record<string, string> = {
  facebook: '📘', instagram: '💬', linkedin: '💼', twitter: '🐦', youtube: '▶️',
  tiktok: '🎵', whatsapp: '💬', telegram: '✈️', pinterest: '📌', snapchat: '👻',
}
const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook', instagram: 'Instagram', linkedin: 'LinkedIn', twitter: 'Twitter / X',
  youtube: 'YouTube', tiktok: 'TikTok', whatsapp: 'WhatsApp', telegram: 'Telegram',
  pinterest: 'Pinterest', snapchat: 'Snapchat',
}

const DEFAULTS = {
  email: 'hello@ktimarketing.com',
  phone: '+880 170 000 0000',
  address: 'Dhaka, Bangladesh',
  social: { platform: 'instagram', url: 'https://instagram.com/ktimarketing' } as { platform: string; url: string } | null,
}

async function getContactInfo() {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ['contact_emails', 'contact_phones', 'contact_address', 'social_links'] } },
    })
    const map = Object.fromEntries(settings.map(r => [r.key, r.value]))
    const emails = safeParse<{ address: string }[]>(map['contact_emails'], [])
    const phones = safeParse<{ number: string }[]>(map['contact_phones'], [])
    const socials = safeParse<{ platform: string; url: string }[]>(map['social_links'], [])
    const social = socials.find(s => s.platform === 'instagram') ?? socials[0] ?? null

    return {
      email: emails[0]?.address || DEFAULTS.email,
      phone: phones[0]?.number || DEFAULTS.phone,
      address: map['contact_address'] || DEFAULTS.address,
      social: social ?? DEFAULTS.social,
    }
  } catch {
    return DEFAULTS
  }
}

export default async function ContactPage() {
  const { email, phone, address, social } = await getContactInfo()
  const CONTACT_INFO = [
    { icon: '✉️', label: 'Email Us',   value: email,  href: `mailto:${email}` },
    { icon: '📞', label: 'Call Us',    value: phone,  href: `tel:${phone.replace(/\s/g, '')}` },
    { icon: '📍', label: 'Our Office', value: address, href: null as string | null },
    ...(social ? [{ icon: SOCIAL_ICONS[social.platform] ?? '💬', label: SOCIAL_LABELS[social.platform] ?? social.platform, value: social.url.replace(/^https?:\/\//, ''), href: social.url as string | null }] : []),
  ]

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
