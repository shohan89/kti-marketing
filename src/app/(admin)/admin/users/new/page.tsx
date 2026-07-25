import { redirect } from 'next/navigation'
import { getCurrentAdminUser } from '@/lib/auth'
import UserForm from '../UserForm'

export const metadata = { title: 'New User — KTI Admin' }

export default async function NewUserPage() {
  const me = await getCurrentAdminUser()
  if (!me) redirect('/admin/login')
  return <UserForm initialData={null} currentUserRole={me.roleLabel} currentUserId={me.id} />
}
