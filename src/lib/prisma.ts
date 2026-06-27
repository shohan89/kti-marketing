/**
 * Supabase-backed Prisma compatibility layer.
 *
 * Prisma v7 embeds its query compiler as a WASM binary and compiles it at
 * runtime. Cloudflare Workers blocks ALL dynamic WASM compilation (both
 * new WebAssembly.Module() and WebAssembly.compile()) at request time.
 * There is no workaround — only WASM pre-compiled at upload time is allowed.
 *
 * This module exports the same `prisma` object used throughout the codebase
 * but implements every operation via the Supabase JS client (HTTP/REST),
 * which is guaranteed to work in any edge/serverless environment.
 *
 * No changes needed in the 70+ files that import from '@/lib/prisma'.
 */
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ---------------------------------------------------------------------------
// Client singleton — lazy so env vars are available before first access
// ---------------------------------------------------------------------------

let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
  if (_supabase) return _supabase
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL (var) and ' +
      'SUPABASE_SERVICE_ROLE_KEY (secret) in your Cloudflare Worker.'
    )
  }
  _supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return _supabase
}

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/**
 * Maps Prisma relation field names → { table, fkHint } for embedded Supabase selects.
 * fkHint is the FK column name used for disambiguation (!fkColumn PostgREST syntax).
 */
const RELATION_MAP: Record<string, { table: string; fk: string }> = {
  job:          { table: 'JobListing',      fk: 'jobId'  },
  schemas:      { table: 'SeoSchema',       fk: 'pageId' },
  applications: { table: 'JobApplication',  fk: 'jobId'  },
}

/**
 * Maps model table names → { relation, { table, fkColumn } } for _count aggregation.
 */
const COUNT_MAP: Record<string, Record<string, { table: string; fkCol: string }>> = {
  JobListing: {
    applications: { table: 'JobApplication', fkCol: 'jobId' },
  },
}

function buildSelectString(
  select?: Record<string, unknown>,
  include?: Record<string, unknown>,
): string {
  if (!select && !include) return '*'

  const parts: string[] = []

  if (select) {
    for (const [key, value] of Object.entries(select)) {
      if (value === true) {
        parts.push(key)
      } else if (value && typeof value === 'object') {
        // nested relation select like: { job: { select: { title: true } } }
        const nested = (value as { select?: Record<string, unknown> }).select
        const rel = RELATION_MAP[key]
        const tablePart = rel ? `${key}:${rel.table}!${rel.fk}` : key
        if (nested) {
          const nestedFields = Object.entries(nested)
            .filter(([, v]) => v === true)
            .map(([k]) => k)
            .join(', ')
          parts.push(`${tablePart}(${nestedFields || '*'})`)
        } else {
          parts.push(`${tablePart}(*)`)
        }
      }
    }
  }

  if (include) {
    // Start with all scalar columns when using include
    parts.unshift('*')
    for (const [key, value] of Object.entries(include)) {
      if (key === '_count') continue // handled separately
      const rel = RELATION_MAP[key]
      const tablePart = rel ? `${key}:${rel.table}!${rel.fk}` : key
      if (value === true) {
        parts.push(`${tablePart}(*)`)
      } else if (value && typeof value === 'object') {
        const opts = value as Record<string, unknown>
        if (opts.select) {
          const fields = Object.entries(opts.select as Record<string, unknown>)
            .filter(([, v]) => v === true)
            .map(([k]) => k)
            .join(', ')
          parts.push(`${tablePart}(${fields || '*'})`)
        } else {
          // include with orderBy / take / skip — just get all fields
          // (PostgREST embedded ordering is not supported via JS client;
          //  ordering is done client-side where critical)
          parts.push(`${tablePart}(*)`)
        }
      }
    }
  }

  return parts.length > 0 ? parts.join(', ') : '*'
}

