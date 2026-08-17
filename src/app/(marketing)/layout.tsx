import Script from 'next/script'
import { prisma } from '@/lib/prisma'
import { sanitizeTrackingId } from '@/lib/sanitize'
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
      socials,
      whatsappUrl: toWhatsAppUrl(footerPhones, socials),
      gtmId:       sanitizeTrackingId(map['integrations_gtm_id']),
      ga4Id:       sanitizeTrackingId(map['integrations_ga4_id']),
      metaPixelId: sanitizeTrackingId(map['integrations_meta_pixel_id']),
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
      socials: [] as { id: string; platform: string; url: string }[],
      whatsappUrl: 'https://wa.me/8801700000000',
      gtmId: '', ga4Id: '', metaPixelId: '',
    }
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { services, isHiring, logoUrl, footerPhones, footerEmails, footerAddress, mapEmbedUrl, socials, whatsappUrl, gtmId, ga4Id, metaPixelId } = await getNavData()

  return (
    <>
      {gtmId && (
        <>
          <Script id="gtm-loader" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        </>
      )}
      {ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${ga4Id}');`}
          </Script>
        </>
      )}
      {metaPixelId && (
        <>
          <Script id="meta-pixel-init" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${metaPixelId}');fbq('track', 'PageView');`}
          </Script>
          <noscript>
            <img height="1" width="1" style={{ display: 'none' }} alt=""
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`} />
          </noscript>
        </>
      )}
      <ScrollProgress />
      <CustomCursor />
      <Navbar services={services} logoUrl={logoUrl} isHiring={isHiring} />
      <ScrollRevealProvider>
        <main>{children}</main>
      </ScrollRevealProvider>
      <Footer
        isHiring={isHiring}
        phones={footerPhones}
        emails={footerEmails}
        address={footerAddress}
        mapEmbedUrl={mapEmbedUrl}
        socials={socials}
      />
      <WhatsAppButton url={whatsappUrl} />
    </>
  )
}
