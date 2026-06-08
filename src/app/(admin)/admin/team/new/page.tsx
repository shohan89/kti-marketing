import type { Metadata } from 'next'
import TeamForm from '../TeamForm'

export const metadata: Metadata = { title: 'New Team Member — KTI Admin' }

export default function NewTeamMemberPage() {
  return <TeamForm initialData={null} />
}
