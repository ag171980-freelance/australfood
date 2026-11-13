import { useEffect, useState } from 'react'

/**
 * Revela líneas de a una, como una impresora térmica avanzando el papel.
 * Si el sistema pide menos movimiento, devuelve todas las líneas de entrada.
 */
export function useImpresion(total: number, intervalo = 160, activo = true) {
  const sinMovimiento =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const [impresas, setImpresas] = useState(sinMovimiento ? total : 0)

  useEffect(() => {
    if (sinMovimiento) {
      setImpresas(total)
      return
    }
    if (!activo) {
      setImpresas(0)
      return
    }

    setImpresas(0)
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setImpresas(n)
      if (n >= total) window.clearInterval(id)
    }, intervalo)

    return () => window.clearInterval(id)
  }, [total, intervalo, activo, sinMovimiento])

  return impresas
}
