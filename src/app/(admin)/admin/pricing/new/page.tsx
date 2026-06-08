import type { Metadata } from 'next'
import PricingForm from '../PricingForm'

export const metadata: Metadata = { title: 'New Package — KTI Admin' }

export default function NewPricingPage() {
  return <PricingForm initialData={null} />
}
