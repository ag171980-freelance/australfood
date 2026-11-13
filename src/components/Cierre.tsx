import { BotonLink } from './ui/Boton'
import { CONTACTO } from '../data/contenido'
import { CREDITOS_FOTOS } from '../data/creditos'
import css from './Cierre.module.css'

const WA = `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(
  'Hola, quiero saber más sobre AustralFood para mi local.',
)}`

export function Cierre() {
  return (
    <footer className={`${css.cierre} sobre-tinta`}>
      <div className={css.interior}>
        <h2 className={css.titulo}>¿Arrancamos?</h2>

        <p className={css.bajada}>
          Escribinos y te dejamos el menú, el cobro y el panel andando esta semana. Si querés verlo
          funcionando antes, probá el menú acá arriba.
        </p>

        <div className={css.acciones}>
          <BotonLink href={WA} target="_blank" rel="noopener noreferrer" grande>
            Hablar por WhatsApp
          </BotonLink>
          <BotonLink href="#probalo" variante="fantasma" grande>
            Probá el menú
          </BotonLink>
        </div>
      </div>

      <div className={css.pie}>
        <p className={css.marca}>AustralFood</p>

        <nav className={css.enlacesPie} aria-label="Enlaces del pie">
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#probalo">Demo</a>
          <a href="#precios">Precios</a>
          <a href="#preguntas">Preguntas</a>
          <a href={`mailto:${CONTACTO.email}`}>{CONTACTO.email}</a>
        </nav>

        <p>© {new Date().getFullYear()} AustralFood · Buenos Aires, Argentina</p>

        {/* Las fotos son de Wikimedia Commons bajo CC BY / CC BY-SA: el crédito
            es obligatorio. Al reemplazarlas por fotos propias, se vacía
            creditos.ts y este bloque desaparece solo. */}
        {CREDITOS_FOTOS.length > 0 && (
          <p className={css.creditos}>
            Fotos de demostración:{' '}
            {CREDITOS_FOTOS.map((c, i) => (
              <span key={c.origen}>
                {i > 0 && ' · '}
                <a href={c.origen} target="_blank" rel="noopener noreferrer nofollow">
                  {c.autor}
                </a>{' '}
                ({c.licencia})
              </span>
            ))}
            {' '}vía Wikimedia Commons.
          </p>
        )}
      </div>
    </footer>
  )
}
