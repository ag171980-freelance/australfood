import { Seccion } from './ui/Seccion'
import { BotonLink } from './ui/Boton'
import { useReveal } from '../lib/useReveal'
import { PROBLEMAS } from '../data/contenido'
import css from './Problema.module.css'

export function Problema() {
  const { ref, visible } = useReveal<HTMLOListElement>()

  return (
    <Seccion
      id="problema"
      fondo="tinta"
      titulo="Así se ve un servicio sin sistema"
      bajada="Un servicio cualquiera, con los pedidos entrando por WhatsApp. Cuatro cosas que el chat por sí solo no resuelve."
    >
      {/* La hora es el hilo: son cuatro momentos de un mismo servicio, no
          cuatro items sueltos. Ninguno describe un error del local: son las
          cosas que el pedido por chat deja a mano de alguien. */}
      <ol ref={ref} className={[css.noche, visible && css.visible].filter(Boolean).join(' ')}>
        {PROBLEMAS.map((p) => (
          <li key={p.titulo} className={css.momento}>
            <p className={css.hora}>
              <time dateTime={p.hora}>{p.hora}</time>
            </p>

            <h3 className={css.titulo}>{p.titulo}</h3>
            <p className={css.texto}>{p.texto}</p>
          </li>
        ))}
      </ol>

      {/* Cierre sin rematar con una frase: la sección plantea el escenario y
          pasa el turno. Cualquier afirmación sobre las ventas del local sería
          una suposición nuestra sobre un negocio que no conocemos. */}
      <div className={css.remate}>
        <BotonLink href="#como-funciona" variante="fantasma">
          Ver cómo funciona
        </BotonLink>
      </div>
    </Seccion>
  )
}
