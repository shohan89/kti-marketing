// Browser-safe SEO utilities — no server imports (no prisma, no pg)

export interface SeoSchemaData {
  id: string
  schemaType: string
  label: string | null
  data: unknown
  sortOrder: number
  isActive: boolean
}

export interface PageSeoData {
  id: string
  pageKey: string
  pageLabel: string
  focusKeyword: string | null
  metaTitle: string | null
  metaDescription: string | null
  canonicalUrl: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  ogUrl: string | null
  ogType: string
  twitterTitle: string | null
  twitterDescription: string | null
  twitterImage: string | null
  twitterCard: string
  robotsIndex: boolean
  robotsFollow: boolean
  priority: number
  changeFreq: string
  schemas: SeoSchemaData[]
}

export interface SeoCheck {
  label: string
  pass: boolean
  category: 'keyword' | 'content' | 'social' | 'schema'
  rec?: string
}

export interface SeoScore {
  score: number
  passed: string[]
  failed: string[]
  recommendations: string[]
  categories: Record<string, { passed: number; total: number }>
  checks: SeoCheck[]
}

export interface ReadabilityScore {
  score: number
  level: 'Easy' | 'OK' | 'Hard'
  avgSentenceLength: number
  avgWordLength: number
  paragraphCount: number
  checks: string[]
}

export const STATIC_PAGES = [
  { key: 'home',          label: 'Homepage',      path: '/' },
  { key: 'about',         label: 'About',         path: '/about' },
  { key: 'contact',       label: 'Contact',       path: '/contact' },
  { key: 'services',      label: 'Services',      path: '/services' },
  { key: 'blog',          label: 'Blog',          path: '/blog' },
  { key: 'portfolio',  label: 'Portfolio',  path: '/portfolio' },
  { key: 'pricing',       label: 'Pricing',       path: '/pricing' },
  { key: 'careers',       label: 'Careers',       path: '/careers' },
  { key: 'themes',        label: 'Themes',        path: '/themes' },
] as const

export type StaticPageKey = typeof STATIC_PAGES[number]['key']

