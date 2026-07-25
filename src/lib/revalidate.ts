import { revalidateTag } from 'next/cache'

export type CacheTag =
  | 'services'
  | 'blog'
  | 'portfolio'
  | 'jobs'
  | 'pricing'
  | 'testimonials'
  | 'team'
  | 'settings'
  | 'home'

export function revalidateContent(tag: CacheTag) {
  // Next 16 requires a cache-life profile; 'max' purges tagged entries of any
  // age, which is what on-demand invalidation after a content edit needs.
  // Calling with a single argument is deprecated and only logs a warning.
  revalidateTag(tag, 'max')
}
