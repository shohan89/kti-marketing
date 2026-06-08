import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PricingForm from '../../PricingForm'

export default async function EditPricingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const pkg = await prisma.marketingPackage.findUnique({ where: { id } }).catch(() => null)
  if (!pkg) notFound()
  return <PricingForm initialData={pkg as Parameters<typeof PricingForm>[0]['initialData']} />
}
