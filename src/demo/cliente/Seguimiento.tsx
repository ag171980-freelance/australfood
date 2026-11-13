import { formatoPesos } from '../../lib/formato'
import { ESTADOS, NOMBRE_ESTADO, type Pedido } from '../estado/pedido'
import css from './Cliente.module.css'

type Props = {
  pedido: Pedido
  onOtro: () => void
}

/**
 * Lo que el cliente ve después de pagar. No es una pantalla de cortesía: es
 * la misma fila del panel, mirada del otro lado. Cuando el local mueve el
 * pedido, esto cambia solo, y nadie tiene que avisar por dónde va.
 */
export function Seguimiento({ pedido, onOtro }: Props) {
  const actual = ESTADOS.indexOf(pedido.estado)

  return (
    <div className={css.app}>
      <div className={css.cuerpo}>
        <div className={css.gracias}>
          <p className={css.graciasTilde} aria-hidden="true">
            ✓
          </p>
          <h1 className={css.graciasTitulo}>Pedido #{pedido.numero} pagado</h1>
          <p className={css.graciasTexto}>
            Ya le entró al local.{' '}
            {pedido.modo === 'envio'
              ? `Lo llevamos a ${pedido.cliente.direccion}.`
              : 'Lo retirás por el local.'}
          </p>
        </div>

        <ol className={css.camino}>
          {ESTADOS.map((estado, i) => {
            const estadoPaso = i < actual ? 'hecho' : i === actual ? 'ahora' : 'falta'
            return (
              <li key={estado} className={css.caminoPaso} data-estado={estadoPaso}>
                <span className={css.caminoMarca} aria-hidden="true" />
                <span className={css.caminoNombre}>{NOMBRE_ESTADO[estado].cliente}</span>
              </li>
            )
          })}
        </ol>

        <p className={css.seguimientoNota}>
          Esto se mueve solo cuando el local lo mueve en su panel. Probalo: pasá a tu panel y
          empujá el pedido.
        </p>

        <div className={css.resumen}>
          <p>
            <span>Total pagado</span>
            <span>{formatoPesos(pedido.total)}</span>
          </p>
          <p>
            <span>Entró a las</span>
            <span>{pedido.hora}</span>
          </p>
        </div>

        <button type="button" className={css.secundario} onClick={onOtro}>
          Hacer otro pedido
        </button>
      </div>
    </div>
  )
}
