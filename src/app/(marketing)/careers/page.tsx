import type { Metadata } from 'next'
import CareersClient from './CareersClient'
import { jobListings } from '@/data/staticData'
import { getPageSeo, buildMetadata } from '@/lib/seo'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo('careers')
  return buildMetadata(seo, { title: 'Careers — Build Something Great. Together.', description: 'Join KTI Marketing — a fast-moving creative agency where passionate people do their best work across social, search, and beyond.' })
}

export default async function CareersPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let jobs: any[] = jobListings
  try {
    const rows = await prisma.jobListing.findMany({ where: { isPublished: true }, orderBy: { id: 'asc' } })
    if (rows.length > 0) {
      jobs = rows
    }
  } catch { /* use static fallback */ }
  return <CareersClient jobs={jobs} />
}
