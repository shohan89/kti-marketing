import { Suspense } from 'react'
import LoginForm from './LoginForm'
import './login.css'

// Sign-in posts to /api/auth/session, which reads the Supabase credentials
// server-side, so this page no longer needs to forward them to the client.
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
