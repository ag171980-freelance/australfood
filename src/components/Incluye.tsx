import { Seccion } from './ui/Seccion'
import { INCLUYE } from '../data/contenido'
import css from './Incluye.module.css'

export function Incluye() {
  return (
    <Seccion
      id="incluye"
      titulo="Todo esto entra en la suscripción"
    >
      {/* Bento de cinco celdas para cinco items: 3+3 arriba y 2+2+2 abajo, que
          son las seis columnas justas en las dos filas. La grilla tiene
          exactamente el contenido que hay, sin huecos. */}
      <ul className={css.bento}>
        {INCLUYE.map((i) => (
          <li
            key={i.titulo}
            className={css.celda}
            style={{ '--span': i.span } as React.CSSProperties}
          >
            <h3 className={css.titulo}>{i.titulo}</h3>
            <p className={css.texto}>{i.texto}</p>
          </li>
        ))}
      </ul>
    </Seccion>
  )
}