function applyWhere(q: ReturnType<SupabaseClient['from']>, where: Record<string, unknown>) {
  for (const [field, value] of Object.entries(where)) {
    if (value === null || value === undefined) {
      q = (q as any).is(field, null)
    } else if (Array.isArray(value)) {
      q = (q as any).in(field, value)
    } else if (typeof value === 'object') {
      const v = value as Record<string, unknown>
      if ('in' in v) q = (q as any).in(field, v.in)
      else if ('notIn' in v) q = (q as any).not(field, 'in', `(${(v.notIn as unknown[]).join(',')})`)
      else if ('gte' in v) q = (q as any).gte(field, v.gte)
      else if ('lte' in v) q = (q as any).lte(field, v.lte)
      else if ('gt' in v)  q = (q as any).gt(field,  v.gt)
      else if ('lt' in v)  q = (q as any).lt(field,  v.lt)
      else if ('contains' in v) q = (q as any).ilike(field, `%${v.contains}%`)
      else if ('startsWith' in v) q = (q as any).like(field, `${v.startsWith}%`)
      else if ('endsWith' in v) q = (q as any).like(field, `%${v.endsWith}`)
      else if ('not' in v) q = (q as any).neq(field, v.not)
    } else {
      q = (q as any).eq(field, value)
    }
  }
  return q
}

function applyOrderBy(q: any, orderBy: unknown): any {
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy]
  for (const ob of orders) {
    if (ob && typeof ob === 'object') {
      for (const [field, dir] of Object.entries(ob as Record<string, string>)) {
        q = q.order(field, { ascending: dir === 'asc' })
      }
    }
  }
  return q
}

/** For _count aggregation: fetch related record counts in a single batch query. */
async function attachCounts(
  tableName: string,
  rows: Record<string, unknown>[],
  countSpec: Record<string, unknown>,
): Promise<Record<string, unknown>[]> {
  const countDef = COUNT_MAP[tableName]
  if (!countDef) return rows.map(r => ({ ...r, _count: {} }))

  const ids = rows.map(r => r.id as string)
  const _count: Record<string, Record<string, number>> = {}

  for (const [field, wanted] of Object.entries(countSpec)) {
    if (!wanted) continue
    const rel = countDef[field]
    if (!rel) continue
    // Fetch only the FK column for all related records
    const { data } = await getSupabase()
      .from(rel.table)
      .select(rel.fkCol)
      .in(rel.fkCol, ids)
    for (const row of data ?? []) {
      const fkVal = (row as Record<string, string>)[rel.fkCol]
      if (!_count[fkVal]) _count[fkVal] = {}
      _count[fkVal][field] = (_count[fkVal][field] ?? 0) + 1
    }
  }

  return rows.map(r => ({
    ...r,
    _count: Object.fromEntries(
      Object.keys(countSpec).map(field => [field, _count[r.id as string]?.[field] ?? 0])
    ),
  }))
}

// ---------------------------------------------------------------------------
// Generic model factory
// ---------------------------------------------------------------------------

interface FindManyArgs {
  where?: Record<string, unknown>
  orderBy?: unknown
  take?: number
  skip?: number
  select?: Record<string, unknown>
  include?: Record<string, unknown>
}

interface FindUniqueArgs {
  where: Record<string, unknown>
  select?: Record<string, unknown>
  include?: Record<string, unknown>
}

interface UpsertArgs {
  where: Record<string, unknown>
  create: Record<string, unknown>
  update: Record<string, unknown>
  select?: Record<string, unknown>
}

