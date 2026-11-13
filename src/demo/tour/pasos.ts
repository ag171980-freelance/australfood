import type { ApiTour } from './Tour'

export type PasoTour = {
  id: string
  titulo: string
  texto: string
  /** Valor del data-tour del elemento que se señala. Sin ancla, va centrado. */
  ancla?: string
  /** Deja el demo en la escena que este paso explica. */
  alEntrar?: (api: ApiTour) => void
}

/* El recorrido le habla al dueño del local, no al cliente que pide. Por eso
   cada paso dice qué cambia para él, y no qué botón hay que tocar.

   El orden es el mismo de los cuatro pasos de la landing: el cliente abre el
   menú, arma el pedido, paga, y el pedido aparece en el panel. Lo que agrega
   el demo es lo que sigue, que es el trabajo del local. */
export const PASOS_TOUR: PasoTour[] = [
  {
    id: 'bienvenida',
    titulo: 'Esto es un pedido, de punta a punta',
    texto:
      'A la izquierda, el celular de tu cliente. A la derecha, tu panel. Son la misma cosa mirada de los dos lados: lo que pasa de un lado aparece del otro.',
    alEntrar: (api) => {
      api.ver('cliente')
      api.irA('carta')
    },
  },
  {
    id: 'carta',
    titulo: 'Tu carta, con tus precios',
    texto:
      'Tus platos, tus fotos y qué lleva cada uno. La cargás vos desde el panel y se actualiza al toque: si se acabó la milanesa, la apagás y deja de aparecer.',
    ancla: 'carta',
    alEntrar: (api) => {
      api.ver('cliente')
      api.irA('carta')
    },
  },
  {
    id: 'plato',
    titulo: 'Las aclaraciones viajan adentro del pedido',
    texto:
      'Al tocar un plato, el cliente elige cuántos quiere y escribe lo suyo: sin sal, bien cocido, sin tomate. Eso llega escrito en la comanda y no en tres mensajes sueltos.',
    ancla: 'plato',
    alEntrar: (api) => {
      api.ver('cliente')
      api.irA('carta')
    },
  },
  {
    id: 'comanda',
    titulo: 'El pedido se arma solo',
    texto:
      'Envío o retiro, las cantidades y el total. Nadie suma a mano de este lado ni vuelve a sumar del tuyo para controlar.',
    ancla: 'comanda',
    alEntrar: (api) => {
      api.ver('cliente')
      api.asegurarPedido()
      api.irA('comanda')
    },
  },
  {
    id: 'pago',
    titulo: 'Paga antes de que la cocina empiece',
    texto:
      'Con Mercado Pago, en la misma pantalla. No hay alias que pasar ni comprobante que revisar, y la plata va a tu cuenta: AustralFood no cobra comisión por venta.',
    ancla: 'pago',
    alEntrar: (api) => {
      api.ver('cliente')
      api.asegurarPedido()
      api.irA('datos')
    },
  },
  {
    id: 'panel',
    titulo: 'Acá te entra, ya cobrado',
    texto:
      'Este es tu panel. El pedido aparece solo, con lo que pidieron, lo que aclararon, a dónde va y cuánto pagaron. Nadie lo cargó ni lo fue a buscar a ningún chat.',
    ancla: 'panel',
    alEntrar: (api) => api.ver('local'),
  },
  {
    id: 'estados',
    titulo: 'Lo movés y todos lo ven',
    texto:
      'De nuevo a la cocina, de la cocina a la calle, y entregado. Todos en el local miran la misma pantalla, y el cliente ve por dónde va sin preguntar.',
    ancla: 'lista',
    alEntrar: (api) => api.ver('local'),
  },
  {
    id: 'dia',
    titulo: 'La cuenta del día se arma sola',
    texto:
      'Lo cobrado y los pedidos que salieron, con los pedidos ya pagados. Ni planilla ni cuaderno: al cerrar ya está hecho.',
    ancla: 'dia',
    alEntrar: (api) => api.ver('local'),
  },
  {
    id: 'cierre',
    titulo: 'Ahora probalo vos',
    texto:
      'Armá un pedido desde el celular del cliente, pagalo y miralo caer en tu panel. No se guarda nada: podés romper lo que quieras.',
    alEntrar: (api) => {
      api.ver('cliente')
      api.irA('carta')
    },
  },
]
