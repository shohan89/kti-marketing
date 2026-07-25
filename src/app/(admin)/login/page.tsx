import { redirect } from 'next/navigation'

// Superseded by /admin/login. This page used to sign in with the Supabase
// browser client, which sets Supabase's own cookies but never the admin session
// cookie — so it could never produce a valid session. Redirect instead of
// leaving a second, broken login form reachable.
export default async function LegacyLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  redirect(next ? `/admin/login?next=${encodeURIComponent(next)}` : '/admin/login')
}
