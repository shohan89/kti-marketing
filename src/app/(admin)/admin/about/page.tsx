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

const DEFAULTS = {
  founderTags: DEFAULT_FOUNDER_TAGS,
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
      clients: safeJson(map['about_clients'], DEFAULTS.clients),
      achievements: safeJson(map['about_achievements'], DEFAULTS.achievements),
      clientsTitle: extra.clientsTitle ?? DEFAULTS.clientsTitle,
      achievementsTitle: extra.achievementsTitle ?? DEFAULTS.achievementsTitle,
    }
  } catch { /* use defaults */ }

  return <AboutEditorClient {...data} />
}
