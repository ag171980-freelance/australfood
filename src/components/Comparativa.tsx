import { Seccion } from './ui/Seccion'
import { formatoPesos } from '../lib/formato'
import { COMISION, PRECIOS } from '../data/contenido'
import css from './Comparativa.module.css'

export function Comparativa() {
  const tasa = `${COMISION.tasa * 100}%`

  return (
    <Seccion
      id="cuentas"
      fondo="quemado"
      titulo="Cero comisión por venta, siempre"
      bajada={
        <>
          La suscripción es fija en {formatoPesos(PRECIOS.mensual)} por mes y no hay nada más. De
          lo que vendés no nos llevamos nada: ni el primer mes, ni dentro de dos años.
        </>
      }
    >
      {/* El número que importa va solo: no hay una segunda etapa que explicar. */}
      <div className={css.etapas}>
        <article className={[css.etapa, css.gratis].join(' ')}>
          <p className={css.tramo}>Todos los meses</p>
          <p className={css.tasa}>{tasa}</p>
          <p className={css.detalle}>
            de comisión por venta. Sin período de prueba que se termine ni porcentaje que aparezca
            después.
          </p>
        </article>
      </div>

      {/* Lo único que sí se paga, y va debajo entero. */}
      <div className={css.constante}>
        <p className={css.constanteEtiqueta}>Lo único que se paga</p>
        <p className={css.constanteMonto}>{formatoPesos(PRECIOS.mensual)}</p>
        <p className={css.constanteDetalle}>
          de suscripción por mes. Es todo el número de la factura, y ya viene con el plan completo.
        </p>
      </div>
    </Seccion>
  )
}
