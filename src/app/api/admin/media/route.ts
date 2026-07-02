import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const UPLOAD_DIR = join(process.cwd(), 'public', 'upload')
const IMAGE_BUCKETS = ['media', 'services', 'team', 'clients', 'hero', 'assets', 'portfolio', 'blog', 'founder', 'brand-logos', 'website-themes']
const IMAGE_EXTS = /\.(jpe?g|png|gif|webp|avif|svg|bmp|tiff?)$/i

async function ensureDir() {
  if (!existsSync(UPLOAD_DIR)) await mkdir(UPLOAD_DIR, { recursive: true })
}

// The Supabase-backed compat layer returns timestamp columns as already-ISO
// strings (from PostgREST/JSON), not JS Date instances — calling
// .toISOString() on them throws. Handle either shape defensively.
function toIso(v: unknown): string {
  if (v instanceof Date) return v.toISOString()
  if (typeof v === 'string') return v
  return new Date().toISOString()
}

/** Parse a Supabase-Storage-hosted URL (direct public URL or the /public/{bucket}/{filename}
 *  proxy format used across this app) into its bucket + object filename, or null if it's not
 *  a Storage-hosted URL (e.g. a local static asset or external URL — nothing to track). */
function parseStorageUrl(raw: unknown): { bucket: string; filename: string } | null {
  if (typeof raw !== 'string' || !raw) return null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const prefix = supabaseUrl ? `${supabaseUrl}/storage/v1/object/public/` : null
  if (prefix && raw.startsWith(prefix)) {
    const rest = raw.slice(prefix.length)
    const slash = rest.indexOf('/')
    if (slash > 0) return { bucket: rest.slice(0, slash), filename: decodeURIComponent(rest.slice(slash + 1)) }
  }
  const m = raw.match(/^\/public\/([^/]+)\/(.+)$/)
  if (m) return { bucket: m[1], filename: decodeURIComponent(m[2]) }
  return null
}

function safeJsonParse<T>(str: string | null | undefined): T | null {
  if (!str) return null
  try { return JSON.parse(str) as T } catch { return null }
}

/** Walk every content model/field known to store image URLs (services, blog posts,
 *  portfolio items, case studies, website themes, team members, homepage/about site
 *  settings) and return every image URL actually referenced across the live site —
 *  this is the guaranteed source of "images I used", independent of whether the
 *  Storage bucket-listing API happens to work in the current runtime. */
async function collectContentImageUrls(): Promise<string[]> {
  const urls: string[] = []
  const push = (v: unknown) => { if (typeof v === 'string' && v) urls.push(v) }

  try {
    const services = await prisma.service.findMany({ select: { imageUrl: true, imageGallery: true } })
    for (const s of services) {
      push(s.imageUrl)
      const gallery = Array.isArray(s.imageGallery) ? s.imageGallery : []
      gallery.forEach(push)
    }
  } catch (e) { console.error('[media backfill] service scan failed:', e) }

  try {
    const posts = await prisma.blogPost.findMany({ select: { coverImageUrl: true } })
    posts.forEach(p => push(p.coverImageUrl))
  } catch (e) { console.error('[media backfill] blogPost scan failed:', e) }

  try {
    const items = await prisma.portfolioItem.findMany({ select: { imageUrls: true } })
    for (const i of items) {
      const arr = Array.isArray(i.imageUrls) ? i.imageUrls : []
      arr.forEach(push)
    }
  } catch (e) { console.error('[media backfill] portfolioItem scan failed:', e) }

  try {
    const cases = await prisma.caseStudy.findMany({ select: { coverImageUrl: true, imageUrls: true } })
    for (const c of cases) {
      push(c.coverImageUrl)
      const arr = Array.isArray(c.imageUrls) ? c.imageUrls : []
      arr.forEach(push)
    }
  } catch (e) { console.error('[media backfill] caseStudy scan failed:', e) }

  try {
    const themes = await prisma.websiteTheme.findMany({ select: { image: true } })
    themes.forEach(t => push(t.image))
  } catch (e) { console.error('[media backfill] websiteTheme scan failed:', e) }

  try {
    const team = await prisma.teamMember.findMany({ select: { imageUrl: true } })
    team.forEach(m => push(m.imageUrl))
  } catch (e) { console.error('[media backfill] teamMember scan failed:', e) }

  try {
    const settings = await prisma.siteSetting.findMany({
      where: { key: { in: ['homepage_hero', 'homepage_brands', 'about_founder', 'about_clients'] } },
    })
    for (const row of settings) {
      const value = safeJsonParse<unknown>(row.value)
      if (row.key === 'homepage_hero') push((value as { heroImageUrl?: string } | null)?.heroImageUrl)
      if (row.key === 'homepage_brands' && Array.isArray(value)) (value as { logoUrl?: string }[]).forEach(b => push(b?.logoUrl))
      if (row.key === 'about_founder') push((value as { photoUrl?: string } | null)?.photoUrl)
      if (row.key === 'about_clients' && Array.isArray(value)) (value as { logoUrl?: string }[]).forEach(c => push(c?.logoUrl))
    }
  } catch (e) { console.error('[media backfill] siteSetting scan failed:', e) }

  return [...new Set(urls)]
}

