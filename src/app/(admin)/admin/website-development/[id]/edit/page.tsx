import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ThemeForm from '../../ThemeForm'

export const dynamic = 'force-dynamic'

type ThemeData = Parameters<typeof ThemeForm>[0]['initialData']

export default async function EditThemePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Only the query is wrapped: notFound() throws a control-flow signal, so
  // calling it inside the try meant the catch swallowed its own redirect.
  let theme: unknown = null
  try {
    theme = await prisma.websiteTheme.findUnique({ where: { id } })
  } catch {
    theme = null
  }

  if (!theme) notFound()

  return <ThemeForm initialData={theme as ThemeData} />
}
