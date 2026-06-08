'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function useScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const elements = document.querySelectorAll<Element>(
      '.reveal:not(.revealed), .reveal-left:not(.revealed), .reveal-scale:not(.revealed)'
    )
    if (!elements.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [pathname])
}
