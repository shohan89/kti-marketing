import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import TeamForm from '../../TeamForm'

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.teamMember.findUnique({ where: { id } }).catch(() => null)
  if (!member) notFound()
  return <TeamForm initialData={member as Parameters<typeof TeamForm>[0]['initialData']} />
}
