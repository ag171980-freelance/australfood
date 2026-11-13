import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react'
import css from './Boton.module.css'

type Variante = 'primario' | 'secundario' | 'fantasma'

type Comun = {
  children: ReactNode
  variante?: Variante
  grande?: boolean
  bloque?: boolean
  className?: string
}

const clases = (v: Variante, grande?: boolean, bloque?: boolean, extra?: string) =>
  [
    css.boton,
    v === 'secundario' && css.secundario,
    v === 'fantasma' && css.fantasma,
    grande && css.grande,
    bloque && css.bloque,
    extra,
  ]
    .filter(Boolean)
    .join(' ')

export function Boton({
  children,
  variante = 'primario',
  grande,
  bloque,
  className,
  ...props
}: Comun & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={clases(variante, grande, bloque, className)} {...props}>
      {children}
    </button>
  )
}

export function BotonLink({
  children,
  variante = 'primario',
  grande,
  bloque,
  className,
  ...props
}: Comun & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={clases(variante, grande, bloque, className)} {...props}>
      {children}
    </a>
  )
}
