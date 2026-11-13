import { BotonLink } from './ui/Boton'
import { formatoPesos } from '../lib/formato'
import { LOCAL_DEMO, PLATOS } from '../data/menu'
import css from './Hero.module.css'

const GARANTIAS = ['0% de comisión', 'Sin permanencia', 'Sin equipos adicionales']

/* El teléfono renderiza platos reales del menú de demostración, con sus fotos
   y sus precios: es una miniatura del producto que está más abajo en la
   página, no una captura de pantalla dibujada con divs. */
const EN_VITRINA = ['mila-napo', 'bife-chorizo', 'empanadas'].map(
  (id) => PLATOS.find((p) => p.id === id)!,
)

const TOTAL = EN_VITRINA.reduce((a, p) => a + p.precio, 0)

export function Hero() {
  return (
    <header className={`${css.hero} sobre-tinta`} id="inicio">
      {/* La foto ocupa el hero entero. El velo la oscurece del lado del
          texto y la deja limpia del lado de la comida. */}
      <picture className={css.fondo}>
        <source media="(max-width: 700px)" srcSet="/img/hero-parrilla-sm.webp" />
        <source media="(max-width: 1300px)" srcSet="/img/hero-parrilla-lg.webp" />
        <img
          src="/img/hero-parrilla-xl.webp"
          alt="Bife de chorizo recién cortado sobre una tabla de madera"
          width={2000}
          height={1125}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className={css.velo} aria-hidden="true" />

      <div className={css.interior}>
        <div className={css.texto}>
          {/* Tres frases, tres renglones fijos. El titular es un remate de tres
              tiempos: si se deja que el navegador corte por ancho disponible,
              las frases se mezclan entre renglones y queda una oración larga
              cualquiera en vez de tres golpes. */}
          <h1 className={css.titulo}>
            <span className={css.linea}>Tus clientes piden.</span>
            <span className={css.linea}>
              Vos <em>vendés</em>.
            </span>
            <span className={css.linea}>Nosotros simplificamos.</span>
          </h1>

          <p className={css.bajada}>
            Ofrecé tu propio menú digital, recibí pedidos directamente desde el celular y cobrá
            online con Mercado Pago. Todo organizado en un solo lugar, sin intermediarios ni
            complicaciones.
          </p>

          <div className={css.acciones}>
            <BotonLink href="#probalo" grande>
              Probá el menú
            </BotonLink>
            <BotonLink href="#precios" variante="fantasma" grande>
              Ver precios
            </BotonLink>
          </div>

          <ul className={css.garantias}>
            {GARANTIAS.map((g) => (
              <li key={g} className={css.garantia}>
                {g}
              </li>
            ))}
          </ul>
        </div>

        {/* La prueba del producto, flotando sobre la foto. */}
        <div className={css.pruebas}>
          <div className={css.telefono} aria-hidden="true">
            <div className={css.telefonoCabecera}>
              <span className={css.telefonoLocal}>{LOCAL_DEMO.nombre}</span>
              <span className={css.telefonoZona}>{LOCAL_DEMO.zona}</span>
            </div>

            <ul className={css.vitrina}>
              {EN_VITRINA.map((p) => (
                <li key={p.id} className={css.item}>
                  <img
                    className={css.itemFoto}
                    src={`/img/${p.imagen}-sm.webp`}
                    alt=""
                    width={720}
                    height={540}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className={css.itemNombre}>{p.nombre}</span>
                  <span className={css.itemPrecio}>{formatoPesos(p.precio)}</span>
                </li>
              ))}
            </ul>

            <p className={css.telefonoPie}>Pagar {formatoPesos(TOTAL)}</p>
          </div>

          <div className={css.aviso} aria-hidden="true">
            <span className={css.avisoOrigen}>Panel · Pedidos</span>
            <span className={css.avisoTexto}>Pedido #0142 entró pagado</span>
            <span className={css.avisoMonto}>{formatoPesos(TOTAL)}</span>
          </div>
        </div>
      </div>

      <p className="solo-lectores">
        Ejemplo: el cliente arma el pedido desde el menú del local en su celular, paga, y el pedido
        aparece ya cobrado en el panel de administración del local.
      </p>
    </header>
  )
}
