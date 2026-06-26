import { Suspense } from 'react'
import LoginForm from './LoginForm'
import './login.css'

// Server component: runs on the Worker after populateProcessEnv() has copied
// all Cloudflare runtime vars into process.env, so these values are always
// present even when the CI/CD build didn't have them at next build time.
export default function LoginPage() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
  return (
    <Suspense>
      <LoginForm supabaseUrl={supabaseUrl} supabaseAnonKey={supabaseAnonKey} />
    </Suspense>
  )
}
