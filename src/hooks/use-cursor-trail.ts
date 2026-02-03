'use client'

import { useEffect, useRef } from 'react'

interface TrailDot {
  element: HTMLDivElement
  x: number
  y: number
}

/**
 * PERFORMANCE OPTIMIZED: Cursor trail with throttling
 * - Reduced default length from 5 to 3
 * - Throttled animation to every 2nd frame (50% fewer renders)
 * - Uses transform instead of left/top for better performance
 */
export function useCursorTrail(length: number = 3) {
  const trailRef = useRef<TrailDot[]>([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const frameRef = useRef(0)

  useEffect(() => {
    // Skip on mobile/touch devices for performance
    if ('ontouchstart' in window) return

    const trail: TrailDot[] = []
    for (let i = 0; i < length; i++) {
      const dot = document.createElement('div')
      dot.style.cssText = `
        position: fixed;
        width: ${5 - i}px;
        height: ${5 - i}px;
        background: rgba(201, 162, 39, ${0.4 - i * 0.1});
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        will-change: transform;
      `
      document.body.appendChild(dot)
      trail.push({ element: dot, x: 0, y: 0 })
    }
    trailRef.current = trail

    let lastX = 0, lastY = 0

    const handleMouseMove = (e: MouseEvent) => {
      // Throttle: only update if moved significantly (reduces updates)
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      if (Math.abs(dx) < 2 && Math.abs(dy) < 2) return

      lastX = e.clientX
      lastY = e.clientY
      mouseRef.current = { x: e.clientX, y: e.clientY }
      trail[0].x = e.clientX
      trail[0].y = e.clientY
    }

    const animate = () => {
      frameRef.current++

      // Throttle: animate every 2nd frame
      if (frameRef.current % 2 === 0) {
        for (let i = trail.length - 1; i > 0; i--) {
          trail[i].x += (trail[i - 1].x - trail[i].x) * 0.4
          trail[i].y += (trail[i - 1].y - trail[i].y) * 0.4
        }

        trail.forEach((dot) => {
          // Use transform for better performance (GPU accelerated)
          dot.element.style.transform = `translate(${dot.x}px, ${dot.y}px)`
        })
      }

      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      trail.forEach(dot => dot.element.remove())
    }
  }, [length])
}
