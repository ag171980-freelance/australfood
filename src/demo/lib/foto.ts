/**
 * Las fotos viven en /public/img y la demo se sirve una carpeta más abajo,
 * en /demo/. La ruta va relativa a la página y no absoluta: el sitio puede
 * estar colgando de un subdirectorio del servidor, y ahí un "/img/..." se
 * iría a la raíz del dominio, que no es nuestra.
 */
export function foto(slug: string, tamano: 'sm' | 'lg' = 'sm'): string {
  return `../img/${slug}-${tamano}.webp`
}
