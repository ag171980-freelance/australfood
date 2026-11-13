/* Contenido de la landing. Separado de los componentes para que después
   pueda venir de la API en PHP sin tocar el markup. */

export const CONTACTO = {
  whatsapp: '5491100000000', // ← reemplazar por el número real de AustralFood
  email: 'hola@australfood.com.ar', // ← reemplazar
  /** Sin uso: la demo vive en la propia landing, en la sección #probalo. */
  demo: '#probalo',
} as const

/* --- Precios ------------------------------------------------------------ */

const MENSUAL = 30000

export const PRECIOS = {
  mensual: MENSUAL,
  /** Lo que sale pagar mes a mes durante un año. El anual se mide contra esto. */
  anualLista: MENSUAL * 12,
  anualPromo: 250000,
  /** Alta única, sin suscripción. */
  unico: 300000,
} as const

/** 250.000 / 12 = 20.833 por mes. */
export const ANUAL_POR_MES = Math.round(PRECIOS.anualPromo / 12)

/* 360.000 - 250.000 = 110.000. Son 3,67 meses de 30.000, así que no se puede
   decir "tres meses" ni "cuatro": la tarjeta dice "más de tres meses", que es
   lo que se sostiene sin redondear a favor nuestro. */
export const AHORRO_ANUAL = PRECIOS.anualLista - PRECIOS.anualPromo

/** 110.000 sobre 360.000 = 30,6%, que se anuncia como 31%. */
export const DESCUENTO_ANUAL = Math.round((AHORRO_ANUAL / PRECIOS.anualLista) * 100)

/* Los tres planes contratables, en un solo lugar: las tarjetas de precio los
   ofrecen y el formulario los lista en su select. Los ids viajan al backend,
   así que cambiarlos obliga a tocar también la validación de contacto.php. */
export const PLANES = [
  { id: 'mensual', etiqueta: 'Plan mensual' },
  { id: 'anual', etiqueta: 'Plan anual' },
  { id: 'unico', etiqueta: 'Pago único' },
] as const

export type PlanId = (typeof PLANES)[number]['id']

/* --- El problema -------------------------------------------------------- */

export const PROBLEMAS = [
  {
    hora: '20:10',
    titulo: 'Cada pedido abre una conversación',
    texto:
      'Qué hay, cuánto sale, cuánto tarda, cómo se paga. Alguien del local tiene que estar con el celular en la mano contestando mientras la cocina trabaja.',
  },
  {
    hora: '20:24',
    titulo: 'El pedido queda repartido en el chat',
    texto:
      'Arranca con una milanesa, tres mensajes después suma papas y al final aclara que va sin sal. Para pasarlo a la cocina hay que leer la conversación entera y armarlo.',
  },
  {
    hora: '20:38',
    titulo: 'El chat no cobra',
    texto:
      'Pasás el alias, esperás el comprobante y lo revisás a mano. O el pedido sale igual y el cobro queda para cuando el cliente aparezca.',
  },
  {
    hora: '23:55',
    titulo: 'El número del día está adentro de los chats',
    texto:
      'Lo que se vendió quedó en las conversaciones. Para tener el total hay que volver a leerlas, o haberlo anotado aparte mientras entraban los pedidos.',
  },
]

/* --- Cómo funciona ------------------------------------------------------ */

/** De qué lado del mostrador está la ventaja de cada paso. */
export type Lado = 'cliente' | 'negocio'

/* Los cuatro momentos de un mismo pedido, en orden.

   SIN HORAS NI DURACIONES, a propósito. Cuánto tarda alguien en mirar la
   carta, decidirse y pagar no lo sabemos, y ponerle un número exacto es
   inventar un dato y venderlo como medición. El orden sí lo sabemos: es lo
   único que afirma esta lista.

   Todo lo que no sea un momento del pedido no entra acá. Administrar el
   menú o seguir el estado del pedido son capacidades permanentes, no pasos:
   van en INCLUYE, que es donde se listan. */
export const PASOS: { lado: Lado; titulo: string; texto: string }[] = [
  {
    lado: 'cliente',
    titulo: 'Abre el menú en el celular',
    texto:
      'Con fotos, precios y qué lleva cada plato. Mira todo el tiempo que quiera, sin que nadie del otro lado le vaya contestando qué hay.',
  },
  {
    lado: 'cliente',
    titulo: 'Arma el pedido a su gusto',
    texto:
      'Cantidades, variantes y aclaraciones se eligen en el menú. Sin tomate, con papas en vez de ensalada: viaja dentro del pedido, no en tres mensajes sueltos.',
  },
  {
    lado: 'cliente',
    titulo: 'Paga en la misma pantalla',
    texto:
      'Con Mercado Pago, donde acaba de elegir. No hay alias que pasar ni comprobante que mandar: se acredita y listo.',
  },
  {
    lado: 'negocio',
    titulo: 'El pedido ya está en tu panel',
    texto:
      'Cobrado, escrito y en la lista. Nadie lo cargó a mano ni lo fue a buscar a ningún chat: es lo primero que ves, y ya lo podés empezar.',
  },
]

