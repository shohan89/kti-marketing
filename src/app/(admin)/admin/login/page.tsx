import { Suspense } from 'react'
import LoginForm from './LoginForm'
import './login.css'

// force-dynamic ensures this page renders at request time on the Worker,
// so populateProcessEnv() has already run and NEXT_PUBLIC_* vars are live.
// Without this, Next.js statically pre-renders the page at build time where
// Turbopack does not evaluate NEXT_PUBLIC_* in server components.
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    <Suspense>
      <LoginForm supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />
    </Suspense>
  )
}
