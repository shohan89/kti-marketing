import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
dotenv.config()

import { createClient } from '@supabase/supabase-js'

/**
 * One-time migration: rewrite raw Supabase Storage URLs stored in the DB
 *   https://<ref>.supabase.co/storage/v1/object/public/<bucket>/<file>
 * to the branded proxy form served by src/app/public/[...path]/route.ts
 *   /public/<bucket>/<file>              (absolute https://ktimarketing.agency/public/... for SEO/OG fields)
 *
 * Usage:
 *   npx tsx scripts/rewrite-storage-urls.ts           # dry run, prints what would change
 *   npx tsx scripts/rewrite-storage-urls.ts --apply   # writes changes
 */

const SITE_URL = 'https://ktimarketing.agency'
const apply = process.argv.includes('--apply')

// Table (Prisma model name) -> primary key column.
const TABLES: Record<string, string> = {
  Service: 'id', BlogPost: 'id', PortfolioItem: 'id', CaseStudy: 'id',
  MarketingPackage: 'id', PhotoshootPackage: 'id', VideoPackage: 'id',
  WebsiteTheme: 'id', CalculatorService: 'id', JobListing: 'id',
  Testimonial: 'id', TeamMember: 'id', MediaFile: 'id',
  SiteSetting: 'key', PageSeo: 'id', SeoSchema: 'id',
}
const ABSOLUTE_TABLES = new Set(['PageSeo', 'SeoSchema'])
const ABSOLUTE_COLUMN = /^(og|twitter)/i

const STORAGE_URL = /https?:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//gi

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function rewrite(text: string, absolute: boolean): string {
  return text.replace(STORAGE_URL, absolute ? `${SITE_URL}/public/` : '/public/')
}

function rewriteValue(value: unknown, absolute: boolean): unknown {
  if (typeof value === 'string') return rewrite(value, absolute)
  if (value && typeof value === 'object') {
    const before = JSON.stringify(value)
    const after = rewrite(before, absolute)
    return after === before ? value : JSON.parse(after)
  }
  return value
}

async function main() {
  console.log(apply ? 'APPLY mode' : 'DRY RUN (pass --apply to write)')
  let changedRows = 0

  for (const [table, pk] of Object.entries(TABLES)) {
    const { data, error } = await supabase.from(table).select('*')
    if (error) {
      console.warn(`[skip] ${table}: ${error.message}`)
      continue
    }

    for (const row of (data ?? []) as Record<string, unknown>[]) {
      const patch: Record<string, unknown> = {}
      for (const [col, val] of Object.entries(row)) {
        if (val == null || col === pk) continue
        const absolute = ABSOLUTE_TABLES.has(table) || ABSOLUTE_COLUMN.test(col)
        const next = rewriteValue(val, absolute)
        if (next !== val) patch[col] = next
      }
      if (Object.keys(patch).length === 0) continue

      changedRows++
      console.log(`${table} ${String(row[pk])}: ${Object.keys(patch).join(', ')}`)
      if (apply) {
        const { error: upErr } = await supabase.from(table).update(patch).eq(pk, row[pk])
        if (upErr) console.error(`  update failed: ${upErr.message}`)
      }
    }
  }

  console.log(`\n${changedRows} row(s) ${apply ? 'updated' : 'would change'}.`)
}

main().catch(e => { console.error(e); process.exit(1) })
