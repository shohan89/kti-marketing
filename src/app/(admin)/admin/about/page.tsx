import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import AboutEditorClient from './AboutEditorClient'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'About Page — KTI Admin' }

function safeJson<T>(str: string | undefined | null, fallback: T): T {
  if (!str) return fallback
  try { return JSON.parse(str) } catch { return fallback }
}

const DEFAULT_FOUNDER_TAGS = [
  { label: 'KIBAN SHOE', url: 'https://www.kibanshoe.com' },
  { label: 'KIBAN Trade International', url: 'https://www.kibanshoe.com' },
  { label: 'KTI – Marketing Agency', url: 'https://www.kti.com.bd' },
]

const DEFAULT_FOUNDER = {
  photoUrl: '/founder.jpg',
  badge: 'Founder & Chief',
  sinceBadge: 'Est. 2016',
  name: 'Md Mehedi Hasan',
  nickname: '(Babla)',
  bio: 'Md Mehedi Hasan (Babla) is a visionary entrepreneur and the founder of KIBAN Trade International and KIBAN SHOE. With a commitment to quality and integrity, he has built a strong reputation in the e-commerce and trading sectors of Bangladesh.\n\nBeyond manufacturing and trade, he leads KTI – Marketing Agency, specializing in innovative digital marketing and branding solutions. Based in Mirpur 10, Dhaka, Mehedi is dedicated to creating sustainable business growth and delivering excellence to his clients.',
  pullquote: 'My goal has always been simple — help brands grow in ways that actually matter to their bottom line. Real revenue, not just reach.',
  email: 'mehedihasan.babla@gmail.com',
  facebookUrl: 'https://facebook.com/ktibabla',
  kibanShoeUrl: 'https://www.kibanshoe.com',
  ktiAgencyUrl: 'https://www.kti.com.bd',
  officeAddress: 'Suite 1005, 10th Floor (Lift-9), Shah Ali Plaza, Mirpur 10, Dhaka.',
}

const DEFAULTS = {
  founderTags: DEFAULT_FOUNDER_TAGS,
  founder: DEFAULT_FOUNDER,
  clients: [] as { name: string; logoUrl: string; website: string }[],
  achievements: [] as { year: string; title: string; description: string }[],
  clientsTitle: "Brands We've Helped Grow",
  achievementsTitle: 'Our Milestones',
}

export default async function AboutAdminPage() {
  let data = { ...DEFAULTS }
  try {
    const rows = await prisma.siteSetting.findMany({ where: { key: { startsWith: 'about_' } } })
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
    const extra = safeJson<{ clientsTitle?: string; achievementsTitle?: string }>(map['about_extra'], {})
    data = {
      founderTags: safeJson(map['about_founder_tags'], DEFAULTS.founderTags),
      founder: { ...DEFAULT_FOUNDER, ...safeJson(map['about_founder'], DEFAULT_FOUNDER) },
      clients: safeJson(map['about_clients'], DEFAULTS.clients),
      achievements: safeJson(map['about_achievements'], DEFAULTS.achievements),
      clientsTitle: extra.clientsTitle ?? DEFAULTS.clientsTitle,
      achievementsTitle: extra.achievementsTitle ?? DEFAULTS.achievementsTitle,
    }
  } catch { /* use defaults */ }

  return <AboutEditorClient {...data} />
}
