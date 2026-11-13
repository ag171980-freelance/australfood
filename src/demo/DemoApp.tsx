import { useCallback, useMemo, useReducer, useState } from 'react'
import { Carta } from './cliente/Carta'
import { Comanda } from './cliente/Comanda'
import { Datos } from './cliente/Datos'
import { Pago } from './cliente/Pago'
import { Seguimiento } from './cliente/Seguimiento'
import { Panel } from './local/Panel'
import { Tour } from './tour/Tour'
import { PASOS_TOUR } from './tour/pasos'
import { avisar } from './lib/avisar'
import {
  CARRITO_VACIO,
  CLIENTE_VACIO,
  carrito,
  horaCorta,
  PEDIDOS_PREVIOS,
  totales,
  type Cliente,
  type EstadoPedido,
  type Pedido,
} from './estado/pedido'
import css from './Demo.module.css'

/** Las pantallas por las que pasa el cliente, en orden. */
export type Etapa = 'carta' | 'comanda' | 'datos' | 'pago' | 'seguimiento'

/** Qué lado se ve. Sólo manda en pantallas angostas: en ancha se ven los dos. */
export type Vista = 'cliente' | 'local'

const PRIMER_NUMERO = 142

export function DemoApp() {
  const [pedido, despachar] = useReducer(carrito, CARRITO_VACIO)
  const [etapa, setEtapa] = useState<Etapa>('carta')
  const [cliente, setCliente] = useState<Cliente>(CLIENTE_VACIO)
  const [vista, setVista] = useState<Vista>('cliente')

  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_PREVIOS)
  const [numero, setNumero] = useState(PRIMER_NUMERO)
  const [mio, setMio] = useState<number | null>(null)

  const [tour, setTour] = useState(true)

  const cuenta = useMemo(() => totales(pedido), [pedido])
  const miPedido = useMemo(() => pedidos.find((p) => p.numero === mio) ?? null, [pedidos, mio])

  /* El pago aprobado es el momento del circuito que vale la pena mirar: el
     pedido deja el teléfono del cliente y aparece en el panel, ya cobrado. */
  const confirmar = useCallback(() => {
    const nuevo: Pedido = {
      numero,
      lineas: pedido.lineas,
      modo: pedido.modo,
      subtotal: cuenta.subtotal,
      envio: cuenta.envio,
      total: cuenta.total,
      cliente,
      estado: 'nuevo',
      hora: horaCorta(),
      propio: true,
    }

    setPedidos((previos) => [nuevo, ...previos])
    setMio(numero)
    setNumero((n) => n + 1)
    despachar({ tipo: 'vaciar' })
    setEtapa('seguimiento')
    avisar()
  }, [numero, pedido.lineas, pedido.modo, cuenta, cliente])

  const mover = useCallback((numeroPedido: number, estado: EstadoPedido) => {
    setPedidos((previos) => previos.map((p) => (p.numero === numeroPedido ? { ...p, estado } : p)))
  }, [])

  /* Volver a empezar sin recargar. El panel conserva lo que ya pasó, porque
     en un local tampoco se borra lo del día. */
  const otroPedido = useCallback(() => {
    despachar({ tipo: 'vaciar' })
    setCliente(CLIENTE_VACIO)
    setMio(null)
    setEtapa('carta')
    setVista('cliente')
  }, [])

  /* Lo que el recorrido guiado puede tocar. Se lo pasa el tablero y no el
     Tour por su cuenta: el tour explica, no es dueño del estado. */
  const apiTour = useMemo(
    () => ({
      irA: (siguiente: Etapa) => setEtapa(siguiente),
      ver: (lado: Vista) => setVista(lado),
      /* Para explicar la comanda hace falta una comanda. Si el visitante ya
         eligió algo, se respeta lo suyo. */
      asegurarPedido: () => {
        if (pedido.lineas.length > 0) return
        despachar({ tipo: 'agregar', platoId: 'mila-napo', cantidad: 1, nota: 'Sin sal' })
        despachar({ tipo: 'agregar', platoId: 'gaseosa', cantidad: 2, nota: '' })
      },
    }),
    [pedido.lineas.length],
  )

  const hayNuevo = miPedido?.estado === 'nuevo'

  return (
    <div className={css.demo}>
      <header className={css.barra}>
        <a className={css.volver} href="../">
          Volver<span className={css.largo}> al sitio</span>
        </a>

        <p className={css.marca}>
          <span className={css.austral}>Austral</span>Food
          <span className={css.sello}>Demo</span>
        </p>

        <button type="button" className={css.recorrido} onClick={() => setTour(true)}>
          <span className={css.largo}>Ver el </span>Recorrido
        </button>
      </header>

      {/* Las pestañas son el único modo de ver los dos lados en un celular.
          Arriba de 1040px el tablero muestra los dos a la vez y esto se va. */}
      <div className={css.pestanas} role="tablist" aria-label="Lados del mostrador">
        <button
          type="button"
          role="tab"
          aria-selected={vista === 'cliente'}
          className={[css.pestana, vista === 'cliente' && css.pestanaActiva]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setVista('cliente')}
        >
          El celular del cliente
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={vista === 'local'}
          className={[css.pestana, vista === 'local' && css.pestanaActiva].filter(Boolean).join(' ')}
          onClick={() => setVista('local')}
        >
          Tu panel
          {hayNuevo && <span className={css.punto} aria-label="con un pedido nuevo" />}
        </button>
      </div>

      <div className={css.tablero} data-vista={vista}>
        <section className={css.lado} aria-label="El celular del cliente">
          <p className={css.rotulo}>Lo que ve tu cliente</p>

          <div className={css.telefono} data-tour="telefono">
            <div className={css.pantalla}>
              {etapa === 'carta' && (
                <Carta
                  unidades={cuenta.unidades}
                  total={cuenta.total}
                  onAgregar={(platoId, cantidad, nota) =>
                    despachar({ tipo: 'agregar', platoId, cantidad, nota })
                  }
                  onVerPedido={() => setEtapa('comanda')}
                />
              )}

              {etapa === 'comanda' && (
                <Comanda
                  lineas={pedido.lineas}
                  modo={pedido.modo}
                  cuenta={cuenta}
                  onCantidad={(key, cantidad) => despachar({ tipo: 'cantidad', key, cantidad })}
                  onModo={(modo) => despachar({ tipo: 'modo', modo })}
                  onVolver={() => setEtapa('carta')}
                  onSeguir={() => setEtapa('datos')}
                />
              )}

              {etapa === 'datos' && (
                <Datos
                  cliente={cliente}
                  modo={pedido.modo}
                  total={cuenta.total}
                  onCambiar={setCliente}
                  onVolver={() => setEtapa('comanda')}
                  onPagar={() => setEtapa('pago')}
                />
              )}

              {etapa === 'pago' && (
                <Pago
                  total={cuenta.total}
                  numero={numero}
                  onAprobado={confirmar}
                  onVolver={() => setEtapa('datos')}
                />
              )}

              {etapa === 'seguimiento' && miPedido && (
                <Seguimiento pedido={miPedido} onOtro={otroPedido} />
              )}
            </div>
          </div>
        </section>

        <section className={css.lado} aria-label="Tu panel">
          <p className={css.rotulo}>Lo que ves vos</p>
          <Panel pedidos={pedidos} mio={mio} onMover={mover} />
        </section>
      </div>

      {tour && <Tour pasos={PASOS_TOUR} api={apiTour} onCerrar={() => setTour(false)} />}
    </div>
  )
}
