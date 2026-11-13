import { useState } from 'react'
import { LOCAL_DEMO } from '../../data/menu'
import { formatoPesos } from '../../lib/formato'
import { Paso } from './Comanda'
import css from './Cliente.module.css'

type Props = {
  total: number
  numero: number
  onAprobado: () => void
  onVolver: () => void
}

/**
 * La pasarela, simulada. En el sistema de verdad acá se sale a Mercado Pago
 * y se vuelve con la respuesta; lo que importa de esta pantalla es lo que
 * pasa después, que es lo mismo en los dos casos.
 *
 * El rechazo está a propósito: un pago que no entra es parte del circuito, y
 * el local tiene que poder verlo sin que se le mezcle con los pedidos buenos.
 */
export function Pago({ total, numero, onAprobado, onVolver }: Props) {
  const [rechazado, setRechazado] = useState(false)

  return (
    <div className={css.app}>
      <Paso titulo="Pago" onVolver={onVolver} />

      <div className={css.cuerpo}>
        <div className={css.pasarela}>
          <p className={css.pasarelaSello}>Pasarela simulada</p>
          <p className={css.pasarelaMonto}>{formatoPesos(total)}</p>
          <p className={css.pasarelaRef}>
            Pedido #{numero} · {LOCAL_DEMO.nombre}
          </p>
          <p className={css.pasarelaNota}>
            Acá va el checkout de Mercado Pago. Elegí con qué respuesta volver.
          </p>
        </div>

        {rechazado && (
          <p className={css.aviso}>
            El pago no entró. El pedido no se manda a la cocina: para el local es como si no
            hubiera existido.
          </p>
        )}

        <button type="button" className={css.principal} onClick={onAprobado}>
          Volver con el pago aprobado
        </button>
        <button type="button" className={css.secundario} onClick={() => setRechazado(true)}>
          Volver con el pago rechazado
        </button>
      </div>
    </div>
  )
}
