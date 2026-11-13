import { Seccion } from './ui/Seccion'
import { BotonLink } from './ui/Boton'
import { formatoNumero, formatoPesos } from '../lib/formato'
import {
  AHORRO_ANUAL,
  ANUAL_POR_MES,
  DESCUENTO_ANUAL,
  PRECIOS,
  type PlanId,
} from '../data/contenido'
import css from './Precios.module.css'

type Props = {
  /* Elegir un plan acá deja cargado el select del formulario, así nadie tiene
     que volver a decir a qué vino. */
  onElegirPlan: (plan: PlanId) => void
}

/* Lo que comparten las dos suscripciones. El pago único no las lleva: no hay
   mensualidad que sostenga el hosting ni el soporte más allá del primer mes. */
const COMUNES = [
  'Cobro con Mercado Pago',
  'Hosting web gratuito',
  'Soporte técnico gratuito',
  '0% de comisión por venta, siempre',
]

export function Precios({ onElegirPlan }: Props) {
  return (
    <Seccion
      id="precios"
      titulo="Un solo producto, tres formas de pagarlo"
      bajada="Las dos suscripciones traen el mismo plan completo y sólo cambia cada cuánto lo abonás. El pago único es para quien prefiere no tener una cuota."
      centrado
    >
      <div className={css.planes}>
        {/* --- Mensual --- */}
        <article className={css.plan}>
          <p className={css.nombre}>Plan mensual</p>

          <div>
            <p className={css.precio}>
              <span className={css.importe}>${formatoNumero(PRECIOS.mensual)}</span>
              <span className={css.periodo}>por mes</span>
            </p>
            <p className={css.equivalencia} style={{ marginTop: 'var(--s-3)' }}>
              Se cobra todos los meses. Cancelás cuando quieras.
            </p>
          </div>

          <ul className={css.detalle}>
            {COMUNES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <div className={css.pieDePlan}>
            <BotonLink
              href="#contacto"
              onClick={() => onElegirPlan('mensual')}
              variante="secundario"
              bloque
            >
              Empezar por mes
            </BotonLink>
          </div>
        </article>

        {/* --- Anual --- */}
        <article className={[css.plan, css.recomendado].join(' ')}>
          <span className={css.pinche} aria-hidden="true" />
          <p className={css.nombre}>Plan anual · el que conviene</p>

          <div>
            <p className={css.precio}>
              <span className={css.tachado}>${formatoNumero(PRECIOS.anualLista)}</span>
              <span className={css.importe}>${formatoNumero(PRECIOS.anualPromo)}</span>
              <span className={css.periodo}>por año</span>
            </p>
            <p className={css.equivalencia} style={{ marginTop: 'var(--s-3)' }}>
              Te queda en <strong>${formatoNumero(ANUAL_POR_MES)}</strong> por mes.
            </p>
          </div>

          {/* "Más de tres meses" y no un número redondo: el ahorro son 3,67
              meses de suscripción, así que decir tres se queda corto y decir
              cuatro es redondear a favor nuestro. */}
          <p className={css.ahorro}>
            Ahorrás <strong>{formatoPesos(AHORRO_ANUAL)}</strong>: más de tres meses, gratis.
          </p>

          <ul className={css.detalle}>
            {COMUNES.map((c) => (
              <li key={c}>{c}</li>
            ))}
            <li>{DESCUENTO_ANUAL}% de descuento sobre el precio mensual</li>
            <li>Precio congelado por los doce meses</li>
          </ul>

          <div className={css.pieDePlan}>
            <BotonLink
              href="#contacto"
              onClick={() => onElegirPlan('anual')}
              bloque
            >
              Empezar por año
            </BotonLink>
          </div>
        </article>

        {/* --- Pago único --- */}
        <article className={css.plan}>
          <p className={css.nombre}>Pago único</p>

          <div>
            <p className={css.precio}>
              <span className={css.importe}>${formatoNumero(PRECIOS.unico)}</span>
              <span className={css.periodo}>una sola vez</span>
            </p>
            <p className={css.equivalencia} style={{ marginTop: 'var(--s-3)' }}>
              Se abona una vez y no hay cuota mensual.
            </p>
          </div>

          <ul className={css.detalle}>
            <li>Instalación inicial</li>
            <li>Soporte gratuito por un mes</li>
          </ul>

          <div className={css.pieDePlan}>
            <BotonLink
              href="#contacto"
              onClick={() => onElegirPlan('unico')}
              variante="secundario"
              bloque
            >
              Consultar pago único
            </BotonLink>
          </div>
        </article>
      </div>

    </Seccion>
  )
}
