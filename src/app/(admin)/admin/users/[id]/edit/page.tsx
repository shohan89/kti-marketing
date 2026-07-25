import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getCurrentAdminUser } from '@/lib/auth'
import UserForm from '../../UserForm'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const me = await getCurrentAdminUser()
  if (!me) redirect('/admin/login')

  const user = await prisma.adminUser.findUnique({ where: { id } }).catch(() => null)
  if (!user) notFound()

  return <UserForm initialData={user as Parameters<typeof UserForm>[0]['initialData']} currentUserRole={me.roleLabel} currentUserId={me.id} />
}
