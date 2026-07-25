'use client'

import { useCallback, useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'theme'
const EVENT = 'themechange'

/**
 * The theme lives outside React: an inline script in the root layout sets
 * `data-theme` on <html> before first paint (avoiding a flash), and the choice
 * persists in localStorage. useSyncExternalStore subscribes to that store
 * directly, so there is no setState-in-effect and no cascading render on mount.
 */

function readStoredTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

function getSnapshot(): Theme {
  const attr = document.documentElement.getAttribute('data-theme')
  return attr === 'light' ? 'light' : 'dark'
}

// Must match what the server renders, so hydration stays consistent.
function getServerSnapshot(): Theme {
  return 'dark'
}

function subscribe(onChange: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')

  const onSystemChange = (e: MediaQueryListEvent) => {
    // System preference only applies while the user hasn't chosen explicitly.
    if (readStoredTheme()) return
    applyTheme(e.matches ? 'dark' : 'light', { persist: false })
  }

  // Another tab changing the theme, and same-tab toggles.
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return
    const saved = readStoredTheme()
    if (saved) applyTheme(saved, { persist: false })
  }

  mq.addEventListener('change', onSystemChange)
  window.addEventListener('storage', onStorage)
  window.addEventListener(EVENT, onChange)
  return () => {
    mq.removeEventListener('change', onSystemChange)
    window.removeEventListener('storage', onStorage)
    window.removeEventListener(EVENT, onChange)
  }
}

function applyTheme(theme: Theme, { persist }: { persist: boolean }) {
  document.documentElement.setAttribute('data-theme', theme)
  if (persist) {
    try { localStorage.setItem(STORAGE_KEY, theme) } catch {}
  }
  window.dispatchEvent(new Event(EVENT))
}

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggle = useCallback(() => {
    const next: Theme = getSnapshot() === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.add('theme-transitioning')
    applyTheme(next, { persist: true })
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 320)
  }, [])

  return { theme, toggle }
}
