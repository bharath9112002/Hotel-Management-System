import { useEffect, useRef, useState } from 'react'

// Tracks an element's rendered width so SVG charts can draw at real pixel
// size (keeping 2px lines and round markers undistorted) as the layout resizes.
export function useElementWidth() {
  const ref = useRef(null)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return [ref, width]
}
