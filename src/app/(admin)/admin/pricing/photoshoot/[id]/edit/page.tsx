import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PhotoshootForm from '../../PhotoshootForm'

export const dynamic = 'force-dynamic'

type PhotoshootData = Parameters<typeof PhotoshootForm>[0]['initialData']

export default async function EditPhotoshootPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Only the query is wrapped: notFound() throws a control-flow signal, so
  // calling it inside the try meant the catch swallowed its own redirect.
  let pkg: unknown = null
  try {
    pkg = await prisma.photoshootPackage.findUnique({ where: { id } })
  } catch {
    pkg = null
  }

  if (!pkg) notFound()

  return <PhotoshootForm initialData={pkg as PhotoshootData} />
}
