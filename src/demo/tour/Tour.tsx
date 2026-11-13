import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PasoTour } from './pasos'
import css from './Tour.module.css'

/** Lo que el recorrido puede tocar del demo para armar cada escena. */
export type ApiTour = {
  irA: (etapa: 'carta' | 'comanda' | 'datos' | 'pago' | 'seguimiento') => void
  ver: (lado: 'cliente' | 'local') => void
  asegurarPedido: () => void
}

type Props = {
  pasos: PasoTour[]
  api: ApiTour
  onCerrar: () => void
}

type Lugar =
  | { modo: 'centro' }
  | { modo: 'pegado'; top: number; left: number; ancho: number }

type Foco = { top: number; left: number; ancho: number; alto: number } | null

const ANCHO_GLOBO = 340
const AIRE = 14
const BORDE = 16

/** Mientras no se haya podido medir el globo. */
const ALTO_SUPUESTO = 280

/** Abajo de esto el globo se queda abajo de todo: no hay lugar al costado. */
const ANGOSTO = 760

/** Un ancla más alta que esto no deja lugar arriba ni abajo: el globo va al lado. */
const ALTA = 0.55

const entre = (n: number, min: number, max: number) => Math.min(Math.max(n, min), Math.max(min, max))

/**
 * El recorrido guiado del demo.
 *
 * Es propio y no una librería por la misma razón que el resto de la página no
 * usa ninguna: son cuarenta líneas de posicionamiento y a cambio el globo
 * puede estar hecho del mismo papel que todo lo demás.
 *
 * Cada paso puede, antes de mostrarse, dejar el demo en la escena que explica:
 * eso lo hace el `alEntrar` del paso, no este componente, que sólo lo llama.
 */
