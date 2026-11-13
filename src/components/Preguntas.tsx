import { Seccion } from './ui/Seccion'
import { PREGUNTAS } from '../data/contenido'
import css from './Preguntas.module.css'

export function Preguntas() {
  return (
    <Seccion
      id="preguntas"
      fondo="quemado"
      titulo="Preguntas frecuentes"
    >
      <div className={css.lista}>
        {PREGUNTAS.map((q) => (
          <details key={q.p} className={css.item}>
            <summary className={css.pregunta}>
              {q.p}
              <span className={css.signo} aria-hidden="true" />
            </summary>
            <p className={css.respuesta}>{q.r}</p>
          </details>
        ))}
      </div>
    </Seccion>
  )
}
