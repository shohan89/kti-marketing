import { prisma } from '@/lib/prisma'

function safeParse<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

/** Resolve the site's WhatsApp contact link from dashboard Settings — prefers an
 *  explicit WhatsApp social link, falls back to the main contact phone number. */
export async function getWhatsAppUrl(): Promise<string> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ['contact_phones', 'social_links'] } },
    })
    const map = Object.fromEntries(settings.map(r => [r.key, r.value]))
    const phones = safeParse<{ number: string }[]>(map['contact_phones'], [])
    const socials = safeParse<{ platform: string; url: string }[]>(map['social_links'], [])
    const social = socials.find(s => s.platform === 'whatsapp')
    if (social?.url) {
      return social.url.startsWith('http') ? social.url : `https://wa.me/${social.url.replace(/[^\d]/g, '')}`
    }
    const digits = phones[0]?.number?.replace(/[^\d]/g, '') ?? ''
    return digits ? `https://wa.me/${digits}` : ''
  } catch {
    return ''
  }
}
