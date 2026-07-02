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
  try {
    const [localFiles, supabaseFiles] = await Promise.all([
      prisma.mediaFile.findMany({ orderBy: { createdAt: 'desc' } }),
      listSupabaseImages(),
    ])

    const localItems = localFiles.map(f => ({
      id: f.id,
      filename: f.filename,
      originalName: f.originalName,
      url: f.url ?? `/upload/${f.filename}`,
      size: f.size,
      width: f.width,
      height: f.height,
      alt: f.alt,
      createdAt: f.createdAt.toISOString(),
      source: f.bucket ? ('supabase' as const) : ('local' as const),
      bucket: f.bucket ?? undefined,
      canDelete: true,
    }))

    const localFilenames = new Set(localFiles.map(f => f.filename))
    const uniqueSupabase = supabaseFiles.filter(f => !localFilenames.has(f.filename))

    const all = [...localItems, ...uniqueSupabase].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json(all)
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
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
      createdAt: media.createdAt.toISOString(),
    }, { status: 201 })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Upload failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
