import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ServicesForm from '../../ServicesForm'

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const service = await prisma.service.findUnique({ where: { id } }).catch(() => null)
  if (!service) notFound()
  return <ServicesForm initialData={service} />
}
