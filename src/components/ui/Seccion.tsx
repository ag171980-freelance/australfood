import type { ReactNode } from 'react'
import css from './Seccion.module.css'

type Props = {
  id?: string
  fondo?: 'papel' | 'quemado' | 'tinta'
  eyebrow?: string
  titulo?: ReactNode
  bajada?: ReactNode
  centrado?: boolean
  children: ReactNode
}

export function Seccion({
  id,
  fondo = 'papel',
  eyebrow,
  titulo,
  bajada,
  centrado,
  children,
}: Props) {
  const esTinta = fondo === 'tinta'

  return (
    <section
      id={id}
      className={[css.seccion, css[fondo], esTinta && 'sobre-tinta']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={css.interior}>
        {(eyebrow || titulo || bajada) && (
          <header className={[css.encabezado, centrado && css.centrado].filter(Boolean).join(' ')}>
            {eyebrow && <p className={css.eyebrow}>{eyebrow}</p>}
            {titulo && <h2 className={css.titulo}>{titulo}</h2>}
            {bajada && <p className={css.bajada}>{bajada}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  )
}
