import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import HomepageEditorClient from './HomepageEditorClient'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Homepage — KTI Admin' }

function safeJson<T>(str: string | undefined, fallback: T): T {
  if (!str) return fallback
  try { return JSON.parse(str) } catch { return fallback }
}

const DEFAULTS = {
  hero: {
    badge: 'Full-Service Growth Agency',
    headline: 'Bold Strategy.\nReal Revenue.\nZero Compromises.',
    subheadline: 'We build performance campaigns and bold creative for ambitious brands ready to stop blending in — and start owning their market.',
    cta1Text: 'Start Growing',
    cta1Url: '/contact',
    cta2Text: 'Book a Strategy Call',
    cta2Url: '/contact',
  },
  stats: [
    { num: '120+', label: 'Brands Grown' },
    { num: '3.2×', label: 'Average ROI' },
    { num: '$40M+', label: 'Revenue Generated' },
    { num: '94%', label: 'Client Retention' },
  ],
  brands: [
    { name: 'Luxe Apparel Co.', logoUrl: '' },
    { name: 'TechFlow Inc.', logoUrl: '' },
    { name: 'Wellness Hub', logoUrl: '' },
    { name: 'Nova Skincare', logoUrl: '' },
    { name: 'Urban Eats', logoUrl: '' },
    { name: 'PeakPro Fitness', logoUrl: '' },
    { name: 'Elevate Realty', logoUrl: '' },
    { name: 'Bloom Cosmetics', logoUrl: '' },
  ],
  marquee: ['Social Media Management', 'Content Creation', 'Ads Campaign Management', 'Copywriting', 'Product Photography', 'Model Photography', 'Video Production', 'Influencer Marketing', 'Website Maintenance'],
  services: { eyebrow: 'What We Do', title: 'Every Service You Need. All Under One Roof.', subtitle: 'From brand strategy to performance ads, content creation to influencer marketing — we own every channel of your growth.' },
  why: {
    eyebrow: 'Why KTI Marketing',
    title: "We Don't Chase Metrics. We Chase Revenue.",
    body: 'Most agencies show you follower counts and impression graphs. We show you pipeline growth, conversion rates, and ROI.',
    pillars: [
      { icon: '📈', title: 'Results, Not Excuses', body: 'Every engagement has clear KPIs from day one. We report on revenue, ROAS, leads, and conversions — not vanity metrics like impressions and reach.' },
      { icon: '🎨', title: 'Bold Creative Thinking', body: 'Great creative is your biggest competitive advantage. Our in-house team builds campaigns that stop the scroll and demand attention.' },
      { icon: '🧠', title: 'Strategy Comes First', body: 'We never jump straight to execution. Every client gets a custom go-to-market plan grounded in audience research and competitive intelligence.' },
      { icon: '🤝', title: 'Relentless Support', body: 'A dedicated account team, weekly updates, and a direct line to the people doing the work — no middlemen passing messages.' },
    ],
  },
  video: { eyebrow: 'See Our Work', title: 'Campaigns That Move People.' },
  portfolio: { eyebrow: 'Case Studies', title: 'Results That Speak for Themselves.', subtitle: "We don't believe in case studies that only show the highlights. Here are real campaigns with real numbers from real clients." },
  process: {
    eyebrow: 'How We Work',
    title: 'A Proven 3-Step Growth System',
    steps: [
      { num: '01', title: 'Strategy', body: 'We audit your brand, analyze competitors, and build a tailored go-to-market plan with clear KPIs, channel priorities, and creative direction.' },
      { num: '02', title: 'Execution', body: 'Our team launches campaigns across every relevant channel — moving fast, testing constantly, and iterating relentlessly to maximize performance.' },
      { num: '03', title: 'Growth', body: "We double down on what works, eliminate what doesn't, and scale your most profitable channels to deliver compounding returns month over month." },
    ],
  },
  testimonials: { eyebrow: 'Client Results', title: "Don't Take Our Word for It." },
  blog: { eyebrow: 'From the Blog', title: 'Ideas That Drive Growth' },
  cta: {
    eyebrow: 'Ready to Grow?',
    title: 'Stop Leaving Revenue\non the Table.',
    body: "Let's build a custom growth strategy that turns your marketing into your most powerful competitive advantage. No fluff. No vanity metrics. Just results.",
    btnText: 'Get a Free Strategy Call →',
    btnUrl: '/contact',
    subtext: 'No commitment required · Strategy session is 100% free',
  },
}

export default async function HomepageAdminPage() {
  let data = { ...DEFAULTS }

  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { startsWith: 'homepage_' } } })
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))

    data = {
      hero:         safeJson(map['homepage_hero'],         DEFAULTS.hero),
      stats:        safeJson(map['homepage_stats'],        DEFAULTS.stats),
      brands:       (() => {
        const raw = safeJson<unknown[]>(map['homepage_brands'], DEFAULTS.brands)
        return Array.isArray(raw)
          ? raw.map((b) => typeof b === 'string' ? { name: b, logoUrl: '' } : b as { name: string; logoUrl: string })
          : DEFAULTS.brands
      })(),
      marquee:      safeJson(map['homepage_marquee'],      DEFAULTS.marquee),
      services:     safeJson(map['homepage_services'],     DEFAULTS.services),
      why:          safeJson(map['homepage_why'],          DEFAULTS.why),
      video:        safeJson(map['homepage_video'],        DEFAULTS.video),
      portfolio:    safeJson(map['homepage_portfolio'],    DEFAULTS.portfolio),
      process:      safeJson(map['homepage_process'],      DEFAULTS.process),
      testimonials: safeJson(map['homepage_testimonials'], DEFAULTS.testimonials),
      blog:         safeJson(map['homepage_blog'],         DEFAULTS.blog),
      cta:          safeJson(map['homepage_cta'],          DEFAULTS.cta),
    }
  } catch {
    // Use defaults
  }

  return <HomepageEditorClient data={data} />
}
