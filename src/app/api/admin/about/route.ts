import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const unauth = await requireAdminSession()
  if (unauth) return unauth
  try {
    const { clients, achievements, clientsTitle, achievementsTitle, founderTags, founder } = await req.json()
    await Promise.all([
      prisma.siteSetting.upsert({
        where: { key: 'about_founder_tags' },
        update: { value: JSON.stringify(founderTags ?? []) },
        create: { key: 'about_founder_tags', value: JSON.stringify(founderTags ?? []), label: 'About — Founder Tags', group: 'about' },
      }),
      prisma.siteSetting.upsert({
        where: { key: 'about_founder' },
        update: { value: JSON.stringify(founder ?? {}) },
        create: { key: 'about_founder', value: JSON.stringify(founder ?? {}), label: 'About — Founder Bio', group: 'about' },
      }),
      prisma.siteSetting.upsert({
        where: { key: 'about_clients' },
        update: { value: JSON.stringify(clients ?? []) },
        create: { key: 'about_clients', value: JSON.stringify(clients ?? []), label: 'About — Clients', group: 'about' },
      }),
      prisma.siteSetting.upsert({
        where: { key: 'about_achievements' },
        update: { value: JSON.stringify(achievements ?? []) },
        create: { key: 'about_achievements', value: JSON.stringify(achievements ?? []), label: 'About — Achievements', group: 'about' },
      }),
      prisma.siteSetting.upsert({
        where: { key: 'about_extra' },
        update: { value: JSON.stringify({ clientsTitle, achievementsTitle }) },
        create: { key: 'about_extra', value: JSON.stringify({ clientsTitle, achievementsTitle }), label: 'About — Extra', group: 'about' },
      }),
    ])
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'DB error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
