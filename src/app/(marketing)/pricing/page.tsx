import type { Metadata } from 'next'
import PricingClient from './PricingClient'
import { marketingPackages, photoshootPackages, FAQS } from '@/data/staticData'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('pricing')
  return buildMetadata(seo, { title: 'Pricing — Packages Built for Growth', description: 'No vague retainers. No surprise invoices. Every package is scoped, priced, and delivered exactly as agreed — so you can plan your marketing spend with confidence.' })
}

export default async function PricingPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mPkgs: any[] = marketingPackages
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let pPkgs: any[] = photoshootPackages
  try {
    const [mRows, pRows] = await Promise.all([
      prisma.marketingPackage.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.photoshootPackage.findMany({ where: { isPublished: true }, orderBy: { sortOrder: 'asc' } }),
    ])
    if (mRows.length > 0) mPkgs = mRows
    if (pRows.length > 0) pPkgs = pRows
  } catch { /* use static fallback */ }
  return <PricingClient marketingPackages={mPkgs} photoshootPackages={pPkgs} FAQS={FAQS} />
}