export function calculateSeoScore(data: {
  focusKeyword?: string | null
  metaTitle?: string | null
  metaDescription?: string | null
  canonicalUrl?: string | null
  ogTitle?: string | null
  ogDescription?: string | null
  ogImage?: string | null
  ogUrl?: string | null
  twitterCard?: string | null
  twitterTitle?: string | null
  twitterImage?: string | null
  schemasCount?: number
  schemas?: { data: unknown; isActive: boolean }[]
}): SeoScore {
  const checks: SeoCheck[] = []

  const kw = (data.focusKeyword ?? '').toLowerCase().trim()
  const title = (data.metaTitle ?? '').toLowerCase()
  const desc = (data.metaDescription ?? '').toLowerCase()
  const canonical = data.canonicalUrl ?? ''
  const titleLen = data.metaTitle?.length ?? 0
  const descLen = data.metaDescription?.length ?? 0
  const schemasCount = data.schemasCount ?? (data.schemas?.filter(s => s.isActive).length ?? 0)

  // ── Keyword Checks (6) ──────────────────────────────────────────
  checks.push({
    category: 'keyword', label: 'Focus keyword defined', pass: kw.length > 0,
    rec: 'Set a focus keyword to guide all SEO optimization',
  })
  checks.push({
    category: 'keyword', label: 'Focus keyword in meta title', pass: kw.length > 0 && title.includes(kw),
    rec: kw ? `Include "${kw}" in your meta title` : undefined,
  })
  checks.push({
    category: 'keyword', label: 'Focus keyword in meta description', pass: kw.length > 0 && desc.includes(kw),
    rec: kw ? `Include "${kw}" in your meta description` : undefined,
  })
  checks.push({
    category: 'keyword', label: 'Focus keyword in canonical URL', pass: kw.length > 0 && canonical.toLowerCase().includes(kw.replace(/\s+/g, '-')),
    rec: kw ? `Add "${kw}" to the canonical URL path` : undefined,
  })
  const kwDensityTitle = kw && title ? (title.split(kw).length - 1) / Math.max(title.split(' ').length, 1) : 0
  checks.push({
    category: 'keyword', label: 'Keyword not over-used in title', pass: kwDensityTitle <= 0.5,
    rec: 'Do not repeat the focus keyword more than once in the title',
  })
  const kwInFirstWords = kw.length > 0 && desc.slice(0, 100).includes(kw)
  checks.push({
    category: 'keyword', label: 'Focus keyword in first 100 chars of description', pass: kwInFirstWords,
    rec: kw ? `Start your description with "${kw}" for higher relevance` : undefined,
  })

  // ── Content Checks (6) ──────────────────────────────────────────
  checks.push({
    category: 'content', label: 'Meta title is set', pass: titleLen > 0,
    rec: 'Add a meta title — it is the most important on-page SEO signal',
  })
  checks.push({
    category: 'content', label: `Meta title length (${titleLen} chars, ideal 30–60)`, pass: titleLen >= 30 && titleLen <= 60,
    rec: titleLen > 60 ? 'Shorten your meta title to under 60 characters' : 'Meta title should be at least 30 characters',
  })
  checks.push({
    category: 'content', label: 'Meta description is set', pass: descLen > 0,
    rec: 'Add a meta description to improve click-through rates from search',
  })
  checks.push({
    category: 'content', label: `Meta description length (${descLen} chars, ideal 120–160)`, pass: descLen >= 120 && descLen <= 160,
    rec: descLen > 160 ? 'Shorten description to 160 characters' : 'Expand description to at least 120 characters',
  })
  checks.push({
    category: 'content', label: 'Canonical URL set', pass: !!canonical,
    rec: 'Set a canonical URL to prevent duplicate content penalties',
  })
  const isAbsoluteHttps = canonical.startsWith('https://')
  checks.push({
    category: 'content', label: 'Canonical URL is absolute HTTPS', pass: !canonical || isAbsoluteHttps,
    rec: 'Use an absolute HTTPS URL for canonical (e.g. https://ktimarketing.com/page)',
  })

  // ── Social Checks (6) ───────────────────────────────────────────
  checks.push({
    category: 'social', label: 'Open Graph title set', pass: !!(data.ogTitle),
    rec: 'Add a custom OG title for better Facebook/LinkedIn sharing',
  })
  checks.push({
    category: 'social', label: 'Open Graph description set', pass: !!(data.ogDescription),
    rec: 'Add an OG description to control how your page appears on social',
  })
  checks.push({
    category: 'social', label: 'Open Graph image set', pass: !!(data.ogImage),
    rec: 'Add an OG image (1200×630px) — pages with images get far more clicks',
  })
  const ogImageAbsolute = data.ogImage ? data.ogImage.startsWith('https://') : true
  checks.push({
    category: 'social', label: 'OG image is absolute HTTPS URL', pass: !data.ogImage || ogImageAbsolute,
    rec: 'OG image must be an absolute HTTPS URL for Facebook to load it',
  })
  checks.push({
    category: 'social', label: 'Twitter Card configured', pass: !!(data.twitterCard),
    rec: 'Set a Twitter Card type to enable rich card previews on X',
  })
  checks.push({
    category: 'social', label: 'Twitter title set', pass: !!(data.twitterTitle),
    rec: 'Add a Twitter title (falls back to meta title if omitted)',
  })

  // ── Schema Checks (6) ───────────────────────────────────────────
  checks.push({
    category: 'schema', label: 'At least one active schema', pass: schemasCount >= 1,
    rec: 'Add structured data (JSON-LD) to enable Google Rich Results',
  })
  checks.push({
    category: 'schema', label: 'Multiple schemas for richer results', pass: schemasCount >= 2,
    rec: 'Add at least 2 schemas (e.g. Organization + WebSite) for better coverage',
  })
  const firstSchema = data.schemas?.find(s => s.isActive)?.data
  const firstSchemaHasType = firstSchema ? !!(firstSchema as Record<string, unknown>)['@type'] : false
  checks.push({
    category: 'schema', label: 'Schema has @type defined', pass: !data.schemas?.length || firstSchemaHasType,
    rec: 'All schemas must include an @type field (e.g. "Organization")',
  })
  const firstSchemaHasContext = firstSchema ? !!(firstSchema as Record<string, unknown>)['@context'] : false
  checks.push({
    category: 'schema', label: 'Schema has @context defined', pass: !data.schemas?.length || firstSchemaHasContext,
    rec: 'All schemas must include @context: "https://schema.org"',
  })
  checks.push({
    category: 'schema', label: 'Twitter image set', pass: !!(data.twitterImage ?? data.ogImage),
    rec: 'Set a Twitter image (or an OG image as fallback) for rich card previews',
  })
  checks.push({
    category: 'schema', label: 'OG URL matches canonical', pass: !data.ogImage || !canonical || !data.canonicalUrl || (data.ogUrl === data.canonicalUrl),
    rec: 'Set OG URL to the same value as your canonical URL',
  })

  const passed = checks.filter(c => c.pass).map(c => c.label)
  const failed = checks.filter(c => !c.pass).map(c => c.label)
  const recommendations = checks.filter(c => !c.pass && c.rec).map(c => c.rec!)
  const score = Math.round((passed.length / checks.length) * 100)

  const categoryKeys = ['keyword', 'content', 'social', 'schema'] as const
  const categories: Record<string, { passed: number; total: number }> = {}
  for (const cat of categoryKeys) {
    const catChecks = checks.filter(c => c.category === cat)
    categories[cat] = { passed: catChecks.filter(c => c.pass).length, total: catChecks.length }
  }

  return { score, passed, failed, recommendations, categories, checks }
}

