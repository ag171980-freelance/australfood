/* Menú del local de demostración.
   Cuando conectemos la API en PHP, este archivo se reemplaza por un fetch a
   /api/locales/:slug/menu — la forma de los tipos ya está pensada para eso. */

export type CategoriaId = 'picar' | 'milanesas' | 'parrilla' | 'pastas' | 'postres' | 'bebidas'

export type Categoria = {
  id: CategoriaId
  nombre: string
}

export type Plato = {
  id: string
  nombre: string
  descripcion: string
  precio: number
  categoria: CategoriaId
  etiqueta?: string
  /** Slug en /public/img. Se sirve como {imagen}-sm.webp y {imagen}-lg.webp. */
  imagen?: string
}

export const LOCAL_DEMO = {
  nombre: 'Bodegón Santa Rita',
  slug: 'santa-rita',
  zona: 'Villa Crespo',
  horario: 'Mar a Dom · 19:00 a 00:30',
} as const

export const CATEGORIAS: Categoria[] = [
  { id: 'milanesas', nombre: 'Milanesas' },
  { id: 'parrilla', nombre: 'Parrilla' },
  { id: 'pastas', nombre: 'Pastas' },
  { id: 'picar', nombre: 'Para picar' },
  { id: 'postres', nombre: 'Postres' },
  { id: 'bebidas', nombre: 'Bebidas' },
]

export const PLATOS: Plato[] = [
  // Milanesas
  {
    id: 'mila-napo',
    nombre: 'Milanesa napolitana',
    descripcion: 'De ternera, con jamón, salsa y muzzarella. Con papas fritas.',
    precio: 9200,
    categoria: 'milanesas',
    imagen: 'plato-milanesa',
  },
  {
    id: 'mila-caballo',
    nombre: 'Milanesa a caballo',
    descripcion: 'Con dos huevos fritos y papas españolas.',
    precio: 8700,
    categoria: 'milanesas',
    imagen: 'hero-milanesa',
  },
  {
    id: 'mila-berenjena',
    nombre: 'Milanesa de berenjena',
    descripcion: 'Rebozada en pan casero, con ensalada de estación.',
    precio: 7400,
    categoria: 'milanesas',
    etiqueta: 'vegetariano',
  },

  // Parrilla
  {
    id: 'bife-chorizo',
    nombre: 'Bife de chorizo',
    descripcion: '400 g a la parrilla, con guarnición a elección.',
    precio: 13500,
    categoria: 'parrilla',
    imagen: 'plato-parrilla',
  },
  {
    id: 'entrana',
    nombre: 'Entraña',
    descripcion: 'Con chimichurri de la casa y papas al horno.',
    precio: 14200,
    categoria: 'parrilla',
  },
  {
    id: 'provoleta',
    nombre: 'Provoleta',
    descripcion: 'Con orégano y aceite de oliva.',
    precio: 5600,
    categoria: 'parrilla',
    imagen: 'plato-provoleta',
    etiqueta: 'vegetariano',
  },

  // Pastas
  {
    id: 'sorrentinos',
    nombre: 'Sorrentinos de jamón y queso',
    descripcion: 'Con salsa a elección: filetto, rosa o cuatro quesos.',
    precio: 8900,
    categoria: 'pastas',
    imagen: 'plato-pastas',
  },
  {
    id: 'ñoquis',
    nombre: 'Ñoquis caseros',
    descripcion: 'Amasados en el día. Con estofado de la casa.',
    precio: 7800,
    categoria: 'pastas',
    imagen: 'plato-pastas',
  },

  // Para picar
  {
    id: 'papas-cheddar',
    nombre: 'Papas con cheddar y panceta',
    descripcion: 'Para compartir entre dos.',
    precio: 6300,
    categoria: 'picar',
  },
  {
    id: 'empanadas',
    nombre: 'Empanadas de carne (6)',
    descripcion: 'Cortadas a cuchillo, al horno de barro.',
    precio: 7200,
    categoria: 'picar',
    imagen: 'plato-empanadas',
  },
  {
    id: 'rabas',
    nombre: 'Rabas',
    descripcion: 'Con limón y alioli.',
    precio: 9600,
    categoria: 'picar',
  },

  // Postres
  {
    id: 'flan',
    nombre: 'Flan casero',
    descripcion: 'Con dulce de leche y crema.',
    precio: 3800,
    categoria: 'postres',
    imagen: 'plato-flan',
  },
  {
    id: 'tiramisu',
    nombre: 'Tiramisú',
    descripcion: 'De la casa, con café del día.',
    precio: 4200,
    categoria: 'postres',
  },

  // Bebidas
  {
    id: 'agua',
    nombre: 'Agua sin gas 500 ml',
    descripcion: '',
    precio: 1800,
    categoria: 'bebidas',
  },
  {
    id: 'gaseosa',
    nombre: 'Gaseosa línea Coca-Cola',
    descripcion: '500 ml, bien fría.',
    precio: 2400,
    categoria: 'bebidas',
  },
  {
    id: 'vino',
    nombre: 'Malbec de la casa',
    descripcion: 'Botella 750 ml.',
    precio: 11000,
    categoria: 'bebidas',
  },
]
