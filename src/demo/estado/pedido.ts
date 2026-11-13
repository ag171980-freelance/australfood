/* El circuito de un pedido, del lado del cliente y del lado del local.
   Todo vive en memoria: esto es una demostración, no el producto. Cuando se
   conecte la API en PHP, lo que cambia es de dónde salen estos datos, no la
   forma que tienen. */

import { PLATOS } from '../../data/menu'

export type Modo = 'envio' | 'retiro'

/** Cuánto sale el envío en el local de demostración. */
export const COSTO_ENVIO = 1200

export type Linea = {
  /** Mismo plato con distinta aclaración son dos líneas, igual que en la comanda. */
  key: string
  platoId: string
  nombre: string
  precio: number
  cantidad: number
  nota: string
}

/* Los estados por los que pasa un pedido, en el orden en que se trabaja.
   'nuevo' es un pedido ya cobrado que todavía nadie tocó. */
export type EstadoPedido = 'nuevo' | 'cocina' | 'reparto' | 'entregado'

export const ESTADOS: EstadoPedido[] = ['nuevo', 'cocina', 'reparto', 'entregado']

/** Cómo se llama cada estado de cada lado del mostrador. */
export const NOMBRE_ESTADO: Record<EstadoPedido, { local: string; cliente: string }> = {
  nuevo: { local: 'Nuevo', cliente: 'Recibido y cobrado' },
  cocina: { local: 'En la cocina', cliente: 'En preparación' },
  reparto: { local: 'Para entregar', cliente: 'En camino' },
  entregado: { local: 'Entregado', cliente: 'Entregado' },
}

/** El texto del botón que empuja el pedido al estado siguiente. */
export const ACCION_ESTADO: Record<EstadoPedido, string | null> = {
  nuevo: 'Pasar a cocina',
  cocina: 'Salió',
  reparto: 'Entregado',
  entregado: null,
}

export type Cliente = {
  nombre: string
  whatsapp: string
  direccion: string
  nota: string
}

export type Pedido = {
  numero: number
  lineas: Linea[]
  modo: Modo
  subtotal: number
  envio: number
  total: number
  cliente: Cliente
  estado: EstadoPedido
  /** Hora de entrada, para la comanda y para el panel. */
  hora: string
  /** El del visitante. El panel lo resalta: es el que acaba de hacer. */
  propio: boolean
}

export const CLIENTE_VACIO: Cliente = { nombre: '', whatsapp: '', direccion: '', nota: '' }

/* --- Carrito ------------------------------------------------------------ */

export type Carrito = { lineas: Linea[]; modo: Modo }

export const CARRITO_VACIO: Carrito = { lineas: [], modo: 'envio' }

export type AccionCarrito =
  | { tipo: 'agregar'; platoId: string; cantidad: number; nota: string }
  | { tipo: 'cantidad'; key: string; cantidad: number }
  | { tipo: 'quitar'; key: string }
  | { tipo: 'modo'; modo: Modo }
  | { tipo: 'vaciar' }

const claveDe = (platoId: string, nota: string) => `${platoId}|${nota.trim().toLowerCase()}`

export function carrito(estado: Carrito, accion: AccionCarrito): Carrito {
  switch (accion.tipo) {
    case 'agregar': {
      const plato = PLATOS.find((p) => p.id === accion.platoId)
      if (!plato) return estado

      const key = claveDe(accion.platoId, accion.nota)
      const ya = estado.lineas.find((l) => l.key === key)
      if (ya) {
        return {
          ...estado,
          lineas: estado.lineas.map((l) =>
            l.key === key ? { ...l, cantidad: l.cantidad + accion.cantidad } : l,
          ),
        }
      }

      return {
        ...estado,
        lineas: [
          ...estado.lineas,
          {
            key,
            platoId: plato.id,
            nombre: plato.nombre,
            precio: plato.precio,
            cantidad: accion.cantidad,
            nota: accion.nota.trim(),
          },
        ],
      }
    }

    case 'cantidad': {
      if (accion.cantidad <= 0) {
        return { ...estado, lineas: estado.lineas.filter((l) => l.key !== accion.key) }
      }
      return {
        ...estado,
        lineas: estado.lineas.map((l) =>
          l.key === accion.key ? { ...l, cantidad: accion.cantidad } : l,
        ),
      }
    }

    case 'quitar':
      return { ...estado, lineas: estado.lineas.filter((l) => l.key !== accion.key) }

    case 'modo':
      return { ...estado, modo: accion.modo }

    case 'vaciar':
      return { ...CARRITO_VACIO, modo: estado.modo }

    default:
      return estado
  }
}

/* --- Cuentas ------------------------------------------------------------ */

export function totales(estado: Carrito) {
  const subtotal = estado.lineas.reduce((suma, l) => suma + l.precio * l.cantidad, 0)
  const envio = estado.modo === 'envio' && subtotal > 0 ? COSTO_ENVIO : 0
  const unidades = estado.lineas.reduce((suma, l) => suma + l.cantidad, 0)
  return { subtotal, envio, total: subtotal + envio, unidades }
}

export function horaCorta(fecha = new Date()): string {
  return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/* --- Lo que ya había en el panel ---------------------------------------- */

/* Dos pedidos de otra gente para que el panel no arranque vacío: un panel
   vacío no muestra cómo se trabaja. Los nombres y los montos son inventados,
   como todo el local de demostración. */
export const PEDIDOS_PREVIOS: Pedido[] = [
  {
    numero: 141,
    lineas: [
      { key: 'prev-1', platoId: 'provoleta', nombre: 'Provoleta', precio: 5600, cantidad: 1, nota: '' },
      { key: 'prev-2', platoId: 'bife-chorizo', nombre: 'Bife de chorizo', precio: 13500, cantidad: 1, nota: 'A punto' },
    ],
    modo: 'retiro',
    subtotal: 19100,
    envio: 0,
    total: 19100,
    cliente: { nombre: 'Mariela Bentancur', whatsapp: '11 4412 7730', direccion: '', nota: '' },
    estado: 'cocina',
    hora: '20:46',
    propio: false,
  },
  {
    numero: 140,
    lineas: [
      { key: 'prev-3', platoId: 'empanadas', nombre: 'Empanadas de carne (6)', precio: 7200, cantidad: 1, nota: 'Sin aceituna' },
    ],
    modo: 'envio',
    subtotal: 7200,
    envio: COSTO_ENVIO,
    total: 8400,
    cliente: {
      nombre: 'Darío Pacheco',
      whatsapp: '11 6829 3145',
      direccion: 'Murillo 1043, 4º B',
      nota: 'Timbre no anda, llamar',
    },
    estado: 'reparto',
    hora: '20:38',
    propio: false,
  },
]

/* Lo que el local ya cerró antes de que el visitante entre. Son dos números
   inventados, como el resto del local de demostración, y van juntos: el monto
   es de esos pedidos y de ningún otro, así que la línea del día cierra. */
export const CERRADOS_PREVIOS = 12
export const VENDIDO_PREVIO = 164500
