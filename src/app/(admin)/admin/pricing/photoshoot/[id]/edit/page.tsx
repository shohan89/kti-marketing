import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PhotoshootForm from '../../PhotoshootForm'

export const dynamic = 'force-dynamic'

export default async function EditPhotoshootPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const pkg = await prisma.photoshootPackage.findUnique({ where: { id } })
    if (!pkg) notFound()
    return <PhotoshootForm initialData={pkg as unknown as Parameters<typeof PhotoshootForm>[0]['initialData']} />
  } catch {
    notFound()
  }
}
