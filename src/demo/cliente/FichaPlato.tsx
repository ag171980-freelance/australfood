import { useEffect, useRef, useState } from 'react'
import type { Plato } from '../../data/menu'
import { formatoPesos } from '../../lib/formato'
import { foto } from '../lib/foto'
import css from './Cliente.module.css'

type Props = {
  plato: Plato
  onCerrar: () => void
  onAgregar: (cantidad: number, nota: string) => void
}

/**
 * La ficha del plato. Es el paso que el pedido por chat no tiene: la cantidad
 * y la aclaración se eligen acá, viajan dentro del pedido y llegan escritas a
 * la cocina en vez de repartidas en tres mensajes.
 */
export function FichaPlato({ plato, onCerrar, onAgregar }: Props) {
  const [cantidad, setCantidad] = useState(1)
  const [nota, setNota] = useState('')
  const hoja = useRef<HTMLDivElement>(null)

  useEffect(() => {
    hoja.current?.focus()
  }, [])

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [onCerrar])

  return (
    <div className={css.telon} onClick={onCerrar}>
      <div
        className={css.hoja}
        role="dialog"
        aria-modal="true"
        aria-label={plato.nombre}
        tabIndex={-1}
        ref={hoja}
        onClick={(e) => e.stopPropagation()}
      >
        {plato.imagen && (
          <img className={css.hojaFoto} src={foto(plato.imagen, 'lg')} alt="" />
        )}

        <div className={css.hojaCuerpo}>
          <h2 className={css.hojaNombre}>{plato.nombre}</h2>
          <p className={css.hojaDescripcion}>{plato.descripcion}</p>
          <p className={css.hojaPrecio}>{formatoPesos(plato.precio)}</p>

          <label className={css.etiqueta} htmlFor="ficha-nota">
            Alguna aclaración
          </label>
          <input
            id="ficha-nota"
            className={css.campo}
            value={nota}
            maxLength={60}
            placeholder="Sin sal, bien cocido, sin tomate…"
            onChange={(e) => setNota(e.target.value)}
          />

          <div className={css.hojaPie}>
            <div className={css.contador}>
              <button
                type="button"
                className={css.contadorBoton}
                aria-label="Uno menos"
                disabled={cantidad <= 1}
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
              >
                −
              </button>
              <span className={css.contadorNumero}>{cantidad}</span>
              <button
                type="button"
                className={css.contadorBoton}
                aria-label="Uno más"
                onClick={() => setCantidad((c) => c + 1)}
              >
                +
              </button>
            </div>

            <button
              type="button"
              className={css.principal}
              onClick={() => onAgregar(cantidad, nota)}
            >
              Agregar · {formatoPesos(plato.precio * cantidad)}
            </button>
          </div>

          <button type="button" className={css.cerrar} onClick={onCerrar}>
            Volver a la carta
          </button>
        </div>
      </div>
    </div>
  )
}
