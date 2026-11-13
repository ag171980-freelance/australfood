import { useEffect, useRef, useState } from 'react'
import { BotonLink } from './ui/Boton'
import css from './Nav.module.css'

const ENLACES = [
  { href: '#como-funciona', texto: 'Cómo funciona' },
  { href: '#probalo', texto: 'Probalo' },
  { href: '#precios', texto: 'Precios' },
  { href: '#preguntas', texto: 'Preguntas' },
]

export function Nav() {
  const [pegada, setPegada] = useState(false)
  const [abierto, setAbierto] = useState(false)
  const centinela = useRef<HTMLDivElement>(null)

  // El nav se marca cuando el centinela de arriba de todo sale del viewport.
  // Un observer en vez de un listener de scroll: no corre en cada frame.
  useEffect(() => {
    const el = centinela.current
    if (!el) return
    const obs = new IntersectionObserver(([entrada]) => setPegada(!entrada.isIntersecting))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Escape cierra el menú móvil.
  useEffect(() => {
    if (!abierto) return
    const alTeclear = (e: KeyboardEvent) => e.key === 'Escape' && setAbierto(false)
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [abierto])

  return (
    <>
      <div ref={centinela} className={css.centinela} aria-hidden="true" />

      <nav className={[css.nav, pegada && css.pegada].filter(Boolean).join(' ')}>
        <div className={css.interior}>
          <a href="#inicio" className={css.marca}>
            AustralFood
          </a>

          <button
            className={css.hamburguesa}
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-nav"
          >
            {abierto ? 'Cerrar' : 'Menú'}
          </button>

          <div
            id="menu-nav"
            className={[css.enlaces, abierto && css.abierto].filter(Boolean).join(' ')}
          >
            {ENLACES.map((e) => (
              <a key={e.href} href={e.href} className={css.enlace} onClick={() => setAbierto(false)}>
                {e.texto}
              </a>
            ))}
            <BotonLink href="#precios" className={css.accion} onClick={() => setAbierto(false)}>
              Ver precios
            </BotonLink>
          </div>
        </div>
      </nav>
    </>
  )
}
