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
            <span className={css.austral}>Austral</span>Food
          </a>

          {/* El rótulo sigue existiendo para lectores de pantalla y para control
              por voz: lo que se va es el texto a la vista, no el nombre del
              botón. Las barras son decorativas y quedan fuera del árbol. */}
          <button
            className={[css.hamburguesa, abierto && css.cruz].filter(Boolean).join(' ')}
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="menu-nav"
          >
            <span className={css.barras} aria-hidden="true" />
            <span className="solo-lectores">{abierto ? 'Cerrar' : 'Menú'}</span>
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
