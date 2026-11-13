import { useMemo } from 'react'
import { formatoPesos } from '../../lib/formato'
import { useImpresion } from '../../lib/useImpresion'
import {
  ACCION_ESTADO,
  ESTADOS,
  NOMBRE_ESTADO,
  CERRADOS_PREVIOS,
  VENDIDO_PREVIO,
  type EstadoPedido,
  type Pedido,
} from '../estado/pedido'
import css from './Panel.module.css'

type Props = {
  pedidos: Pedido[]
  /** El número del pedido que hizo el visitante, para resaltarlo. */
  mio: number | null
  onMover: (numero: number, estado: EstadoPedido) => void
}

/**
 * El panel del local. Los pedidos entran acá ya cobrados y escritos, y se
 * empujan de estado desde la misma fila. Es la pantalla que mira la cocina:
 * por eso lo primero es el pedido, no un gráfico.
 */
export function Panel({ pedidos, mio, onMover }: Props) {
  const enCurso = pedidos.filter((p) => p.estado !== 'entregado')
  const entregados = pedidos.filter((p) => p.estado === 'entregado')

  const cobrado = useMemo(
    () => VENDIDO_PREVIO + pedidos.reduce((suma, p) => suma + p.total, 0),
    [pedidos],
  )

  const porEstado = (estado: EstadoPedido) => pedidos.filter((p) => p.estado === estado).length

  return (
    <div className={css.panel} data-tour="panel">
      <header className={css.cabecera}>
        <p className={css.titulo}>Pedidos de hoy</p>
        <p className={css.local}>Bodegón Santa Rita · abierto</p>
      </header>

      <dl className={css.cuenta} data-tour="dia">
        <div>
          <dt>Cobrado hoy</dt>
          <dd className={css.cuentaPlata}>{formatoPesos(cobrado)}</dd>
        </div>
        <div>
          <dt>Pedidos</dt>
          <dd>{pedidos.length + CERRADOS_PREVIOS}</dd>
        </div>
        <div>
          <dt>En curso</dt>
          <dd>{enCurso.length}</dd>
        </div>
      </dl>

      <div className={css.semaforo}>
        {ESTADOS.filter((e) => e !== 'entregado').map((estado) => (
          <span
            key={estado}
            className={css.semaforoItem}
            data-estado={estado}
            data-hay={porEstado(estado) > 0 ? 'si' : 'no'}
          >
            {NOMBRE_ESTADO[estado].local}
            <b>{porEstado(estado)}</b>
          </span>
        ))}
      </div>

      <div className={css.lista} data-tour="lista">
        {enCurso.length === 0 && (
          <p className={css.vacio}>
            No hay pedidos en curso. Armá uno desde el celular del cliente y miralo caer acá.
          </p>
        )}

        {enCurso.map((pedido) => (
          <Comanda
            key={pedido.numero}
            pedido={pedido}
            propio={pedido.numero === mio}
            onMover={onMover}
          />
        ))}

        {entregados.length > 0 && (
          <div className={css.cerrados}>
            <p className={css.cerradosTitulo}>Cerrados</p>
            {entregados.map((pedido) => (
              <p key={pedido.numero} className={css.cerradoFila}>
                <span>
                  #{pedido.numero} · {pedido.cliente.nombre}
                </span>
                <span>{formatoPesos(pedido.total)}</span>
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function Comanda({
  pedido,
  propio,
  onMover,
}: {
  pedido: Pedido
  propio: boolean
  onMover: (numero: number, estado: EstadoPedido) => void
}) {
  /* El pedido del visitante se imprime renglón a renglón, como sale de la
     impresora de la cocina. Los que ya estaban salen enteros: no acaban de
     entrar. */
  const impresas = useImpresion(pedido.lineas.length, 140, propio)
  const visibles = propio ? pedido.lineas.slice(0, impresas) : pedido.lineas

  const siguiente = ESTADOS[ESTADOS.indexOf(pedido.estado) + 1]
  const accion = ACCION_ESTADO[pedido.estado]

  return (
    <article
      className={[css.comanda, propio && css.comandaPropia].filter(Boolean).join(' ')}
      data-tour={propio ? 'comandaPropia' : undefined}
    >
      <header className={css.comandaCabecera}>
        <span className={css.numero}>#{pedido.numero}</span>
        <span className={css.hora}>{pedido.hora}</span>
        <span className={css.estado} data-estado={pedido.estado}>
          {NOMBRE_ESTADO[pedido.estado].local}
        </span>
      </header>

      <p className={css.quien}>
        {pedido.cliente.nombre || 'Sin nombre'} · {pedido.cliente.whatsapp || 'sin teléfono'}
      </p>
      <p className={css.como}>
        {pedido.modo === 'envio' ? `Envío a ${pedido.cliente.direccion}` : 'Retira por el local'}
        {pedido.cliente.nota && ` · ${pedido.cliente.nota}`}
      </p>

      <ul className={css.lineas}>
        {visibles.map((linea) => (
          <li key={linea.key} className={css.linea}>
            <span className={css.cantidad}>{linea.cantidad}</span>
            <span className={css.plato}>
              {linea.nombre}
              {linea.nota && <em className={css.nota}>{linea.nota}</em>}
            </span>
            <span className={css.importe}>{formatoPesos(linea.precio * linea.cantidad)}</span>
          </li>
        ))}
      </ul>

      <footer className={css.comandaPie}>
        <p className={css.cobrado}>
          <span className={css.sello}>Pagado</span>
          {formatoPesos(pedido.total)}
        </p>

        {accion && siguiente && (
          <button
            type="button"
            className={css.avanzar}
            onClick={() => onMover(pedido.numero, siguiente)}
          >
            {accion}
          </button>
        )}
      </footer>
    </article>
  )
}
