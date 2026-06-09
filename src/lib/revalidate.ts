import { revalidateTag as nextRevalidateTag } from 'next/cache'

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(nextRevalidateTag as any)(tag)
}
