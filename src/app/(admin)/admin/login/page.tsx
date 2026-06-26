'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import './login.css'

function LoginForm() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/admin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      // NEXT_PUBLIC_* vars may not be baked in at build time on Cloudflare CI/CD
      // (they live as runtime Worker vars, not build-phase vars). Fetch them from
      // the server where populateProcessEnv() always makes them available.
      let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      if (!supabaseUrl || !supabaseAnonKey) {
        const res = await fetch('/api/admin/supabase-config')
        if (!res.ok) { setError('Authentication service is not configured yet.'); setLoading(false); return }
        const cfg = await res.json()
        supabaseUrl = cfg.supabaseUrl
        supabaseAnonKey = cfg.supabaseAnonKey
      }
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(supabaseUrl!, supabaseAnonKey!)
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError || !data.session) { setError('Invalid email or password.'); setLoading(false); return }
      // Store the raw JWT so the middleware can validate it without decoding
      // the opaque Supabase session cookie format.
      const { access_token, expires_in } = data.session
      document.cookie = `admin_jwt=${access_token}; path=/; samesite=lax; max-age=${expires_in ?? 3600}`
      window.location.assign(next)
    } catch {
      setError('Sign in failed. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__brand">
          <span className="admin-login__logo">KTI</span>
          <span className="admin-login__logo-text">Marketing</span>
        </div>
        <h1 className="admin-login__title">Dashboard Login</h1>
        <p className="admin-login__sub">Sign in to manage your website content.</p>
        <form className="admin-login__form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" required autoComplete="email" placeholder="admin@ktimarketing.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="admin-form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" required autoComplete="current-password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          {error && <p className="admin-login__error">{error}</p>}
          <button type="submit" className="admin-login__btn" disabled={loading}>{loading ? 'Signing in…' : 'Sign In'}</button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
