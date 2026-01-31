'use client'

import { useEffect, useRef } from 'react'

interface TrailDot {
  element: HTMLDivElement
  x: number
  y: number
}

export function useCursorTrail(length: number = 5) {
  const trailRef = useRef<TrailDot[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const trail: TrailDot[] = []
    for (let i = 0; i < length; i++) {
      const dot = document.createElement('div')
      dot.style.cssText = `
        position: fixed;
        width: ${6 - i}px;
        height: ${6 - i}px;
        background: rgba(201, 162, 39, ${0.5 - i * 0.1});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.1s;
      `
      document.body.appendChild(dot)
      trail.push({ element: dot, x: 0, y: 0 })
    }
    trailRef.current = trail

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
      trail[0].x = e.clientX
      trail[0].y = e.clientY
    }

    const animate = () => {
      for (let i = trail.length - 1; i > 0; i--) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.3
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.3
      }

      trail.forEach((dot) => {
        dot.element.style.left = `${dot.x - 3}px`
        dot.element.style.top = `${dot.y - 3}px`
      })

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      trail.forEach(dot => dot.element.remove())
    }
  }, [length])
}
