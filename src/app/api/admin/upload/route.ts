import { NextRequest, NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/auth'

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

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    await ensureBucket(bucket)

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
    const path = `${Date.now()}-${safeName}`

    const uploadRes = await fetch(
      `${SUPABASE_URL()}/storage/v1/object/${bucket}/${path}`,
      {
        method: 'POST',
        headers: {
          ...supabaseHeaders(),
          'Content-Type': file.type,
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

    return NextResponse.json({ url: getPublicUrl(bucket, path) })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
