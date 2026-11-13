import { useId, useRef, useState } from 'react'
import { Seccion } from './ui/Seccion'
import { Boton } from './ui/Boton'
import { PLANES, type PlanId } from '../data/contenido'
import { enviarConsulta, ErrorDeEnvio } from '../lib/enviarConsulta'
import css from './Contacto.module.css'

type Campo = 'nombre' | 'apellido' | 'email' | 'whatsapp'
type Errores = Partial<Record<Campo, string>>
type Estado = 'quieto' | 'enviando' | 'listo' | 'falla'

const VACIO = { nombre: '', apellido: '', email: '', whatsapp: '', mensaje: '' }

/* Validación mínima y del lado del cliente, para avisar antes de mandar.
   La de verdad está en contacto.php: el navegador no es un lugar confiable. */
function validar(v: typeof VACIO): Errores {
  const e: Errores = {}

  if (!v.nombre.trim()) e.nombre = 'Poné tu nombre.'
  if (!v.apellido.trim()) e.apellido = 'Poné tu apellido.'

  if (!v.email.trim()) e.email = 'Poné tu email.'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim()))
    e.email = 'Ese email no parece válido.'

  const digitos = v.whatsapp.replace(/\D/g, '')
  if (!digitos) e.whatsapp = 'Poné tu número de WhatsApp.'
  else if (digitos.length < 8 || digitos.length > 15)
    e.whatsapp = 'Escribilo con característica, sin el 0 ni el 15.'

  return e
}

type Props = {
  plan: PlanId
  onCambiarPlan: (plan: PlanId) => void
}