// Tables whose schema has no updatedAt column (Prisma @updatedAt not present).
// All other tables need updatedAt injected by the application layer because
// Prisma's @updatedAt directive sets the value in code, not via a DB default.
const TABLES_WITHOUT_UPDATED_AT = new Set(['AdminUser', 'MediaFile'])

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeModel(tableName: string) {
  const hasUpdatedAt = !TABLES_WITHOUT_UPDATED_AT.has(tableName)
  return {
    // ── count ──────────────────────────────────────────────────────────────
    async count(args?: { where?: Record<string, unknown> }): Promise<number> {
      let q = getSupabase().from(tableName).select('*', { count: 'exact', head: true })
      if (args?.where) q = applyWhere(q as any, args.where) as any
      const { count, error } = await q
      if (error) throw new Error(`[${tableName}.count] ${error.message}`)
      return count ?? 0
    },

    // ── findMany ───────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async findMany(args?: FindManyArgs): Promise<any[]> {
      const selectStr = buildSelectString(args?.select, args?.include)
      let q: any = getSupabase().from(tableName).select(selectStr)
      if (args?.where) q = applyWhere(q, args.where)
      if (args?.orderBy) q = applyOrderBy(q, args.orderBy)
      if (args?.skip !== undefined && args?.take !== undefined) {
        q = q.range(args.skip, args.skip + args.take - 1)
      } else if (args?.skip !== undefined) {
        q = q.range(args.skip, args.skip + 9999)
      } else if (args?.take !== undefined) {
        q = q.limit(args.take)
      }
      const { data, error } = await q
      if (error) throw new Error(`[${tableName}.findMany] ${error.message}`)

      let rows = (data ?? []) as Record<string, unknown>[]

      // Handle embedded orderBy client-side (PostgREST JS client limitation)
      if (args?.include) {
        for (const [key, value] of Object.entries(args.include)) {
          if (value && typeof value === 'object' && 'orderBy' in (value as object)) {
            const ob = (value as Record<string, unknown>).orderBy as Record<string, string>
            const [field, dir] = Object.entries(ob)[0]
            rows = rows.map(r => ({
              ...r,
              [key]: Array.isArray(r[key])
                ? [...(r[key] as unknown[])].sort((a: any, b: any) =>
                    dir === 'asc' ? (a[field] > b[field] ? 1 : -1) : (a[field] < b[field] ? 1 : -1)
                  )
                : r[key],
            }))
          }
        }
      }

      // Handle _count
      const countSpec = (args?.include as Record<string, unknown> | undefined)?._count as Record<string, unknown> | undefined
      if (countSpec?.select) {
        rows = await attachCounts(tableName, rows, countSpec.select as Record<string, unknown>)
      }

      return rows
    },

    // ── findFirst ──────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async findFirst(args?: Omit<FindManyArgs, 'skip' | 'take'>): Promise<any> {
      const selectStr = buildSelectString(args?.select, args?.include)
      let q: any = getSupabase().from(tableName).select(selectStr)
      if (args?.where) q = applyWhere(q, args.where)
      if (args?.orderBy) q = applyOrderBy(q, args.orderBy)
      q = q.limit(1)
      const { data, error } = await q
      if (error) throw new Error(`[${tableName}.findFirst] ${error.message}`)
      return data?.[0] ?? null
    },

    // ── findUnique ─────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async findUnique(args: FindUniqueArgs): Promise<any> {
      const selectStr = buildSelectString(args.select, args.include)
      let q: any = getSupabase().from(tableName).select(selectStr)
      q = applyWhere(q, args.where)
      q = q.limit(1)
      const { data, error } = await q
      if (error) throw new Error(`[${tableName}.findUnique] ${error.message}`)
      return data?.[0] ?? null
    },

    // ── findUniqueOrThrow ──────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async findUniqueOrThrow(args: FindUniqueArgs): Promise<any> {
      const result = await this.findUnique(args)
      if (!result) throw new Error(`[${tableName}.findUniqueOrThrow] No record found for where: ${JSON.stringify(args.where)}`)
      return result
    },

    // ── create ─────────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async create(args: { data: Record<string, unknown>; select?: Record<string, unknown> }): Promise<any> {
      const selectStr = buildSelectString(args.select)
      const now = new Date().toISOString()
      const payload = {
        id: crypto.randomUUID(),
        ...(hasUpdatedAt ? { updatedAt: now } : {}),
        ...args.data, // caller-supplied values win
      }
      const { data, error } = await getSupabase()
        .from(tableName)
        .insert(payload)
        .select(selectStr)
        .single()
      if (error) throw new Error(`[${tableName}.create] ${error.message}`)
      return data
    },

    // ── createMany ─────────────────────────────────────────────────────────
    async createMany(args: { data: Record<string, unknown>[]; skipDuplicates?: boolean }) {
      const now = new Date().toISOString()
      const rows = args.data.map(row => ({
        id: crypto.randomUUID(),
        ...(hasUpdatedAt ? { updatedAt: now } : {}),
        ...row,
      }))
      const { error } = await getSupabase().from(tableName).insert(rows)
      if (error) throw new Error(`[${tableName}.createMany] ${error.message}`)
      return { count: args.data.length }
    },

    // ── update ─────────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async update(args: { where: Record<string, unknown>; data: Record<string, unknown>; select?: Record<string, unknown> }): Promise<any> {
      const selectStr = buildSelectString(args.select)
      const now = new Date().toISOString()
      const updateData = hasUpdatedAt ? { updatedAt: now, ...args.data } : args.data
      let q: any = getSupabase().from(tableName).update(updateData)
      q = applyWhere(q, args.where)
      const { data, error } = await q.select(selectStr).single()
      if (error) throw new Error(`[${tableName}.update] ${error.message}`)
      return data
    },

    // ── updateMany ─────────────────────────────────────────────────────────
    async updateMany(args: { where?: Record<string, unknown>; data: Record<string, unknown> }) {
      const now = new Date().toISOString()
      const updateData = hasUpdatedAt ? { updatedAt: now, ...args.data } : args.data
      let q: any = getSupabase().from(tableName).update(updateData)
      if (args.where) q = applyWhere(q, args.where)
      const { error } = await q
      if (error) throw new Error(`[${tableName}.updateMany] ${error.message}`)
      return { count: 0 }
    },

    // ── upsert ─────────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async upsert(args: UpsertArgs): Promise<any> {
      const conflictCol = Object.keys(args.where)[0] ?? 'id'
      const now = new Date().toISOString()
      // id for the insert path; updatedAt for both paths; caller data wins
      const upsertData = {
        id: crypto.randomUUID(),
        ...(hasUpdatedAt ? { updatedAt: now } : {}),
        ...args.create,
        ...args.update,
        ...args.where,
      }
      const selectStr = buildSelectString(args.select)
      const { data, error } = await getSupabase()
        .from(tableName)
        .upsert(upsertData, { onConflict: conflictCol })
        .select(selectStr)
        .single()
      if (error) throw new Error(`[${tableName}.upsert] ${error.message}`)
      return data
    },

    // ── delete ─────────────────────────────────────────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async delete(args: { where: Record<string, unknown>; select?: Record<string, unknown> }): Promise<any> {
      const selectStr = buildSelectString(args.select)
      let q: any = getSupabase().from(tableName).delete()
      q = applyWhere(q, args.where)
      const { data, error } = await q.select(selectStr).single()
      if (error) throw new Error(`[${tableName}.delete] ${error.message}`)
      return data
    },

    // ── deleteMany ─────────────────────────────────────────────────────────
    async deleteMany(args?: { where?: Record<string, unknown> }) {
      let q: any = getSupabase().from(tableName).delete()
      if (args?.where) q = applyWhere(q, args.where)
      const { error } = await q
      if (error) throw new Error(`[${tableName}.deleteMany] ${error.message}`)
      return { count: 0 }
    },
  }
}

