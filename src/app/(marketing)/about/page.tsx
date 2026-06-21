import type { Metadata } from 'next'
import Link from 'next/link'
import PageCTA from '@/components/ui/PageCTA'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/prisma'
import './About.css'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('about')
  return buildMetadata(seo, { title: 'About KTI Marketing', description: 'A team of strategists, creatives, and performance marketers united by one obsession — making your brand the market leader it deserves to be.' })
}

const TEAM_GRADIENTS = [
  'linear-gradient(135deg, #D7262E 0%, #9B1C22 100%)',
  'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
  'linear-gradient(135deg, #0891B2 0%, #0E4F6B 100%)',
  'linear-gradient(135deg, #D97706 0%, #92400E 100%)',
  'linear-gradient(135deg, #059669 0%, #065F46 100%)',
  'linear-gradient(135deg, #DB2777 0%, #831843 100%)',
]

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const TEAM_STATIC = [
  { name: 'Tanvir Ahmed', role: 'Creative Director', initials: 'TA', imageUrl: null, gradient: 'linear-gradient(135deg, #D7262E 0%, #9B1C22 100%)', bio: 'Leads all creative output — from campaign concepts to final delivery — ensuring every piece is visually compelling and on-brand.', socialLinks: { linkedin: '#', instagram: '#' } },
  { name: 'Sadia Islam', role: 'Social Media Strategist', initials: 'SI', imageUrl: null, gradient: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)', bio: 'Builds and manages social presence across platforms, crafting content strategies that turn followers into loyal brand communities.', socialLinks: { linkedin: '#', instagram: '#' } },
  { name: 'Rafiqul Islam', role: 'Content & Copy Lead', initials: 'RI', imageUrl: null, gradient: 'linear-gradient(135deg, #0891B2 0%, #0E4F6B 100%)', bio: 'Crafts persuasive copy and editorial content that resonates with audiences, drives engagement, and supports every stage of the funnel.', socialLinks: { linkedin: '#', instagram: '#' } },
  { name: 'Nadia Rahman', role: 'Graphic Designer', initials: 'NR', imageUrl: null, gradient: 'linear-gradient(135deg, #D97706 0%, #92400E 100%)', bio: 'Translates brand identities into striking visuals — from social graphics and ads to packaging and brand guidelines.', socialLinks: { linkedin: '#', instagram: '#' } },
  { name: 'Shahriar Hossain', role: 'Video Editor', initials: 'SH', imageUrl: null, gradient: 'linear-gradient(135deg, #059669 0%, #065F46 100%)', bio: 'Edits and produces video content for ads, reels, and campaigns — bringing stories to life through motion, pacing, and sound.', socialLinks: { linkedin: '#', instagram: '#' } },
  { name: 'Rashida Khatun', role: 'Digital Ads Manager', initials: 'RK', imageUrl: null, gradient: 'linear-gradient(135deg, #DB2777 0%, #831843 100%)', bio: 'Plans and optimises paid campaigns across Meta, Google, and TikTok — maximising ROAS and scaling what works.', socialLinks: { linkedin: '#', instagram: '#' } },
]

function SocialIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'linkedin':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
    case 'instagram':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
    case 'facebook':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
    case 'twitter':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z"/></svg>
    case 'youtube':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.57 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>
    case 'tiktok':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.77 0 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 12.68 0V8.5a8.19 8.19 0 0 0 4.79 1.52V6.58a4.85 4.85 0 0 1-1.03.11Z"/></svg>
    case 'whatsapp':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.527 5.853L0 24l6.326-1.511A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818A9.825 9.825 0 0 1 6.5 20.163l-.358-.213-3.759.897.943-3.645-.234-.373A9.818 9.818 0 0 1 2.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z"/></svg>
    case 'behance':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.938 4.503c.702 0 1.34.06 1.92.188.577.13 1.07.33 1.485.61.41.28.733.65.96 1.12.225.47.34 1.05.34 1.73 0 .74-.17 1.36-.507 1.86-.337.5-.837.9-1.502 1.22.906.26 1.576.72 2.022 1.37.448.66.665 1.45.665 2.36 0 .75-.13 1.39-.41 1.93-.28.55-.67 1-1.16 1.35-.49.35-1.06.6-1.72.75-.65.15-1.33.23-2.04.23H0V4.503h6.938zm-.387 5.44c.59 0 1.077-.14 1.46-.42.384-.28.575-.73.575-1.36 0-.34-.06-.62-.18-.85-.12-.23-.29-.41-.5-.55-.21-.14-.46-.24-.73-.3-.28-.05-.57-.08-.87-.08H3.59v3.56h2.96zm.166 5.67c.33 0 .64-.03.93-.09.29-.06.54-.17.75-.31.21-.15.37-.35.49-.61.12-.25.18-.58.18-.96 0-.76-.21-1.29-.63-1.61-.42-.32-.97-.48-1.65-.48H3.59v4.06h3.127zm8.957-9.61h5.5v1.5h-5.5V6zm3.576 3.81c-.34-.37-.83-.56-1.46-.56-.41 0-.76.07-1.04.2-.28.14-.51.3-.69.52-.18.21-.31.44-.39.7-.08.26-.13.52-.14.78h4.56c-.06-.72-.49-1.27-.84-1.64zm.986 4.86c-.43.42-1.04.63-1.85.63-.57 0-1.06-.1-1.47-.31-.41-.2-.74-.47-1-.82-.26-.34-.44-.73-.55-1.16H11.3c.06 1.58.52 2.79 1.23 3.64.72.85 1.8 1.27 3.25 1.27.93 0 1.72-.22 2.38-.67.66-.45 1.1-1.13 1.34-2.05h-1.94c-.08.4-.32.73-.84 1.08z"/></svg>
    case 'dribbble':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm7.44 5.82a10.17 10.17 0 0 1 2.3 5.69c-.34-.06-3.71-.75-7.11-.33-.76-1.82-1.6-3.36-2.35-4.64a10.22 10.22 0 0 1 7.16-.72zm-9.44-.54c.75 1.27 1.57 2.81 2.35 4.59-2.94.88-5.9 1.21-8.23 1.21-.31 0-.6 0-.89-.01A10.02 10.02 0 0 1 10 5.28zM2.02 12.1l.12-.01c2.67 0 5.96-.38 9.15-1.41.19.38.37.76.54 1.14-3.28.93-6.14 3.32-7.54 5.55A9.98 9.98 0 0 1 2.02 12.1zM12 21.82a9.82 9.82 0 0 1-6.41-2.37c1.28-2.11 3.97-4.3 7.09-5.21 1.02 2.65 1.57 4.98 1.77 6.34-.79.16-1.6.24-2.45.24zm5.4-1.74c-.23-1.28-.73-3.43-1.66-5.99 3.1-.49 5.81.31 6.13.41a10.19 10.19 0 0 1-4.47 5.58z"/></svg>
    case 'github':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.54-1.38-1.33-1.75-1.33-1.75-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.23 1.84 1.23 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02.01 2.04.14 3 .4 2.28-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22v3.3c0 .32.21.7.83.58A12 12 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
    case 'pinterest':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
    case 'website':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
    case 'email':
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
    default:
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
  }
}

const VALUES = [
  { icon: '🎯', title: 'Results First', body: 'We measure success in revenue, not reach. Every strategy we build is engineered around your business objectives — and nothing else.' },
  { icon: '🔍', title: 'Radical Transparency', body: 'No smoke and mirrors. No vanity metrics. You will always know exactly what we are doing, why we are doing it, and how it is performing.' },
  { icon: '⚡', title: 'Obsessive Quality', body: 'We do not do average. Every campaign, every piece of content, every report reflects our absolute commitment to excellence.' },
  { icon: '🤝', title: 'True Partnership', body: 'Your wins are our wins. We show up as a genuine extension of your team — invested in your success just as much as you are.' },
]

const STATS = [
  { num: '120+', label: 'Brands Grown' }, { num: '8+', label: 'Years in Business' }, { num: '$40M+', label: 'Revenue Generated' },
  { num: '94%', label: 'Client Retention' }, { num: '3.2×', label: 'Average ROI' }, { num: '9', label: 'Core Services' },
]

