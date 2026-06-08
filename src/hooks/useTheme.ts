'use client'

import { useState, useEffect } from 'react'

export default function useTheme() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme')
      if (saved === 'light' || saved === 'dark') setTheme(saved)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (!localStorage.getItem('theme')) setTheme(e.matches ? 'dark' : 'light')
      } catch {}
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const toggle = () => {
    const next: 'dark' | 'light' = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.add('theme-transitioning')
    setTheme(next)
    try { localStorage.setItem('theme', next) } catch {}
    setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 320)
  }

  return { theme, toggle }
}
