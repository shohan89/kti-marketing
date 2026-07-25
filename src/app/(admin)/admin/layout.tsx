import { getCurrentAdminUser } from '@/lib/auth'
import { ROLE_LABELS } from '@/lib/permissions'
import AdminShell from './AdminShell'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentAdminUser()
  const roleLabel = me ? (ROLE_LABELS[me.roleLabel] ?? me.roleLabel) : null

  return (
    <AdminShell permissions={me?.permissions ?? null} roleLabel={roleLabel}>
      {children}
    </AdminShell>
  )
}
