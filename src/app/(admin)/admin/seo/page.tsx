import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { STATIC_PAGES } from '@/lib/seo'
import SeoOverview from './SeoOverview'

export const metadata: Metadata = { title: 'SEO Manager — KTI Admin' }

// The Supabase-backed compat layer returns timestamp columns as already-ISO
// strings (from PostgREST/JSON), not JS Date instances — calling
// .toISOString() on them throws. Handle either shape defensively.
function toIso(v: unknown): string {
  if (v instanceof Date) return v.toISOString()
  if (typeof v === 'string') return v
  return new Date().toISOString()
}

async function getPageData() {
  // Two independent queries instead of a nested `include` — a failure in the
  // schema-count side (e.g. a relation the compat layer can't resolve) must
  // never blank out the page list itself, which is what makes "Configure"
  // wrongly appear for pages that already have a PageSeo row.
  let existing: Awaited<ReturnType<typeof prisma.pageSeo.findMany>> = []
  try {
    existing = await prisma.pageSeo.findMany()
  } catch (e) {
    console.error('[SEO Manager] pageSeo.findMany failed:', e)
  }

  const schemaCounts: Record<string, number> = {}
  try {
    const schemas = await prisma.seoSchema.findMany({ where: { isActive: true }, select: { pageId: true } })
    for (const s of schemas) schemaCounts[s.pageId] = (schemaCounts[s.pageId] ?? 0) + 1
  } catch (e) {
    console.error('[SEO Manager] seoSchema.findMany failed:', e)
  }

  const existingMap = Object.fromEntries(
    existing.map(p => [
      p.pageKey,
      {
        ...p,
        updatedAt: toIso(p.updatedAt),
        createdAt: toIso(p.createdAt),
        _schemasActive: schemaCounts[p.id] ?? 0,
      },
    ])
  )
  return STATIC_PAGES.map(p => ({ ...p, seo: existingMap[p.key] ?? null }))
}

export default async function SeoManagerPage() {
  const pages = await getPageData()
  return <SeoOverview staticPages={pages as Parameters<typeof SeoOverview>[0]['staticPages']} />
}
