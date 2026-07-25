import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import VideoPackageForm from '../../VideoPackageForm'

export const dynamic = 'force-dynamic'

type VideoPackageData = Parameters<typeof VideoPackageForm>[0]['initialData']

export default async function EditVideoPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  // Only the query is wrapped: notFound() throws a control-flow signal, so
  // calling it inside the try meant the catch swallowed its own redirect.
  let pkg: unknown = null
  try {
    pkg = await prisma.videoPackage.findUnique({ where: { id } })
  } catch {
    pkg = null
  }

  if (!pkg) notFound()

  return <VideoPackageForm initialData={pkg as VideoPackageData} />
}