// ---------------------------------------------------------------------------
// Exported `prisma` object — same shape as PrismaClient, backed by Supabase
// ---------------------------------------------------------------------------

export const prisma = {
  adminUser:          makeModel('AdminUser'),
  service:            makeModel('Service'),
  blogPost:           makeModel('BlogPost'),
  portfolioItem:      makeModel('PortfolioItem'),
  caseStudy:          makeModel('CaseStudy'),
  marketingPackage:   makeModel('MarketingPackage'),
  photoshootPackage:  makeModel('PhotoshootPackage'),
  calculatorService:  makeModel('CalculatorService'),
  jobListing:         makeModel('JobListing'),
  jobApplication:     makeModel('JobApplication'),
  contactSubmission:  makeModel('ContactSubmission'),
  testimonial:        makeModel('Testimonial'),
  teamMember:         makeModel('TeamMember'),
  mediaFile:          makeModel('MediaFile'),
  siteSetting:        makeModel('SiteSetting'),
  pageSeo:            makeModel('PageSeo'),
  seoSchema:          makeModel('SeoSchema'),

  /** Run multiple operations as a pseudo-transaction (no rollback — Supabase REST doesn't support transactions). */
  $transaction: async <T>(operations: Promise<T>[] | ((tx: typeof prisma) => Promise<T>)): Promise<T | T[]> => {
    if (typeof operations === 'function') return operations(prisma)
    return Promise.all(operations)
  },
}
