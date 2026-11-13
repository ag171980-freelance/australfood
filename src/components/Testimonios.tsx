import { Seccion } from './ui/Seccion'
import { TESTIMONIOS } from '../data/contenido'
import css from './Testimonios.module.css'

/**
 * Sección en placeholder a propósito. Los corchetes y el aviso de arriba
 * son visibles en pantalla para que nadie publique la página con
 * testimonios inventados: se completan con clientes reales o se borra la
 * sección entera desde App.tsx.
 */
export function Testimonios() {
  return (
    <Seccion
      id="testimonios"
      eyebrow="Lo que dicen los locales"
      titulo="Quiénes ya cocinan con AustralFood"
      bajada="Tres locales, tres formas distintas de usarlo."
    >
      <p className={css.aviso}>
        <strong>Pendiente</strong>
        <span>
          Contenido de ejemplo. Reemplazar por testimonios reales con nombre, local y autorización
          del cliente antes de publicar, o quitar la sección desde <code>App.tsx</code>.
        </span>
      </p>

      <ul className={css.grilla}>
        {TESTIMONIOS.map((t, i) => (
          <li key={i} className={css.item}>
            <blockquote className={css.cita}>{t.cita}</blockquote>
            <footer className={css.firma}>
              <span className={css.nombre}>{t.nombre}</span>
              {t.rol} · {t.local}
            </footer>
          </li>
        ))}
      </ul>
    </Seccion>
  )
}