async function listSupabaseImages() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return []

  const headers = {
    Authorization: `Bearer ${key}`,
    apikey: key,
    'Content-Type': 'application/json',
  }

  const items: {
    id: string; filename: string; originalName: string; url: string
    size: number; width: null; height: null; alt: string; createdAt: string
    source: 'supabase'; bucket: string; canDelete: false
  }[] = []

  for (const bucket of IMAGE_BUCKETS) {
    try {
      const res = await fetch(`${url}/storage/v1/object/list/${bucket}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ limit: 500, sortBy: { column: 'created_at', order: 'desc' } }),
      })
      if (!res.ok) continue
      const data: { name?: string; metadata?: { size?: number }; created_at?: string }[] = await res.json()
      for (const file of data) {
        if (!file.name || file.name === '.emptyFolderPlaceholder') continue
        if (!IMAGE_EXTS.test(file.name)) continue
        items.push({
          id: `sb-${bucket}-${file.name}`,
          filename: file.name,
          originalName: file.name,
          url: `/public/${bucket}/${file.name}`,
          size: file.metadata?.size ?? 0,
          width: null, height: null, alt: '',
          createdAt: file.created_at ?? new Date().toISOString(),
          source: 'supabase', bucket,
          canDelete: false,
        })
      }
    } catch { /* bucket may not exist, skip */ }
  }
  return items
}

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth

  // Two independent data sources — a failure in one (e.g. transient DB hiccup)
  // must never zero out the other, or the whole library silently looks empty.
  let localFiles: Awaited<ReturnType<typeof prisma.mediaFile.findMany>> = []
  try {
    localFiles = await prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' } })
  } catch (e) {
    console.error('[media GET] mediaFile.findMany failed:', e)
  }

  let supabaseFiles: Awaited<ReturnType<typeof listSupabaseImages>> = []
  try {
    supabaseFiles = await listSupabaseImages()
  } catch (e) {
    console.error('[media GET] listSupabaseImages failed:', e)
  }

  let contentUrls: string[] = []
  try {
    contentUrls = await collectContentImageUrls()
  } catch (e) {
    console.error('[media GET] collectContentImageUrls failed:', e)
  }

  const localFilenames = new Set(localFiles.map(f => f.filename))

  // Merge candidates from both sources — the Storage bucket-listing scan AND every
  // image URL actually referenced by site content — deduped by filename. The content
  // scan is the guaranteed source: it only depends on normal DB reads (already proven
  // to work everywhere else in this admin), independent of whether Storage's list API
  // happens to succeed in the current runtime.
  const candidates = new Map<string, { filename: string; originalName: string; size: number; url: string; bucket: string }>()
  for (const f of supabaseFiles) {
    if (localFilenames.has(f.filename)) continue
    candidates.set(f.filename, { filename: f.filename, originalName: f.originalName, size: f.size, url: f.url, bucket: f.bucket })
  }
  for (const raw of contentUrls) {
    const parsed = parseStorageUrl(raw)
    if (!parsed) continue
    if (localFilenames.has(parsed.filename) || candidates.has(parsed.filename)) continue
    candidates.set(parsed.filename, { filename: parsed.filename, originalName: parsed.filename, size: 0, url: raw, bucket: parsed.bucket })
  }

  // Lazily backfill a MediaFile row for every image we haven't tracked yet, so it
  // becomes editable/deletable through the same DB-backed flow (one-time cost —
  // subsequent loads have nothing left to backfill).
  const backfilled = (await Promise.all([...candidates.values()].map(async f => {
    try {
      return await prisma.mediaFile.create({
        data: { filename: f.filename, originalName: f.originalName, size: f.size, url: f.url, bucket: f.bucket },
      })
    } catch (e) {
      console.error('[media GET] backfill failed for', f.filename, e)
      return null
    }
  }))).filter((f): f is NonNullable<typeof f> => f !== null)

  const all = [...localFiles, ...backfilled].map(f => ({
    id: f.id,
    filename: f.filename,
    originalName: f.originalName,
    url: f.url ?? `/upload/${f.filename}`,
    size: f.size,
    width: f.width,
    height: f.height,
    alt: f.alt,
    createdAt: toIso(f.createdAt),
    source: f.bucket ? ('supabase' as const) : ('local' as const),
    bucket: f.bucket ?? undefined,
    canDelete: true,
  })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json(all)
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    await ensureDir()
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const originalName = (formData.get('originalName') as string) || 'upload'
    const width = parseInt((formData.get('width') as string) || '0') || null
    const height = parseInt((formData.get('height') as string) || '0') || null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`
    const filepath = join(UPLOAD_DIR, filename)
    const bytes = await file.arrayBuffer()
    await writeFile(filepath, Buffer.from(bytes))

    const media = await prisma.mediaFile.create({
      data: { filename, originalName, size: file.size, width, height },
    })

    return NextResponse.json({
      ...media,
      url: `/upload/${media.filename}`,
      source: 'local',
      canDelete: true,
      createdAt: toIso(media.createdAt),
    }, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Upload failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
