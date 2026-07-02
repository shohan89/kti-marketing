import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import VideoPackageForm from '../../VideoPackageForm'

export const dynamic = 'force-dynamic'

export default async function EditVideoPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const pkg = await prisma.videoPackage.findUnique({ where: { id } })
    if (!pkg) notFound()
    return <VideoPackageForm initialData={pkg as unknown as Parameters<typeof VideoPackageForm>[0]['initialData']} />
  } catch {
    notFound()
  }
}
