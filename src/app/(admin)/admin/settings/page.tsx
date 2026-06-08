import type { Metadata } from 'next'
import SettingsClient from './SettingsClient'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = { title: 'Settings — KTI Admin' }

const DEFAULT_SETTINGS = [
  { key: 'contact_email', value: 'hello@ktimarketing.com', label: 'Contact Email', group: 'Contact' },
  { key: 'contact_phone', value: '+880 1234 567890', label: 'Phone Number', group: 'Contact' },
  { key: 'contact_address', value: 'Dhaka, Bangladesh', label: 'Address', group: 'Contact' },
  { key: 'social_facebook', value: 'https://facebook.com/ktimarketing', label: 'Facebook URL', group: 'Social' },
  { key: 'social_instagram', value: 'https://instagram.com/ktimarketing', label: 'Instagram URL', group: 'Social' },
  { key: 'social_linkedin', value: 'https://linkedin.com/company/ktimarketing', label: 'LinkedIn URL', group: 'Social' },
  { key: 'seo_default_title', value: 'KTI Marketing — Bold Strategy. Real Revenue.', label: 'Default SEO Title', group: 'SEO' },
  { key: 'seo_default_description', value: 'Full-service growth agency for ambitious brands.', label: 'Default SEO Description', group: 'SEO' },
]

async function getSettings() {
  try {
    const rows = await prisma.siteSetting.findMany()
    const map = Object.fromEntries(rows.map(r => [r.key, r.value]))
    return DEFAULT_SETTINGS.map(d => ({ ...d, value: map[d.key] ?? d.value }))
  } catch {
    return DEFAULT_SETTINGS
  }
}

export default async function SettingsPage() {
  const settings = await getSettings()
  const groups = [...new Set(settings.map(s => s.group))]
  return <SettingsClient settings={settings} groups={groups} />
}
