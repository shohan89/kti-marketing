import type { Metadata } from 'next'
import JobForm from '../JobForm'

export const metadata: Metadata = { title: 'New Job — KTI Admin' }

export default function NewJobPage() {
  return <JobForm initialData={null} />
}
