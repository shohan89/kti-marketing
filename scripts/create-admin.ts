import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { createClient } from '@supabase/supabase-js'

const email = process.argv[2]
const password = process.argv[3]

if (!email || !password) {
  console.error('Usage: npx tsx scripts/create-admin.ts <email> <password>')
  console.error('Example: npx tsx scripts/create-admin.ts admin@ktimarketing.com MyPassword123!')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function main() {
  console.log(`Creating admin user: ${email}`)

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }

  console.log('\n✅ Admin user created successfully!')
  console.log(`   Email:    ${email}`)
  console.log(`   Password: ${password}`)
  console.log(`   User ID:  ${data.user.id}`)
  console.log('\nLogin at: http://localhost:3002/admin/login')
}

main()
