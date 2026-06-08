import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { STATIC_PAGES } from '@/lib/seo'
import SeoOverview from './SeoOverview'

export const metadata: Metadata = { title: 'SEO Manager — KTI Admin' }

async function getPageData() {
  try {
    const existing = await prisma.pageSeo.findMany({
      include: {
        schemas: { select: { isActive: true } },
      },
    })
    const existingMap = Object.fromEntries(
      existing.map(p => [
        p.pageKey,
        {
          ...p,
          updatedAt: p.updatedAt.toISOString(),
          createdAt: p.createdAt.toISOString(),
          _schemasActive: p.schemas.filter(s => s.isActive).length,
          schemas: undefined,
        },
      ])
    )
    return STATIC_PAGES.map(p => ({ ...p, seo: existingMap[p.key] ?? null }))
  } catch {
    return STATIC_PAGES.map(p => ({ ...p, seo: null }))
  }
}

export default async function SeoManagerPage() {
  const pages = await getPageData()
  return <SeoOverview staticPages={pages as Parameters<typeof SeoOverview>[0]['staticPages']} />
}
