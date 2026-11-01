import { useEffect, useRef } from 'react'

/**
 * Thin gradient bar pinned to the top of the viewport that tracks document
 * scroll progress. Updated on requestAnimationFrame so the style write never
 * happens more than once per frame.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const bar = barRef.current
      if (!bar) return
      const scrollable = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0
      bar.style.width = `${progress}%`
    }

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule, { passive: true })

    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/5 z-50 pointer-events-none">
      <div
        ref={barRef}
        className="h-full bg-gradient-to-r from-stellar via-starblue to-lavender w-0 transition-all duration-150"
        id="scrollProgressBar"
      />
    </div>
  )
}
