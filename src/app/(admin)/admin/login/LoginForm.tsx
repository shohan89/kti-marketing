'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function LoginForm() {
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
      // Credentials go to our own route, which signs in against Supabase and
      // sets an HttpOnly cookie. The token is never exposed to client JS.
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        setError(body?.error ?? 'Invalid email or password.')
        setLoading(false)
        return
      }
      // Full navigation so middleware sees the freshly-set cookie.
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
