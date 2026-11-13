import { Seccion } from './ui/Seccion'
import { BotonLink } from './ui/Boton'
import css from './InvitacionDemo.module.css'

/* La demo interactiva ya no vive acá. Esta sección sólo invita: el recorrido
   completo (menú, pago y panel) se arma en /demo, con espacio propio y sin
   competir con el resto de la página. */
export function InvitacionDemo() {
  return (
    <Seccion
      id="probalo"
      fondo="tinta"
      titulo="Usalo como lo va a usar tu cliente"
      bajada="Un recorrido por el menú, el pago y el pedido entrando al panel. Sin registrarte y sin dejar datos."
      centrado
    >
      <div className={css.invitacion}>
        <BotonLink className={css.cta} href="./demo/" grande>
          Entrar al demo
        </BotonLink>
      </div>
    </Seccion>
  )
}
