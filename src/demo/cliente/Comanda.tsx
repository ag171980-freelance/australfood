import { Ticket, TicketCabecera, TicketTotal } from '../../components/ui/Ticket'
import { LOCAL_DEMO } from '../../data/menu'
import { formatoPesos } from '../../lib/formato'
import type { Linea, Modo } from '../estado/pedido'
import { COSTO_ENVIO } from '../estado/pedido'
import css from './Cliente.module.css'

type Props = {
  lineas: Linea[]
  modo: Modo
  cuenta: { subtotal: number; envio: number; total: number; unidades: number }
  onCantidad: (key: string, cantidad: number) => void
  onModo: (modo: Modo) => void
  onVolver: () => void
  onSeguir: () => void
}

/**
 * El pedido armado, en la misma comanda que después va a ver la cocina. Las
 * cuentas se hacen solas: el cliente no suma, y el local no vuelve a sumar
 * para controlar.
 */
export function Comanda({
  lineas,
  modo,
  cuenta,
  onCantidad,
  onModo,
  onVolver,
  onSeguir,
}: Props) {
  if (lineas.length === 0) {
    return (
      <div className={css.app}>
        <Paso titulo="Tu pedido" onVolver={onVolver} />
        <div className={css.cuerpo}>
          <p className={css.vacio}>Todavía no elegiste nada. Volvé a la carta y tocá un plato.</p>
          <button type="button" className={css.principal} onClick={onVolver}>
            Ver la carta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={css.app}>
      <Paso titulo="Tu pedido" onVolver={onVolver} />

      <div className={css.cuerpo} data-tour="comanda">
        <div className={css.modo} role="group" aria-label="Cómo lo recibís">
          <button
            type="button"
            className={[css.modoBoton, modo === 'envio' && css.modoActivo].filter(Boolean).join(' ')}
            aria-pressed={modo === 'envio'}
            onClick={() => onModo('envio')}
          >
            Envío
            <span>{formatoPesos(COSTO_ENVIO)}</span>
          </button>
          <button
            type="button"
            className={[css.modoBoton, modo === 'retiro' && css.modoActivo]
              .filter(Boolean)
              .join(' ')}
            aria-pressed={modo === 'retiro'}
            onClick={() => onModo('retiro')}
          >
            Retiro
            <span>sin cargo</span>
          </button>
        </div>

        <Ticket colgado className={css.ticket}>
          <TicketCabecera local={LOCAL_DEMO.nombre} meta={`Pedido en curso · ${LOCAL_DEMO.zona}`} />

          <div className={css.lineas}>
            {lineas.map((linea) => (
              <div key={linea.key} className={css.linea}>
                <div className={css.lineaTexto}>
                  <p className={css.lineaNombre}>{linea.nombre}</p>
                  {linea.nota && <p className={css.lineaNota}>{linea.nota}</p>}
                </div>

                <div className={css.contador}>
                  <button
                    type="button"
                    className={css.contadorBoton}
                    aria-label={`Uno menos de ${linea.nombre}`}
                    onClick={() => onCantidad(linea.key, linea.cantidad - 1)}
                  >
                    −
                  </button>
                  <span className={css.contadorNumero}>{linea.cantidad}</span>
                  <button
                    type="button"
                    className={css.contadorBoton}
                    aria-label={`Uno más de ${linea.nombre}`}
                    onClick={() => onCantidad(linea.key, linea.cantidad + 1)}
                  >
                    +
                  </button>
                </div>

                <p className={css.lineaImporte}>{formatoPesos(linea.precio * linea.cantidad)}</p>
              </div>
            ))}
          </div>

          <div className={css.cuentas}>
            <p>
              <span>Subtotal</span>
              <span>{formatoPesos(cuenta.subtotal)}</span>
            </p>
            <p>
              <span>{modo === 'envio' ? 'Envío' : 'Retiro por el local'}</span>
              <span>{cuenta.envio > 0 ? formatoPesos(cuenta.envio) : 'sin cargo'}</span>
            </p>
          </div>

          <TicketTotal etiqueta="Total" importe={formatoPesos(cuenta.total)} />
        </Ticket>

        <button type="button" className={css.principal} onClick={onSeguir}>
          Continuar · {formatoPesos(cuenta.total)}
        </button>
        <button type="button" className={css.secundario} onClick={onVolver}>
          Seguir agregando
        </button>
      </div>
    </div>
  )
}

export function Paso({ titulo, onVolver }: { titulo: string; onVolver?: () => void }) {
  return (
    <header className={css.paso}>
      {onVolver ? (
        <button type="button" className={css.pasoVolver} onClick={onVolver}>
          Volver
        </button>
      ) : (
        <span className={css.pasoVolver} aria-hidden="true" />
      )}
      <h1 className={css.pasoTitulo}>{titulo}</h1>
      <span className={css.pasoVolver} aria-hidden="true" />
    </header>
  )
}
