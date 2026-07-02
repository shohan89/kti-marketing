import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'
import CustomCursor from '@/components/ui/CustomCursor'
import ScrollRevealProvider from '@/components/ui/ScrollRevealProvider'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

function safeParse<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
}

function toWhatsAppUrl(phones: { number: string }[], socials: { platform: string; url: string }[]): string {
  const social = socials.find(s => s.platform === 'whatsapp')
  if (social?.url) {
    return social.url.startsWith('http') ? social.url : `https://wa.me/${social.url.replace(/[^\d]/g, '')}`
  }
  const digits = phones[0]?.number?.replace(/[^\d]/g, '') ?? ''
  return digits ? `https://wa.me/${digits}` : ''
}

async function getNavData() {
  try {
    const [services, jobCount, settings] = await Promise.all([
      prisma.service.findMany({
        where: { isPublished: true },
        select: { slug: true, title: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.jobListing.count({ where: { isPublished: true } }),
      prisma.siteSetting.findMany(),
    ])
    const map = Object.fromEntries(settings.map(r => [r.key, r.value]))
    const footerPhones = safeParse<{ id: string; label: string; number: string }[]>(map['contact_phones'], [{ id: '1', label: 'Main', number: '+880 170 000 0000' }])
    const socials = safeParse<{ id: string; platform: string; url: string }[]>(map['social_links'], [])
    return {
      services,
      isHiring: jobCount > 0,
      logoUrl:      map['site_logo_url']   ?? '',
      footerPhones,
      footerEmails: safeParse<{ id: string; label: string; address: string }[]>(map['contact_emails'], [{ id: '1', label: 'General', address: 'hello@ktimarketing.com' }]),
      footerAddress: map['contact_address'] ?? 'Dhaka, Bangladesh',
      mapEmbedUrl:  map['map_embed_url']   ?? '',
      whatsappUrl: toWhatsAppUrl(footerPhones, socials),
    }
  } catch {
    return {
      services: [
        { slug: 'social-media-management', title: 'Social Media Management' },
        { slug: 'content-creation', title: 'Content Creation' },
        { slug: 'ads-campaign-management', title: 'Ads Campaign Management' },
        { slug: 'copywriting', title: 'Copywriting' },
        { slug: 'product-photography', title: 'Product Photography' },
        { slug: 'model-photography', title: 'Model Photography' },
        { slug: 'video-production', title: 'Video Production' },
        { slug: 'influencer-marketing', title: 'Influencer Marketing' },
        { slug: 'website-maintenance', title: 'Website Maintenance' },
      ],
      isHiring: true,
      logoUrl: '',
      footerPhones: [{ id: '1', label: 'Main', number: '+880 170 000 0000' }],
      footerEmails: [{ id: '1', label: 'General', address: 'hello@ktimarketing.com' }],
      footerAddress: 'Dhaka, Bangladesh',
      mapEmbedUrl: '',
      whatsappUrl: 'https://wa.me/8801700000000',
    }
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { services, isHiring, logoUrl, footerPhones, footerEmails, footerAddress, mapEmbedUrl, whatsappUrl } = await getNavData()

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar services={services} logoUrl={logoUrl} />
      <ScrollRevealProvider>
        <main>{children}</main>
      </ScrollRevealProvider>
      <Footer
        isHiring={isHiring}
        phones={footerPhones}
        emails={footerEmails}
        address={footerAddress}
        mapEmbedUrl={mapEmbedUrl}
      />
      <WhatsAppButton url={whatsappUrl} />
    </>
  )
}
