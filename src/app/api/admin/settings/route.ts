import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function GET() {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const settings = await prisma.siteSetting.findMany()
    return NextResponse.json(Object.fromEntries(settings.map((s: { key: string; value: string }) => [s.key, s.value])))
  } catch {
    return NextResponse.json({})
  }
}

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  const data: Record<string, string> = await req.json()
  try {
    await Promise.all(
      Object.entries(data).map(([key, value]) =>
        prisma.siteSetting.upsert({ where: { key }, update: { value, updatedAt: new Date() }, create: { key, value } })
      )
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }
}
