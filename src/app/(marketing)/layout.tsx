import { prisma } from '@/lib/prisma'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/ui/ScrollProgress'
import CustomCursor from '@/components/ui/CustomCursor'
import ScrollRevealProvider from '@/components/ui/ScrollRevealProvider'

async function getNavData() {
  try {
    const [services, jobCount] = await Promise.all([
      prisma.service.findMany({
        where: { isPublished: true },
        select: { slug: true, title: true },
        orderBy: { sortOrder: 'asc' },
      }),
      prisma.jobListing.count({ where: { isPublished: true } }),
    ])
    return { services, isHiring: jobCount > 0 }
  } catch {
    // Database not connected yet — return static fallback
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
    }
  }
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { services, isHiring } = await getNavData()

  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Navbar services={services} />
      <ScrollRevealProvider>
        <main>{children}</main>
      </ScrollRevealProvider>
      <Footer isHiring={isHiring} />
    </>
  )
}
