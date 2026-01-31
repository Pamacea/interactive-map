'use client'

import { useState, useEffect } from 'react'

export function useScrollIndicator() {
  const [scrollPercent, setScrollPercent] = useState(0)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollPercent(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0)

      const sections = document.querySelectorAll('section[id]')
      sections.forEach(section => {
        const sectionTop = (section as HTMLElement).offsetTop
        if (scrollTop >= sectionTop - window.innerHeight / 2) {
          setActiveSection(section.id)
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollPercent, activeSection }
}
