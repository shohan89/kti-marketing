import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'
import CustomCursor from '@/components/ui/CustomCursor'
import ScrollRevealProvider from '@/components/ui/ScrollRevealProvider'

function safeParse<T>(val: string | undefined, fallback: T): T {
  if (!val) return fallback
  try { return JSON.parse(val) as T } catch { return fallback }
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
    return {
      services,
      isHiring: jobCount > 0,
      footerPhones: safeParse<{ id: string; label: string; number: string }[]>(map['contact_phones'], [{ id: '1', label: 'Main', number: '+880 170 000 0000' }]),
      footerEmails: safeParse<{ id: string; label: string; address: string }[]>(map['contact_emails'], [{ id: '1', label: 'General', address: 'hello@ktimarketing.com' }]),
      footerAddress: map['contact_address'] ?? 'Dhaka, Bangladesh',
      mapEmbedUrl:  map['map_embed_url']   ?? '',
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
      footerPhones: [{ id: '1', label: 'Main', number: '+880 170 000 0000' }],
      footerEmails: [{ id: '1', label: 'General', address: 'hello@ktimarketing.com' }],
      footerAddress: 'Dhaka, Bangladesh',
      mapEmbedUrl: '',
    }
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { services, isHiring, footerPhones, footerEmails, footerAddress, mapEmbedUrl } = await getNavData()

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar services={services} />
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
    </>
  )
}
