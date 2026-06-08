// Server-only SEO module — imports prisma, safe only in Server Components / API routes
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import type { PageSeoData, SeoSchemaData } from '@/lib/seo-utils'

// Re-export everything from browser-safe utils so server code only needs one import
export {
  STATIC_PAGES,
  SCHEMA_TYPES,
  calculateSeoScore,
  getScoreColor,
  getScoreLabel,
  getSchemaTemplate,
} from '@/lib/seo-utils'
export type { SeoScore, StaticPageKey, SeoSchemaData, PageSeoData } from '@/lib/seo-utils'

// ── DB Helpers ───────────────────────────────────────────────────────────────

export async function getPageSeo(pageKey: string): Promise<PageSeoData | null> {
  try {
    const data = await prisma.pageSeo.findUnique({
      where: { pageKey },
      include: {
        schemas: { orderBy: { sortOrder: 'asc' } },
      },
    })
    return data as unknown as PageSeoData | null
  } catch {
    return null
  }
}

// ── Metadata Builder ─────────────────────────────────────────────────────────

export function buildMetadata(
  seo: PageSeoData | null,
  fallback: { title?: string; description?: string; url?: string } = {}
): Metadata {
  if (!seo) {
    return { title: fallback.title, description: fallback.description }
  }

  const title = seo.metaTitle ?? fallback.title
  const description = seo.metaDescription ?? fallback.description
  const canonical = seo.canonicalUrl ?? fallback.url
  const robots = `${seo.robotsIndex ? 'index' : 'noindex'}, ${seo.robotsFollow ? 'follow' : 'nofollow'}`

  return {
    title,
    description,
    robots,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: {
      title: (seo.ogTitle ?? title) ?? undefined,
      description: (seo.ogDescription ?? description) ?? undefined,
      url: (seo.ogUrl ?? canonical) ?? undefined,
      type: (seo.ogType as 'website' | 'article') ?? 'website',
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: {
      card: (seo.twitterCard as 'summary' | 'summary_large_image') ?? 'summary_large_image',
      title: (seo.twitterTitle ?? title) ?? undefined,
      description: (seo.twitterDescription ?? description) ?? undefined,
      ...(seo.twitterImage ? { images: [seo.twitterImage] } : {}),
    },
  }
}

// ── JSON-LD Helper ────────────────────────────────────────────────────────────

export function buildJsonLdScripts(schemas: SeoSchemaData[]): string[] {
  return schemas
    .filter(s => s.isActive)
    .map(s => JSON.stringify(s.data, null, 2))
}
