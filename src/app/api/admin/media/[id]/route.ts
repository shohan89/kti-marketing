import { NextRequest, NextResponse } from 'next/server'
import { unlink } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = () => process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function DELETE(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const media = await prisma.mediaFile.findUnique({ where: { id } })
    if (!media) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (media.bucket) {
      await fetch(`${SUPABASE_URL()}/storage/v1/object/${media.bucket}/${media.filename}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${SERVICE_KEY()}`, apikey: SERVICE_KEY() },
      }).catch(() => {})
    } else {
      const filepath = join(process.cwd(), 'public', 'upload', media.filename)
      await unlink(filepath).catch(() => {})
    }

    await prisma.mediaFile.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Delete failed'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const { id } = await context.params
  try {
    const body = await req.json()
    const data: { alt?: string; originalName?: string } = {}
    if ('alt' in body) data.alt = body.alt ?? ''
    if ('originalName' in body) data.originalName = body.originalName || ''
    const media = await prisma.mediaFile.update({ where: { id }, data })
    return NextResponse.json(media)
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
