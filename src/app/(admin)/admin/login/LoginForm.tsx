'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

interface Props {
  supabaseUrl: string
  supabaseAnonKey: string
}

export default function LoginForm({ supabaseUrl, supabaseAnonKey }: Props) {
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
    if (!supabaseUrl || !supabaseAnonKey) {
      setError('Authentication service is not configured yet.')
      setLoading(false)
      return
    }
    try {
      const { createBrowserClient } = await import('@supabase/ssr')
      const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError || !data.session) { setError('Invalid email or password.'); setLoading(false); return }
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
