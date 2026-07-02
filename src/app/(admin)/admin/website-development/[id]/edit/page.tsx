import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ThemeForm from '../../ThemeForm'

export const dynamic = 'force-dynamic'

export default async function EditThemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const theme = await prisma.websiteTheme.findUnique({ where: { id } })
    if (!theme) notFound()
    return <ThemeForm initialData={theme as unknown as Parameters<typeof ThemeForm>[0]['initialData']} />
  } catch {
    notFound()
  }
}
