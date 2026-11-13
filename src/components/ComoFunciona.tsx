import { Seccion } from './ui/Seccion'
import { useReveal } from '../lib/useReveal'
import { PASOS } from '../data/contenido'
import css from './ComoFunciona.module.css'

const ETIQUETA = { cliente: 'Tu cliente', negocio: 'Vos' } as const

export function ComoFunciona() {
  const { ref, visible } = useReveal<HTMLOListElement>()

  return (
    <Seccion
      id="como-funciona"
      titulo="Del celular del cliente a tu cocina, sin intermediarios"
      bajada="La misma noche de recién, con sistema. El cliente resuelve todo dentro
        del menú y el pedido te llega listo: se termina la ida y vuelta que se come
        el servicio."
    >
      <ol ref={ref} className={[css.tira, visible && css.visible].filter(Boolean).join(' ')}>
        {PASOS.map((paso, i) => (
          <li key={paso.titulo} className={css.paso}>
            {/* El número es lo único que la sección puede afirmar del tiempo:
                en qué orden pasan las cosas. Cuánto tarda cada paso depende
                del cliente y no lo sabemos, así que no se dice. */}
            <div className={css.marca}>
              <p className={css.numero} aria-hidden="true">
                {i + 1}
              </p>
              <p className={[css.lado, css[paso.lado]].join(' ')}>{ETIQUETA[paso.lado]}</p>
            </div>

            <h3 className={css.titulo}>{paso.titulo}</h3>
            <p className={css.texto}>{paso.texto}</p>
          </li>
        ))}
      </ol>

      <div className={css.remate}>
        <p className={css.remateTitulo}>Vos no atendés el teléfono</p>
        <p className={css.remateTexto}>
          Las consultas, las variantes y el cobro se resuelven adentro del menú. Al panel entra solo
          lo que ya está escrito y pago.
        </p>
      </div>
    </Seccion>
  )
}
