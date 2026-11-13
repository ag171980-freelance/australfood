import type { ReactNode, CSSProperties } from 'react'
import css from './Ticket.module.css'

export { css as ticketCss }

type TicketProps = {
  children: ReactNode
  /** Agrega la perforación del pinche arriba. */
  colgado?: boolean
  className?: string
  style?: CSSProperties
}

export function Ticket({ children, colgado, className, style }: TicketProps) {
  return (
    <article
      className={[css.ticket, colgado && css.colgado, className].filter(Boolean).join(' ')}
      style={style}
    >
      {colgado && <span className={css.agujero} aria-hidden="true" />}
      {children}
    </article>
  )
}

export function TicketCabecera({ local, meta }: { local: string; meta: string }) {
  return (
    <header className={css.cabecera}>
      <p className={css.local}>{local}</p>
      <p className={css.meta}>{meta}</p>
    </header>
  )
}

export function TicketFila({
  nombre,
  importe,
  className,
}: {
  nombre: ReactNode
  importe: ReactNode
  className?: string
}) {
  return (
    <div className={[css.fila, className].filter(Boolean).join(' ')}>
      <span className={css.filaNombre}>{nombre}</span>
      <span className={css.filaImporte}>{importe}</span>
    </div>
  )
}

export function TicketTotal({ etiqueta, importe }: { etiqueta: string; importe: string }) {
  return (
    <div className={css.total}>
      <span>{etiqueta}</span>
      <span>{importe}</span>
    </div>
  )
}
