import type { Metadata } from 'next'
import CaseStudyForm from '../CaseStudyForm'

export const metadata: Metadata = { title: 'New Case Study — KTI Admin' }

export default function NewCaseStudyPage() {
  return <CaseStudyForm initialData={null} />
}