type ClientItem = { name: string; logoUrl?: string; website?: string }
type AchievementItem = { year: string; title: string; description?: string }
type FounderTag = { label: string; url: string }

const DEFAULT_FOUNDER_TAGS: FounderTag[] = [
  { label: 'KIBAN SHOE', url: 'https://www.kibanshoe.com' },
  { label: 'KIBAN Trade International', url: 'https://www.kibanshoe.com' },
  { label: 'KTI – Marketing Agency', url: 'https://www.kti.com.bd' },
]

function safeJson<T>(str: string | undefined | null, fallback: T): T {
  if (!str) return fallback
  try { return JSON.parse(str) } catch { return fallback }
}

export default async function AboutPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let team: any[] = TEAM_STATIC
  let clients: ClientItem[] = []
  let achievements: AchievementItem[] = []
  let founderTags: FounderTag[] = DEFAULT_FOUNDER_TAGS
  let aboutExtra = { clientsTitle: "Brands We've Helped Grow", achievementsTitle: 'Our Milestones' }

  try {
    const rows = await prisma.teamMember.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } })
    if (rows.length > 0) {
      team = rows.map((m, i) => ({
        name: m.name,
        role: m.role,
        bio: m.bio ?? '',
        imageUrl: m.imageUrl ?? null,
        initials: getInitials(m.name),
        gradient: TEAM_GRADIENTS[i % TEAM_GRADIENTS.length],
        socialLinks: (m.socialLinks && typeof m.socialLinks === 'object' && !Array.isArray(m.socialLinks))
          ? m.socialLinks as Record<string, string>
          : {},
      }))
    }
  } catch { /* use static fallback */ }

  try {
    const settings = await prisma.siteSetting.findMany({ where: { key: { startsWith: 'about_' } } })
    const map = Object.fromEntries(settings.map(r => [r.key, r.value]))
    founderTags = safeJson<FounderTag[]>(map['about_founder_tags'], DEFAULT_FOUNDER_TAGS)
    clients = safeJson<ClientItem[]>(map['about_clients'], [])
    achievements = safeJson<AchievementItem[]>(map['about_achievements'], [])
    aboutExtra = { ...aboutExtra, ...safeJson(map['about_extra'], {}) }
  } catch { /* use defaults */ }

  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="container">
          <div className="about-hero__badge fade-up"><span className="about-hero__badge-dot" />Full-Service Marketing Agency · Since 2016</div>
          <p className="eyebrow fade-up-1">About KTI Marketing</p>
          <h1 className="about-hero__title fade-up-2">Built to Grow Brands.<br /><span className="accent">Obsessed With Results.</span></h1>
          <p className="about-hero__sub fade-up-2">A team of strategists, creatives, and performance marketers united by one obsession — making your brand the market leader it deserves to be.</p>
        </div>
      </section>

      <section className="about-founder">
        <div className="container">
          <div className="about-founder__grid">
            <div className="about-founder__photo reveal">
              <div className="about-founder__photo-frame">
                <img src="/founder.jpg" alt="Md Mehedi Hasan (Babla) — Founder & Chief" />
                <span className="about-founder__since-badge">Est. 2016</span>
              </div>
              <div className="about-founder__photo-bg" aria-hidden="true" />
            </div>
            <div className="about-founder__content reveal" style={{ '--reveal-delay': '0.12s' } as React.CSSProperties}>
              <span className="about-founder__badge">Founder &amp; Chief</span>
              <h2 className="about-founder__name">Md Mehedi Hasan<span className="about-founder__nick"> (Babla)</span></h2>
              <div className="about-founder__tags">
                {founderTags.filter(t => t.label).map((tag, i) => (
                  tag.url ? (
                    <a key={i} href={tag.url} className="about-founder__tag about-founder__tag--link" target="_blank" rel="noopener noreferrer">{tag.label} ↗</a>
                  ) : (
                    <span key={i} className="about-founder__tag">{tag.label}</span>
                  )
                ))}
              </div>
              <p>Md Mehedi Hasan (Babla) is a visionary entrepreneur and the founder of KIBAN Trade International and KIBAN SHOE. With a commitment to quality and integrity, he has built a strong reputation in the e-commerce and trading sectors of Bangladesh.</p>
              <p>Beyond manufacturing and trade, he leads KTI – Marketing Agency, specializing in innovative digital marketing and branding solutions. Based in Mirpur 10, Dhaka, Mehedi is dedicated to creating sustainable business growth and delivering excellence to his clients.</p>
              <blockquote className="about-founder__pullquote">"My goal has always been simple — help brands grow in ways that actually matter to their bottom line. Real revenue, not just reach."</blockquote>
              <div className="about-founder__connect">
                <h3 className="about-founder__connect-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.14 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z"/></svg>
                  Connect with Mehedi
                </h3>
                <div className="about-founder__connect-grid">
                  <div className="about-founder__connect-item"><span className="about-founder__connect-label">Email</span><a href="mailto:mehedihasan.babla@gmail.com" className="about-founder__connect-link">mehedihasan.babla@gmail.com</a></div>
                  <div className="about-founder__connect-item"><span className="about-founder__connect-label">Facebook</span><a href="https://facebook.com/ktibabla" target="_blank" rel="noopener noreferrer" className="about-founder__connect-link">facebook.com/ktibabla</a></div>
                  <div className="about-founder__connect-item"><span className="about-founder__connect-label">KIBAN Shoe</span><a href="https://www.kibanshoe.com" target="_blank" rel="noopener noreferrer" className="about-founder__connect-link">www.kibanshoe.com</a></div>
                  <div className="about-founder__connect-item"><span className="about-founder__connect-label">KTI Agency</span><a href="https://www.kti.com.bd" target="_blank" rel="noopener noreferrer" className="about-founder__connect-link">www.kti.com.bd</a></div>
                  <div className="about-founder__connect-item about-founder__connect-item--full"><span className="about-founder__connect-label">Office Address</span><span className="about-founder__connect-address">Suite 1005, 10th Floor (Lift-9), Shah Ali Plaza, Mirpur 10, Dhaka.</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-stats">
        <div className="container">
          <div className="about-stats__grid">
            {STATS.map(({ num, label }, i) => (
              <div className="about-stat reveal-scale" key={label} style={{ '--reveal-delay': `${i * 0.07}s` } as React.CSSProperties}>
                <span className="about-stat__num">{num}</span>
                <span className="about-stat__label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {clients.length > 0 && (
        <section className="about-clients">
          <div className="container">
            <div className="about-clients__header text-center reveal">
              <p className="eyebrow">Our Clients</p>
              <h2>{aboutExtra.clientsTitle}</h2>
            </div>
            <div className="about-clients__grid">
              {clients.map((client, i) => (
                <div className="about-client-card reveal" key={i} style={{ '--reveal-delay': `${Math.min(i * 0.07, 0.4)}s` } as React.CSSProperties}>
                  {client.logoUrl ? (
                    <img src={client.logoUrl} alt={client.name} className="about-client-card__logo" />
                  ) : (
                    <span className="about-client-card__initials">{client.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase()}</span>
                  )}
                  <span className="about-client-card__name">{client.name}</span>
                  {client.website && (
                    <a href={client.website} className="about-client-card__link" target="_blank" rel="noopener noreferrer">Visit ↗</a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {achievements.length > 0 && (
        <section className="about-achievements">
          <div className="container">
            <div className="about-achievements__header text-center reveal">
              <p className="eyebrow">Milestones</p>
              <h2>{aboutExtra.achievementsTitle}</h2>
            </div>
            <div className="about-achievements__timeline">
              {achievements.map((item, i) => (
                <div className="about-achievement reveal" key={i} style={{ '--reveal-delay': `${Math.min(i * 0.1, 0.4)}s` } as React.CSSProperties}>
                  <div className="about-achievement__year">{item.year}</div>
                  <div className="about-achievement__dot" aria-hidden="true" />
                  <div className="about-achievement__content">
                    <h3 className="about-achievement__title">{item.title}</h3>
                    {item.description && <p className="about-achievement__desc">{item.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="about-mission">
        <div className="container">
          <div className="about-mission__inner reveal">
            <p className="eyebrow">Our Mission</p>
            <blockquote className="about-mission__quote">"We exist to help ambitious brands grow. Not just in followers or impressions, but in the metrics that actually matter: qualified leads, conversions, revenue, and market share. Since 2016, we have helped over 120 businesses transform their marketing from a cost centre into their most powerful competitive advantage."</blockquote>
            <cite className="about-mission__cite">— The KTI Marketing Team</cite>
          </div>
        </div>
      </section>

      <section className="about-story">
        <div className="container">
          <div className="about-story__grid">
            <div className="about-story__left reveal">
              <p className="eyebrow">Our Story</p>
              <h2>From a Small Studio to <span className="accent">a Full-Scale Agency</span></h2>
            </div>
            <div className="about-story__right reveal" style={{ '--reveal-delay': '0.15s' } as React.CSSProperties}>
              <span className="about-story__milestone">2016 — Founded</span>
              <p>KTI Marketing started in 2016 with a simple belief: that great marketing should be accessible to every ambitious business. We began as a small creative studio with three people and a shared passion for brand storytelling.</p>
              <span className="about-story__milestone">2019 — Full-Service Expansion</span>
              <p>Over the years, we expanded into performance advertising, social media management, influencer marketing, and production — building a full-service capability that covers every stage of your customer journey.</p>
              <span className="about-story__milestone">Today — 25+ Specialists</span>
              <p>But what has never changed is our core obsession: delivering results that genuinely move the needle for the brands we work with. We do not just run campaigns. We build growth engines.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="container">
          <div className="about-team__header text-center reveal">
            <p className="eyebrow">The People Behind the Work</p>
            <h2>Meet Our <span className="accent">Creative Team</span></h2>
            <p className="about-team__sub">Strategists, designers, writers, and producers — each specialist is hand-picked for their craft and their shared obsession with results.</p>
          </div>
          <div className="about-team__grid">
            {team.map(({ name, role, initials, gradient, bio, imageUrl, socialLinks }, i) => (
              <div className="team-card reveal" key={name} style={{ '--reveal-delay': `${i * 0.08}s` } as React.CSSProperties}>
                <div className="team-card__avatar" style={{ background: imageUrl ? undefined : gradient }}>
                  {imageUrl
                    ? <img src={imageUrl} alt={name} className="team-card__avatar-img" />
                    : initials
                  }
                </div>
                <div className="team-card__body">
                  <h3 className="team-card__name">{name}</h3>
                  <span className="team-card__role">{role}</span>
                  <p className="team-card__bio">{bio}</p>
                  {Object.keys(socialLinks ?? {}).length > 0 && (
                    <div className="team-card__socials">
                      {Object.entries(socialLinks ?? {}).filter(([, url]) => url).map(([key, url]) => (
                        <a
                          key={key}
                          href={key === 'email' && !(url as string).startsWith('mailto:') ? `mailto:${url}` : url as string}
                          className="team-card__social-link"
                          target={key === 'email' ? undefined : '_blank'}
                          rel={key === 'email' ? undefined : 'noopener noreferrer'}
                          aria-label={`${name} — ${key}`}
                        >
                          <SocialIcon platform={key} />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-values">
        <div className="container">
          <div className="about-values__header text-center reveal">
            <p className="eyebrow">What We Stand For</p>
            <h2>The Values That Drive <span className="accent">Everything We Do</span></h2>
          </div>
          <div className="about-values__grid">
            {VALUES.map(({ icon, title, body }, i) => (
              <div className="value-card reveal" key={title} style={{ '--reveal-delay': `${i * 0.1}s` } as React.CSSProperties}>
                <div className="value-card__icon-wrap" aria-hidden="true">{icon}</div>
                <h3 className="value-card__title">{title}</h3>
                <p className="value-card__body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PageCTA
        eyebrow="Ready to Grow?"
        title={<>Join the brands growing<br />with KTI Marketing.</>}
        sub="Let's build a strategy that turns your marketing into your strongest competitive advantage."
        primaryLabel="Start Your Project →"
        primaryTo="/contact"
        secondaryLabel="Explore Services"
        secondaryTo="/services"
      />
    </main>
  )
}
