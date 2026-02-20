'use client'

import { useState, useEffect, useRef } from 'react'

/**
 * PERFORMANCE OPTIMIZED: Scroll indicator with throttling
 * - Uses requestAnimationFrame for smooth updates
 * - Caches section queries to avoid repeated DOM queries
 * - Passive event listener for better scroll performance
 */
export function useScrollIndicator() {
  const [scrollPercent, setScrollPercent] = useState(0)
  const [activeSection, setActiveSection] = useState('')
  const tickingRef = useRef(false)
  const sectionsRef = useRef<{ id: string; top: number }[]>([])

  useEffect(() => {
    // Cache section positions once on mount and resize
    const updateSectionPositions = () => {
      const sections = document.querySelectorAll('section[id]')
      sectionsRef.current = Array.from(sections).map(section => ({
        id: section.id,
        top: (section as HTMLElement).offsetTop,
      }))
    }

    updateSectionPositions()
    window.addEventListener('resize', updateSectionPositions, { passive: true })

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true
        requestAnimationFrame(() => {
          const scrollTop = window.scrollY
          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          setScrollPercent(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)

          // Use cached section positions
          const halfViewport = window.innerHeight / 2
          for (let i = sectionsRef.current.length - 1; i >= 0; i--) {
            const section = sectionsRef.current[i]
            if (scrollTop >= section.top - halfViewport) {
              setActiveSection(section.id)
              break
            }
          }

          tickingRef.current = false
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateSectionPositions)
    }
  }, [])

  return { scrollPercent, activeSection }
}