/* --- Qué incluye -------------------------------------------------------- */

/* Sin campo de imagen: las cinco celdas son texto, y se distinguen entre sí
   por el tamaño que ocupan en la grilla. Los span suman seis por fila (3+3 y
   2+2+2), así que agregar o sacar una obliga a rehacer esa cuenta. */
export const INCLUYE = [
  {
    titulo: 'Menú digital propio',
    texto:
      'Con tu nombre, tus fotos y tus precios. Lo actualizás vos cuando querés, sin pedirle permiso a nadie.',
    span: 3,
  },
  {
    titulo: 'Cobro con Mercado Pago',
    texto:
      'Integrado al pedido. El cliente paga antes de que la cocina empiece: no hay pedidos que se caen.',
    span: 3,
  },
  {
    titulo: 'Panel de pedidos',
    texto:
      'Los pedidos entran acá, ya cobrados y en orden. Se abre desde cualquier celular o computadora del local, sin instalar nada.',
    span: 2,
  },
  {
    titulo: 'Estado de cada pedido',
    texto:
      'Recibido, en preparación, listo, entregado. Todos en el local miran la misma pantalla y nadie pregunta por dónde va.',
    span: 2,
  },
  {
    titulo: 'La cuenta de tu negocio',
    texto:
      'Cuánto vendiste hoy, cuántos pedidos salieron y qué platos se pidieron más, con historial por fecha. Se arma con los pedidos ya cobrados: ni planilla ni cuaderno.',
    span: 2,
  },
]

/* --- Qué se cobra ------------------------------------------------------- */

/* Sin números de la competencia: no sabemos qué cobra cada app y no vamos a
   suponerlo. Acá va sólo el modelo propio, que es verificable. */
export const COMISION = {
  /** Comisión por venta. Es cero, y el compromiso es que se queda en cero. */
  tasa: 0,
} as const

/* --- Testimonios --------------------------------------------------------
   PLACEHOLDER. Reemplazar por clientes reales antes de publicar.
   Los corchetes se muestran tal cual en pantalla justamente para que no se
   escape a producción sin completar. */

export const TESTIMONIOS = [
  {
    cita: '[Frase del cliente sobre qué cambió en el local desde que usa AustralFood.]',
    nombre: '[Nombre y apellido]',
    rol: '[Rol]',
    local: '[Nombre del local, barrio]',
  },
  {
    cita: '[Frase sobre el ahorro en comisiones o el tiempo que dejó de perder al teléfono.]',
    nombre: '[Nombre y apellido]',
    rol: '[Rol]',
    local: '[Nombre del local, barrio]',
  },
  {
    cita: '[Frase sobre lo simple que fue arrancar o sobre cómo le cambió ver los pedidos en el panel.]',
    nombre: '[Nombre y apellido]',
    rol: '[Rol]',
    local: '[Nombre del local, barrio]',
  },
]

/* --- Preguntas ---------------------------------------------------------- */

export const PREGUNTAS = [
  {
    p: '¿AustralFood hace el envío?',
    r: 'No. AustralFood se ocupa del menú, del pedido, del cobro y de que todo te quede ordenado en el panel. La coordinación del envío queda de tu lado, con el repartidor o el sistema que ya venís usando. Preferimos decirlo antes que después.',
  },
  {
    p: '¿Cobran comisión por cada venta?',
    r: 'No. La comisión por venta es 0%, siempre: no nos llevamos nada de cada pedido, ni ahora ni más adelante. Lo único que se paga es la suscripción fija. El dinero de cada venta va directo a tu cuenta de Mercado Pago.',
  },
  {
    p: '¿Necesito comprar algún equipo?',
    r: 'No. Funciona con el celular que ya tenés. Si querés imprimir las comandas desde el panel podés usar cualquier impresora térmica común, pero no es obligatorio.',
  },
  {
    p: '¿Cuánto tarda en estar andando?',
    r: 'Cargamos tu menú y te entregamos el link listo para compartir. Si nos pasás la carta el mismo día, salís esa semana.',
  },
  {
    p: '¿Qué pasa si quiero cambiar un precio?',
    r: 'Lo cambiás vos desde el panel y queda actualizado al instante. El que entra un minuto después ya ve el precio nuevo, sin que tengas que avisar nada.',
  },
  {
    p: '¿Puedo cancelar cuando quiera?',
    r: 'Sí. El plan mensual se cancela cuando quieras y no hay permanencia mínima. El plan anual se abona una vez y cubre los doce meses.',
  },
]
