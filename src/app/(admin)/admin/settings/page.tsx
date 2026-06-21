import type { Metadata } from 'next'
import SettingsClient from './SettingsClient'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Settings — KTI Admin' }

function safeParse<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

async function loadSettings() {
  let map: Record<string, string> = {}
  try {
    const rows = await prisma.siteSetting.findMany()
    map = Object.fromEntries(rows.map(r => [r.key, r.value]))
  } catch {}

  return {
    siteName:        map['site_name']            ?? 'KTI Marketing',
    tagline:         map['site_tagline']         ?? 'Bold Strategy. Real Revenue.',
    logoUrl:         map['site_logo_url']        ?? '',
    faviconUrl:      map['site_favicon_url']     ?? '',
    address:         map['contact_address']      ?? 'Dhaka, Bangladesh',
    businessHours:   map['business_hours']       ?? 'Sun – Thu: 9 AM – 6 PM',
    phones:          safeParse<{id:string;label:string;number:string}[]>(
                       map['contact_phones'],
                       [{ id: '1', label: 'Main', number: '+880 1234 567890' }]
                     ),
    emails:          safeParse<{id:string;label:string;address:string}[]>(
                       map['contact_emails'],
                       [{ id: '1', label: 'General', address: 'hello@ktimarketing.com' }]
                     ),
    socials:         safeParse<{id:string;platform:string;url:string}[]>(
                       map['social_links'],
                       [
                         { id: '1', platform: 'facebook',  url: 'https://facebook.com/ktimarketing' },
                         { id: '2', platform: 'instagram', url: 'https://instagram.com/ktimarketing' },
                         { id: '3', platform: 'linkedin',  url: 'https://linkedin.com/company/ktimarketing' },
                       ]
                     ),
    seoTitle:        map['seo_default_title']        ?? 'KTI Marketing — Bold Strategy. Real Revenue.',
    seoDescription:  map['seo_default_description']  ?? 'Full-service growth agency for ambitious brands.',
  }
}

export default async function SettingsPage() {
  const initial = await loadSettings()
  return <SettingsClient initial={initial} />
}
