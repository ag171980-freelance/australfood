import type { PlanId } from '../data/contenido'

export type Consulta = {
  nombre: string
  apellido: string
  email: string
  whatsapp: string
  plan: PlanId
  mensaje: string
}

/* Ruta relativa a propósito: el build usa base './', así que esto resuelve
   igual servido desde la raíz del dominio o desde htdocs/landing-claude/dist/.
   En desarrollo el proxy de vite.config.ts lo manda a Apache, que es quien
   ejecuta PHP; el server de Vite por sí solo devolvería el archivo sin correr. */
const ENDPOINT = 'api/contacto.php'

/** Error con un texto ya listo para mostrarle a la persona. */
export class ErrorDeEnvio extends Error {}

export async function enviarConsulta(datos: Consulta): Promise<void> {
  let respuesta: Response

  try {
    respuesta = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    })
  } catch {
    throw new ErrorDeEnvio('No pudimos conectarnos. Revisá tu conexión y probá de nuevo.')
  }

  /* El endpoint contesta JSON siempre. Si no se puede parsear es que algo
     devolvió HTML (un 500 de Apache, o el proxy apuntando a otro lado): se
     informa como falla del servidor y no como un éxito silencioso. */
  let cuerpo: { ok?: boolean; error?: string } = {}
  try {
    cuerpo = await respuesta.json()
  } catch {
    throw new ErrorDeEnvio('El servidor respondió de una forma inesperada. Probá más tarde.')
  }

  if (!respuesta.ok || !cuerpo.ok) {
    throw new ErrorDeEnvio(cuerpo.error || 'No pudimos enviar la consulta. Probá más tarde.')
  }
}