export function Tour({ pasos, api, onCerrar }: Props) {
  const [i, setI] = useState(0)
  const [foco, setFoco] = useState<Foco>(null)
  const [lugar, setLugar] = useState<Lugar>({ modo: 'centro' })
  const globo = useRef<HTMLDivElement>(null)

  const paso = pasos[i]
  const ultimo = i === pasos.length - 1

  const cerrar = useCallback(() => onCerrar(), [onCerrar])

  /* Preparar la escena antes de medir nada: el paso puede cambiar de lado o
     de pantalla, y recién después existe el elemento que hay que señalar. */
  useEffect(() => {
    paso.alEntrar?.(api)
    // api cambia de identidad seguido; lo que manda acá es el paso.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i])

  /* Buscar el ancla y medirla. Puede no estar todavía: el paso acaba de pedir
     un cambio de pantalla y React recién va a pintarlo, así que se reintenta
     un rato antes de darse por vencido y mostrar el globo centrado.

     Los reintentos van con setTimeout y no con requestAnimationFrame, que es
     lo primero que uno escribe: rAF no corre si la pestaña no está pintando,
     y ahí el globo se queda señalando lo que señalaba el paso anterior. */
  useLayoutEffect(() => {
    let vivo = true
    let intentos = 0
    const relojes: number[] = []

    const ubicar = () => {
      if (!vivo) return

      if (!paso.ancla) {
        setFoco(null)
        setLugar({ modo: 'centro' })
        return
      }

      const el = document.querySelector<HTMLElement>(`[data-tour="${paso.ancla}"]`)
      if (!el) {
        if (intentos++ < 20) relojes.push(window.setTimeout(ubicar, 50))
        else {
          setFoco(null)
          setLugar({ modo: 'centro' })
        }
        return
      }

      el.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'auto' })

      const r = el.getBoundingClientRect()
      setFoco({ top: r.top, left: r.left, ancho: r.width, alto: r.height })

      const alto = globo.current?.offsetHeight || ALTO_SUPUESTO
      const vh = window.innerHeight
      const vw = window.innerWidth

      /* En un celular no hay costado al que correrse: el globo se queda
         abajo de todo y el ancla queda arriba, que para eso se centró. */
      if (vw < ANGOSTO) {
        setLugar({ modo: 'pegado', top: vh - alto - BORDE, left: 12, ancho: vw - 24 })
        return
      }

      const ancho = Math.min(ANCHO_GLOBO, vw - 2 * BORDE)

      /* Un ancla alta (el panel entero, la carta entera) no deja lugar ni
         arriba ni abajo: ahí el globo va al costado, del lado donde hay aire,
         para no taparle justo lo que está explicando. */
      if (r.height > vh * ALTA) {
        const izquierda = r.left + r.width / 2 < vw / 2
        setLugar({
          modo: 'pegado',
          top: entre(r.top + r.height / 2 - alto / 2, BORDE, vh - alto - BORDE),
          left: izquierda
            ? entre(r.right + AIRE, BORDE, vw - ancho - BORDE)
            : entre(r.left - AIRE - ancho, BORDE, vw - ancho - BORDE),
          ancho,
        })
        return
      }

      const cabeAbajo = vh - r.bottom > alto + AIRE + BORDE
      setLugar({
        modo: 'pegado',
        top: entre(
          cabeAbajo ? r.bottom + AIRE : r.top - AIRE - alto,
          BORDE,
          vh - alto - BORDE,
        ),
        left: entre(r.left + r.width / 2 - ancho / 2, BORDE, vw - ancho - BORDE),
        ancho,
      })
    }

    ubicar()

    /* La medida definitiva puede llegar más tarde que el primer cuadro: la
       tipografía todavía no cargó, la foto del plato tampoco, o la pantalla
       que pidió el paso recién se está montando. */
    relojes.push(window.setTimeout(ubicar, 160), window.setTimeout(ubicar, 420))

    const alMover = () => ubicar()
    window.addEventListener('resize', alMover)
    window.addEventListener('scroll', alMover, true)

    return () => {
      vivo = false
      relojes.forEach((r) => window.clearTimeout(r))
      window.removeEventListener('resize', alMover)
      window.removeEventListener('scroll', alMover, true)
    }
  }, [i, paso.ancla])

  useEffect(() => {
    globo.current?.focus()
  }, [i])

  useEffect(() => {
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') cerrar()
      if (e.key === 'ArrowRight') setI((n) => Math.min(pasos.length - 1, n + 1))
      if (e.key === 'ArrowLeft') setI((n) => Math.max(0, n - 1))
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [cerrar, pasos.length])

  const estiloGlobo =
    lugar.modo === 'centro'
      ? undefined
      : { top: `${lugar.top}px`, left: `${lugar.left}px`, width: `${lugar.ancho}px` }

  return (
    <div className={css.tour}>
      {/* El telón come los clics: durante el recorrido el demo se mira, no se
          toca. Oscurecer es trabajo del foco, que ya pinta todo lo de afuera;
          acá sólo se oscurece cuando no hay nada señalado. */}
      <div
        className={[css.telon, !foco && css.telonOscuro].filter(Boolean).join(' ')}
        onClick={cerrar}
      />

      {foco && (
        <div
          className={css.foco}
          style={{
            top: `${foco.top - 6}px`,
            left: `${foco.left - 6}px`,
            width: `${foco.ancho + 12}px`,
            height: `${foco.alto + 12}px`,
          }}
          aria-hidden="true"
        />
      )}

      <div
        className={[css.globo, lugar.modo === 'centro' && css.globoCentro]
          .filter(Boolean)
          .join(' ')}
        style={estiloGlobo}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-titulo"
        tabIndex={-1}
        ref={globo}
      >
        <p className={css.contador}>
          Paso {i + 1} de {pasos.length}
        </p>

        <h2 className={css.titulo} id="tour-titulo">
          {paso.titulo}
        </h2>
        <p className={css.texto}>{paso.texto}</p>

        <div className={css.botones}>
          {i > 0 && (
            <button type="button" className={css.atras} onClick={() => setI(i - 1)}>
              Atrás
            </button>
          )}

          <button
            type="button"
            className={css.seguir}
            onClick={() => (ultimo ? cerrar() : setI(i + 1))}
          >
            {ultimo ? 'Probarlo yo' : 'Siguiente'}
          </button>
        </div>

        {!ultimo && (
          <button type="button" className={css.saltar} onClick={cerrar}>
            Saltar el recorrido
          </button>
        )}
      </div>
    </div>
  )
}
