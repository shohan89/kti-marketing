import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isScriptableType, validateMediaUpload } from '@/lib/upload-validation'

// Buckets the Media Library is allowed to write to. Previously any caller-
// supplied `folder` value created a new public bucket on demand.
const ALLOWED_BUCKETS = new Set([
  'assets', 'media', 'images', 'logos', 'videos',
  'blog', 'website-themes', 'founder', 'founder-sections', 'clients',
  'hero', 'brand-logos', 'portfolio', 'team', 'services', 'branding',
])

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = () => process.env.SUPABASE_SERVICE_ROLE_KEY!

function supabaseHeaders() {
  return {
    Authorization: `Bearer ${SERVICE_KEY()}`,
    apikey: SERVICE_KEY(),
  }
}

async function ensureBucket(bucket: string) {
  await fetch(`${SUPABASE_URL()}/storage/v1/bucket`, {
    method: 'POST',
    headers: { ...supabaseHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: bucket, name: bucket, public: true }),
  }).catch(() => {})
}

function getPublicUrl(bucket: string, path: string) {
  return `${SUPABASE_URL()}/storage/v1/object/public/${bucket}/${path}`
}

export async function POST(request: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth

  if (!SERVICE_KEY() || !SUPABASE_URL()) {
    return NextResponse.json(
      { error: 'SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables.' },
      { status: 500 }
    )
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const bucket = (formData.get('folder') as string | null) || 'assets'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!ALLOWED_BUCKETS.has(bucket)) {
      return NextResponse.json({ error: 'Invalid destination folder.' }, { status: 400 })
    }

    const invalid = validateMediaUpload(file)
    if (invalid) {
      return NextResponse.json({ error: invalid.error }, { status: invalid.status })
    }

    await ensureBucket(bucket)

    // Strip any path separators before building the object key.
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const path = `${Date.now()}-${safeName}`

    const uploadRes = await fetch(
      `${SUPABASE_URL()}/storage/v1/object/${bucket}/${path}`,
      {
        method: 'POST',
        headers: {
          ...supabaseHeaders(),
          'Content-Type': file.type,
          // SVGs can execute script when rendered inline; force a download so
          // a stored SVG can't run in the site's origin.
          ...(isScriptableType(file.type)
            ? { 'Content-Disposition': `attachment; filename="${safeName}"` }
            : {}),
          'x-upsert': 'true',
        },
        body: await file.arrayBuffer(),
      }
    )

    if (!uploadRes.ok) {
      const err = await uploadRes.text()
      console.error('Supabase upload error:', err)
      return NextResponse.json({ error: err }, { status: 500 })
    }

    const url = getPublicUrl(bucket, path)

    // Record in Media Library — best-effort so a DB hiccup never blocks the upload itself.
    try {
      await prisma.mediaFile.create({
        data: { filename: path, originalName: file.name, size: file.size, url, bucket },
      })
    } catch (e) {
      console.error('[upload] Failed to record MediaFile row:', e)
    }

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
