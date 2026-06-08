import type { Metadata } from 'next'
import ServicesForm from '../ServicesForm'

export const metadata: Metadata = { title: 'New Service — KTI Admin' }

export default function NewServicePage() {
  return <ServicesForm initialData={null} />
}
