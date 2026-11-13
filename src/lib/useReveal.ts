import { useEffect, useRef, useState } from 'react'

/**
 * Marca un elemento como visible la primera vez que entra en viewport.
 * Si el sistema pide menos movimiento, devuelve visible desde el arranque
 * y nunca instala el observer.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(margen = '0px 0px -12% 0px') {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : true,
  )

  useEffect(() => {
    if (visible) return
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { rootMargin: margen, threshold: 0.05 },
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [visible, margen])

  return { ref, visible }
}