export function Contacto({ plan, onCambiarPlan }: Props) {
  const [valores, setValores] = useState(VACIO)
  const [errores, setErrores] = useState<Errores>({})
  const [estado, setEstado] = useState<Estado>('quieto')
  const [fallo, setFallo] = useState('')

  /* Los ids tienen que ser únicos en la página para que cada label apunte a
     su campo, y además estables entre render y render. */
  const id = useId()
  const campo = (n: string) => `${id}-${n}`
  const errorId = (n: Campo) => `${id}-${n}-error`

  const resumen = useRef<HTMLParagraphElement>(null)

  const escribir = (n: keyof typeof VACIO) => (ev: { target: { value: string } }) => {
    setValores((v) => ({ ...v, [n]: ev.target.value }))
    /* El error se limpia al corregir, no recién al reenviar. */
    if (n !== 'mensaje' && errores[n]) setErrores(({ [n]: _, ...resto }) => resto)
  }

  async function enviar(ev: React.FormEvent) {
    ev.preventDefault()
    if (estado === 'enviando') return

    const fallas = validar(valores)
    setErrores(fallas)
    if (Object.keys(fallas).length > 0) {
      /* Al primer campo con problema, para no obligar a buscarlo a mano. */
      document.getElementById(campo(Object.keys(fallas)[0]))?.focus()
      return
    }

    setEstado('enviando')
    setFallo('')

    try {
      await enviarConsulta({
        nombre: valores.nombre.trim(),
        apellido: valores.apellido.trim(),
        email: valores.email.trim(),
        whatsapp: valores.whatsapp.trim(),
        plan,
        mensaje: valores.mensaje.trim(),
      })
      setEstado('listo')
      setValores(VACIO)
    } catch (err) {
      setEstado('falla')
      setFallo(
        err instanceof ErrorDeEnvio ? err.message : 'No pudimos enviar la consulta. Probá más tarde.',
      )
      resumen.current?.focus()
    }
  }

  if (estado === 'listo') {
    return (
      <Seccion id="contacto" titulo="Listo, ya me llegó" centrado>
        <div className={css.gracias} role="status">
          <p className={css.graciasTilde} aria-hidden="true">
            ✓
          </p>
          <p className={css.graciasTexto}>
            Te escribo por WhatsApp al número que dejaste para contarte los detalles y coordinar la
            puesta en marcha. Suele ser dentro del día.
          </p>
          <Boton variante="secundario" onClick={() => setEstado('quieto')}>
            Enviar otra consulta
          </Boton>
        </div>
      </Seccion>
    )
  }

  return (
    <Seccion
      id="contacto"
      titulo="Contame de tu local y lo arrancamos"
      bajada="Dejame tus datos y cuál de los tres planes te sirve. Cuando me llegue el mensaje te escribo por WhatsApp para darte los detalles y coordinar la puesta en marcha."
      centrado
    >
      <form className={css.formulario} onSubmit={enviar} noValidate>
        <div className={css.fila}>
          <Campito
            id={campo('nombre')}
            errorId={errorId('nombre')}
            etiqueta="Nombre"
            error={errores.nombre}
          >
            <input
              id={campo('nombre')}
              name="nombre"
              type="text"
              autoComplete="given-name"
              className={css.control}
              value={valores.nombre}
              onChange={escribir('nombre')}
              aria-invalid={!!errores.nombre}
              aria-describedby={errores.nombre ? errorId('nombre') : undefined}
            />
          </Campito>

          <Campito
            id={campo('apellido')}
            errorId={errorId('apellido')}
            etiqueta="Apellido"
            error={errores.apellido}
          >
            <input
              id={campo('apellido')}
              name="apellido"
              type="text"
              autoComplete="family-name"
              className={css.control}
              value={valores.apellido}
              onChange={escribir('apellido')}
              aria-invalid={!!errores.apellido}
              aria-describedby={errores.apellido ? errorId('apellido') : undefined}
            />
          </Campito>
        </div>

        <div className={css.fila}>
          <Campito
            id={campo('email')}
            errorId={errorId('email')}
            etiqueta="Email"
            error={errores.email}
          >
            <input
              id={campo('email')}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className={css.control}
              value={valores.email}
              onChange={escribir('email')}
              aria-invalid={!!errores.email}
              aria-describedby={errores.email ? errorId('email') : undefined}
            />
          </Campito>

          <Campito
            id={campo('whatsapp')}
            errorId={errorId('whatsapp')}
            etiqueta="Número de WhatsApp"
            ayuda="Con característica, sin el 0 ni el 15. Por ejemplo 11 2345 6789."
            error={errores.whatsapp}
          >
            <input
              id={campo('whatsapp')}
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={css.control}
              value={valores.whatsapp}
              onChange={escribir('whatsapp')}
              aria-invalid={!!errores.whatsapp}
              aria-describedby={
                [errores.whatsapp ? errorId('whatsapp') : null, `${campo('whatsapp')}-ayuda`]
                  .filter(Boolean)
                  .join(' ') || undefined
              }
            />
          </Campito>
        </div>

        <Campito id={campo('plan')} errorId={errorId('email')} etiqueta="Plan que querés contratar">
          <select
            id={campo('plan')}
            name="plan"
            className={css.control}
            value={plan}
            onChange={(ev) => onCambiarPlan(ev.target.value as PlanId)}
          >
            {PLANES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.etiqueta}
              </option>
            ))}
          </select>
        </Campito>

        <Campito
          id={campo('mensaje')}
          errorId={errorId('email')}
          etiqueta="Mensaje"
          ayuda="Opcional. Contame qué vendés, cuántos pedidos manejás por noche o lo que quieras preguntarme."
        >
          <textarea
            id={campo('mensaje')}
            name="mensaje"
            rows={5}
            className={[css.control, css.area].join(' ')}
            value={valores.mensaje}
            onChange={escribir('mensaje')}
            aria-describedby={`${campo('mensaje')}-ayuda`}
          />
        </Campito>

        <div className={css.pie}>
          <Boton type="submit" grande disabled={estado === 'enviando'}>
            {estado === 'enviando' ? 'Enviando…' : 'Enviar consulta'}
          </Boton>

          <p
            className={[css.aviso, estado === 'falla' && css.avisoFalla].filter(Boolean).join(' ')}
            role="status"
            tabIndex={-1}
            ref={resumen}
          >
            {estado === 'falla'
              ? fallo
              : 'Te respondo por WhatsApp. No uso tus datos para nada más.'}
          </p>
        </div>
      </form>
    </Seccion>
  )
}

/* Envoltorio de campo: etiqueta arriba, control en el medio, ayuda y error
   abajo. Centraliza el orden para que ningún campo se arme distinto. */
function Campito({
  id,
  errorId,
  etiqueta,
  ayuda,
  error,
  children,
}: {
  id: string
  errorId: string
  etiqueta: string
  ayuda?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={css.campo}>
      <label className={css.etiqueta} htmlFor={id}>
        {etiqueta}
      </label>
      {children}
      {ayuda && (
        <p className={css.ayuda} id={`${id}-ayuda`}>
          {ayuda}
        </p>
      )}
      {error && (
        <p className={css.error} id={errorId}>
          {error}
        </p>
      )}
    </div>
  )
}
