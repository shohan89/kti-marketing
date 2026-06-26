import { NextResponse } from 'next/server'

// Returns the public Supabase credentials to the login page.
// NEXT_PUBLIC_* vars must be baked in at build time, but on Cloudflare CI/CD
// they are only available as runtime Worker vars (via populateProcessEnv).
// This endpoint reads them server-side (where they are always present) so the
// login page can use real values regardless of build-time availability.
export function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  return NextResponse.json({ supabaseUrl, supabaseAnonKey })
}
