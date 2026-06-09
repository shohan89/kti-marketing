import type { Metadata } from 'next'
import CaseStudyForm from '../CaseStudyForm'

export const metadata: Metadata = { title: 'New Portfolio Item — KTI Admin' }

export default function NewCaseStudyPage() {
  return <CaseStudyForm initialData={null} />
}