export function calculateReadabilityScore(content: string): ReadabilityScore {
  if (!content.trim()) {
    return { score: 0, level: 'Hard', avgSentenceLength: 0, avgWordLength: 0, paragraphCount: 0, checks: [] }
  }

  const paragraphs = content.split(/\n\s*\n/).filter(p => p.trim().length > 0)
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 5)
  const words = content.trim().split(/\s+/).filter(w => w.length > 0)

  const avgSentenceLength = sentences.length > 0 ? Math.round(words.length / sentences.length) : 0
  const avgWordLength = words.length > 0
    ? Math.round(words.reduce((sum, w) => sum + w.replace(/[^a-z]/gi, '').length, 0) / words.length * 10) / 10
    : 0

  // Simplified Flesch Reading Ease approximation
  const syllableCount = words.reduce((sum, w) => {
    const lower = w.toLowerCase().replace(/[^a-z]/g, '')
    const vowelGroups = lower.match(/[aeiouy]+/g)
    return sum + Math.max(1, vowelGroups ? vowelGroups.length : 1)
  }, 0)

  const syllablesPerWord = words.length > 0 ? syllableCount / words.length : 1
  const fleschScore = Math.round(
    206.835 - (1.015 * avgSentenceLength) - (84.6 * syllablesPerWord)
  )
  const clampedScore = Math.max(0, Math.min(100, fleschScore))

  const checks: string[] = []
  if (avgSentenceLength <= 20) checks.push(`Good sentence length (avg ${avgSentenceLength} words)`)
  else checks.push(`Long sentences (avg ${avgSentenceLength} words — aim for ≤20)`)

  if (avgWordLength <= 6) checks.push(`Simple vocabulary (avg ${avgWordLength} chars/word)`)
  else checks.push(`Complex words (avg ${avgWordLength} chars — use simpler language)`)

  if (paragraphs.length >= 2) checks.push(`Good paragraph structure (${paragraphs.length} paragraphs)`)
  else checks.push('Add more paragraph breaks to improve readability')

  if (sentences.length >= 3) checks.push(`Adequate content length (${sentences.length} sentences)`)
  else checks.push('Content is very short — expand for better readability analysis')

  const level: 'Easy' | 'OK' | 'Hard' = clampedScore >= 60 ? 'Easy' : clampedScore >= 30 ? 'OK' : 'Hard'

  return {
    score: clampedScore,
    level,
    avgSentenceLength,
    avgWordLength,
    paragraphCount: paragraphs.length,
    checks,
  }
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#4ade80'
  if (score >= 50) return '#fbbf24'
  return '#f87171'
}

export function getScoreLabel(score: number): string {
  if (score >= 80) return 'Great'
  if (score >= 50) return 'Good'
  return 'Needs Work'
}

export const SCHEMA_TYPES = [
  'Organization',
  'LocalBusiness',
  'Website',
  'Article',
  'Service',
  'FAQPage',
  'BreadcrumbList',
  'Review',
  'Custom',
] as const

export function getSchemaTemplate(type: string): object {
  const base = { '@context': 'https://schema.org' }
  switch (type) {
    case 'Organization':
      return { ...base, '@type': 'Organization', name: 'KTI Marketing', url: 'https://ktimarketing.com', logo: '', description: '', telephone: '', email: '', sameAs: ['https://facebook.com/ktimarketing', 'https://instagram.com/ktimarketing'] }
    case 'LocalBusiness':
      return { ...base, '@type': 'LocalBusiness', name: 'KTI Marketing', url: 'https://ktimarketing.com', telephone: '', email: '', address: { '@type': 'PostalAddress', streetAddress: '', addressLocality: 'Dhaka', addressRegion: 'Dhaka Division', postalCode: '', addressCountry: 'BD' }, openingHoursSpecification: [] }
    case 'Website':
      return { ...base, '@type': 'WebSite', name: 'KTI Marketing', url: 'https://ktimarketing.com', description: 'Full-service growth agency for ambitious brands.' }
    case 'Article':
      return { ...base, '@type': 'Article', headline: '', author: { '@type': 'Person', name: '' }, datePublished: '', dateModified: '', description: '', image: '' }
    case 'Service':
      return { ...base, '@type': 'Service', name: '', description: '', provider: { '@type': 'Organization', name: 'KTI Marketing', url: 'https://ktimarketing.com' }, areaServed: 'BD' }
    case 'FAQPage':
      return { ...base, '@type': 'FAQPage', mainEntity: [{ '@type': 'Question', name: 'What services does KTI Marketing offer?', acceptedAnswer: { '@type': 'Answer', text: 'KTI Marketing offers full-service digital marketing including SEO, paid media, content creation, and more.' } }] }
    case 'BreadcrumbList':
      return { ...base, '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://ktimarketing.com' }, { '@type': 'ListItem', position: 2, name: 'Page', item: 'https://ktimarketing.com/page' }] }
    case 'Review':
      return { ...base, '@type': 'Review', name: 'Excellent service', reviewBody: '', author: { '@type': 'Person', name: '' }, reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' }, itemReviewed: { '@type': 'LocalBusiness', name: 'KTI Marketing' } }
    default:
      return { ...base, '@type': 'Thing', name: '' }
  }
}
