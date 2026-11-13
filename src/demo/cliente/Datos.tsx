import { useState } from 'react'
import { formatoPesos } from '../../lib/formato'
import type { Cliente, Modo } from '../estado/pedido'
import { Paso } from './Comanda'
import css from './Cliente.module.css'

type Props = {
  cliente: Cliente
  modo: Modo
  total: number
  onCambiar: (cliente: Cliente) => void
  onVolver: () => void
  onPagar: () => void
}

/* Los mismos datos que hoy el local pide por chat, de una sola vez y
   escritos por quien los sabe. */
export function Datos({ cliente, modo, total, onCambiar, onVolver, onPagar }: Props) {
  const [tocado, setTocado] = useState(false)

  const faltaNombre = !cliente.nombre.trim()
  const faltaWhatsapp = cliente.whatsapp.trim().length < 8
  const faltaDireccion = modo === 'envio' && !cliente.direccion.trim()
  const listo = !faltaNombre && !faltaWhatsapp && !faltaDireccion

  const escribir = (campo: keyof Cliente) => (e: { target: { value: string } }) =>
    onCambiar({ ...cliente, [campo]: e.target.value })

  const seguir = () => {
    setTocado(true)
    if (listo) onPagar()
  }

  return (
    <div className={css.app}>
      <Paso titulo="Datos y pago" onVolver={onVolver} />

      <div className={css.cuerpo}>
        <div className={css.campoBloque}>
          <label className={css.etiqueta} htmlFor="cl-nombre">
            Nombre
          </label>
          <input
            id="cl-nombre"
            className={css.campo}
            value={cliente.nombre}
            autoComplete="name"
            onChange={escribir('nombre')}
          />
          {tocado && faltaNombre && <p className={css.error}>Decinos cómo te llamamos.</p>}
        </div>

        <div className={css.campoBloque}>
          <label className={css.etiqueta} htmlFor="cl-whatsapp">
            WhatsApp
          </label>
          <input
            id="cl-whatsapp"
            className={css.campo}
            value={cliente.whatsapp}
            inputMode="tel"
            placeholder="11 2345 6789"
            onChange={escribir('whatsapp')}
          />
          {tocado && faltaWhatsapp && <p className={css.error}>Falta el número.</p>}
        </div>

        {modo === 'envio' && (
          <div className={css.campoBloque}>
            <label className={css.etiqueta} htmlFor="cl-direccion">
              Dirección
            </label>
            <input
              id="cl-direccion"
              className={css.campo}
              value={cliente.direccion}
              autoComplete="street-address"
              placeholder="Calle y altura"
              onChange={escribir('direccion')}
            />
            {tocado && faltaDireccion && <p className={css.error}>Falta a dónde lo llevamos.</p>}
          </div>
        )}

        <div className={css.campoBloque}>
          <label className={css.etiqueta} htmlFor="cl-nota">
            Algo que tengamos que saber
          </label>
          <input
            id="cl-nota"
            className={css.campo}
            value={cliente.nota}
            maxLength={80}
            placeholder="Timbre roto, dejar en portería…"
            onChange={escribir('nota')}
          />
        </div>

        <div className={css.pago} data-tour="pago">
          <p className={css.pagoTitulo}>Cómo lo pagás</p>
          <p className={css.pagoMedio}>
            <span className={css.pagoMarca}>Mercado Pago</span>
            Tarjeta, dinero en cuenta o transferencia. Se cobra antes de que la cocina empiece.
          </p>
          <p className={css.pagoNota}>
            La plata va a la cuenta del local. AustralFood no cobra comisión por venta.
          </p>
        </div>

        <button type="button" className={css.principal} onClick={seguir}>
          Pagar {formatoPesos(total)}
        </button>
        <button type="button" className={css.secundario} onClick={onVolver}>
          Volver al pedido
        </button>
      </div>
    </div>
  )
}
