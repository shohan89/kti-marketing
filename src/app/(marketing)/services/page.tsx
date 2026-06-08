import type { Metadata } from 'next'
import ServicesClient from './ServicesClient'
import { servicesData } from '@/data/staticData'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('services')
  return buildMetadata(seo, { title: 'Our Services', description: 'From social media management and paid advertising to video production and influencer partnerships — every service is built around one goal: measurable, sustainable growth.' })
}

export default async function ServicesPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let services: any[] = servicesData
  try {
    const rows = await prisma.service.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } })
    if (rows.length > 0) {
      services = rows.map(s => ({ ...s, image: s.imageUrl ?? '', process: s.processSteps ?? [] }))
    }
  } catch { /* use static fallback */ }
  return <ServicesClient services={services} />
}
