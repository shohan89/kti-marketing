/**
 * RBAC module/permission definitions.
 *
 * A "module" is a coarse admin area (Blog, Pricing, Users, ...). Every
 * AdminUser carries a `permissions` map of module -> level. Levels are
 * intentionally simple (none/view/manage) rather than full CRUD granularity —
 * every write-capable admin route in this app funnels create/edit/delete
 * through the same handful of buttons, so a single "manage" level covers all
 * of them without meaningfully reducing control.
 */

export const MODULES = [
  'media', 'homepage', 'about', 'services', 'blog', 'portfolio', 'case_studies',
  'pricing', 'website_development', 'jobs', 'applications', 'team',
  'testimonials', 'inbox', 'seo', 'settings', 'users',
] as const

export type ModuleKey = typeof MODULES[number]

export const MODULE_LABELS: Record<ModuleKey, string> = {
  media: 'Media Library',
  homepage: 'Homepage',
  about: 'About Page',
  services: 'Services',
  blog: 'Blog',
  portfolio: 'Portfolio',
  case_studies: 'Case Studies',
  pricing: 'Pricing',
  website_development: 'Website Development',
  jobs: 'Jobs',
  applications: 'Applications',
  team: 'Team',
  testimonials: 'Testimonials',
  inbox: 'Inbox',
  seo: 'SEO Manager',
  settings: 'Settings',
  users: 'Users',
}

export type PermLevel = 'none' | 'view' | 'manage'

export type PermissionMap = Record<ModuleKey, PermLevel>

function emptyMap(fill: PermLevel = 'none'): PermissionMap {
  return Object.fromEntries(MODULES.map(m => [m, fill])) as PermissionMap
}

function withLevels(manage: ModuleKey[], view: ModuleKey[] = []): PermissionMap {
  const map = emptyMap('none')
  for (const m of view) map[m] = 'view'
  for (const m of manage) map[m] = 'manage'
  return map
}

export const ROLE_PRESETS: Record<string, PermissionMap> = {
  SUPER_ADMIN: emptyMap('manage'),

  ADMIN: withLevels(
    ['media', 'homepage', 'about', 'services', 'blog', 'portfolio', 'case_studies',
      'pricing', 'website_development', 'jobs', 'applications', 'team',
      'testimonials', 'inbox', 'seo', 'users'],
    [],
  ), // settings stays 'none'

  MANAGER: withLevels(['applications', 'inbox'], ['jobs']),

  HR_MANAGER: withLevels(['jobs', 'applications'], ['team']),

  CONTENT_MANAGER: withLevels(
    ['homepage', 'about', 'services', 'blog', 'portfolio', 'case_studies', 'media', 'testimonials', 'team', 'seo'],
  ),

  MARKETING_MANAGER: withLevels(
    ['inbox', 'pricing', 'homepage', 'blog', 'testimonials', 'services'],
    ['about', 'portfolio'],
  ),

  SUPPORT_STAFF: withLevels(['inbox', 'applications']),

  VIEWER: withLevels([], MODULES.filter(m => m !== 'users' && m !== 'settings')),

  CUSTOM: emptyMap('none'),
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  HR_MANAGER: 'HR / Recruitment Manager',
  CONTENT_MANAGER: 'Content Manager',
  MARKETING_MANAGER: 'Marketing Manager',
  SUPPORT_STAFF: 'Support Staff',
  VIEWER: 'Viewer (Read Only)',
  CUSTOM: 'Custom',
}

/** Departments are only meaningful for these roles — everyone else is unrestricted. */
export const DEPARTMENT_SCOPED_ROLES = new Set(['MANAGER', 'HR_MANAGER'])

/** Ordered prefix -> module resolution for both /admin/* and /api/admin/* paths. */
const PATH_MODULE_MAP: { prefix: string; module: ModuleKey }[] = [
  { prefix: '/admin/media', module: 'media' },
  { prefix: '/api/admin/media', module: 'media' },
  { prefix: '/api/admin/upload', module: 'media' },
  { prefix: '/admin/homepage', module: 'homepage' },
  { prefix: '/admin/about', module: 'about' },
  { prefix: '/api/admin/about', module: 'about' },
  { prefix: '/admin/services', module: 'services' },
  { prefix: '/api/admin/services', module: 'services' },
  { prefix: '/admin/blog', module: 'blog' },
  { prefix: '/api/admin/blog', module: 'blog' },
  { prefix: '/admin/portfolio', module: 'portfolio' },
  { prefix: '/api/admin/portfolio', module: 'portfolio' },
  { prefix: '/admin/case-studies', module: 'case_studies' },
  { prefix: '/api/admin/case-studies', module: 'case_studies' },
  { prefix: '/admin/pricing', module: 'pricing' },
  { prefix: '/api/admin/pricing', module: 'pricing' },
  { prefix: '/api/admin/photoshoot', module: 'pricing' },
  { prefix: '/api/admin/video-packages', module: 'pricing' },
  { prefix: '/admin/website-development', module: 'website_development' },
  { prefix: '/api/admin/website-themes', module: 'website_development' },
  { prefix: '/admin/jobs', module: 'jobs' },
  { prefix: '/api/admin/jobs', module: 'jobs' },
  { prefix: '/admin/applications', module: 'applications' },
  { prefix: '/api/admin/applications', module: 'applications' },
  { prefix: '/admin/team', module: 'team' },
  { prefix: '/api/admin/team', module: 'team' },
  { prefix: '/admin/testimonials', module: 'testimonials' },
  { prefix: '/api/admin/testimonials', module: 'testimonials' },
  { prefix: '/admin/inbox', module: 'inbox' },
  { prefix: '/api/admin/inbox', module: 'inbox' },
  { prefix: '/admin/seo', module: 'seo' },
  { prefix: '/api/admin/seo', module: 'seo' },
  { prefix: '/admin/settings', module: 'settings' },
  { prefix: '/api/admin/settings', module: 'settings' },
  { prefix: '/admin/users', module: 'users' },
  { prefix: '/api/admin/users', module: 'users' },
]

/** Resolve a request pathname to a gated module, or null (dashboard root, /api/admin/me, unmapped). */
export function resolveModuleForPath(pathname: string): ModuleKey | null {
  for (const { prefix, module } of PATH_MODULE_MAP) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return module
  }
  return null
}

/** GET/HEAD only need view access; every other method is a write. */
export function getRequiredLevel(method: string): 'view' | 'manage' {
  return method === 'GET' || method === 'HEAD' ? 'view' : 'manage'
}

export function hasLevel(map: PermissionMap | null | undefined, module: ModuleKey, required: 'view' | 'manage'): boolean {
  const level = map?.[module] ?? 'none'
  if (level === 'none') return false
  if (required === 'view') return true // 'view' or 'manage' both satisfy a view requirement
  return level === 'manage'
}
