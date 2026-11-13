import { useMemo, useState } from 'react'
import { CATEGORIAS, LOCAL_DEMO, PLATOS, type Plato } from '../../data/menu'
import { formatoPesos } from '../../lib/formato'
import { FichaPlato } from './FichaPlato'
import { foto } from '../lib/foto'
import css from './Cliente.module.css'

type Props = {
  unidades: number
  total: number
  onAgregar: (platoId: string, cantidad: number, nota: string) => void
  onVerPedido: () => void
}

/**
 * La carta, que es lo primero que ve el cliente: los platos del local con su
 * foto, su precio y qué lleva cada uno. Nada de esto lo escribió un programador:
 * sale del mismo lugar del que saldría la carta de un local de verdad.
 */
export function Carta({ unidades, total, onAgregar, onVerPedido }: Props) {
  const [busqueda, setBusqueda] = useState('')
  const [rubro, setRubro] = useState<string | null>(null)
  const [abierto, setAbierto] = useState<Plato | null>(null)

  const visibles = useMemo(() => {
    const aguja = busqueda.trim().toLowerCase()
    return PLATOS.filter((p) => {
      if (rubro && p.categoria !== rubro) return false
      if (!aguja) return true
      return `${p.nombre} ${p.descripcion}`.toLowerCase().includes(aguja)
    })
  }, [busqueda, rubro])

  const porRubro = useMemo(() => {
    return CATEGORIAS.map((c) => ({
      categoria: c,
      platos: visibles.filter((p) => p.categoria === c.id),
    })).filter((grupo) => grupo.platos.length > 0)
  }, [visibles])

  return (
    <div className={css.app}>
      <header className={css.cabecera}>
        <div>
          <p className={css.local}>{LOCAL_DEMO.nombre}</p>
          <p className={css.zona}>
            {LOCAL_DEMO.zona} · {LOCAL_DEMO.horario}
          </p>
        </div>
        <p className={css.abierto}>
          <span aria-hidden="true" /> Abierto
        </p>
      </header>

      <div className={css.buscador}>
        <input
          className={css.campo}
          type="search"
          value={busqueda}
          placeholder="Buscar un plato"
          aria-label="Buscar un plato"
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      <nav className={css.chips} aria-label="Rubros de la carta">
        <button
          type="button"
          className={[css.chip, rubro === null && css.chipActivo].filter(Boolean).join(' ')}
          aria-pressed={rubro === null}
          onClick={() => setRubro(null)}
        >
          Todo
        </button>
        {CATEGORIAS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={[css.chip, rubro === c.id && css.chipActivo].filter(Boolean).join(' ')}
            aria-pressed={rubro === c.id}
            onClick={() => setRubro(rubro === c.id ? null : c.id)}
          >
            {c.nombre}
          </button>
        ))}
      </nav>

      <div className={css.lista} data-tour="carta">
        {porRubro.length === 0 && (
          <p className={css.vacio}>No hay nada con “{busqueda.trim()}”. Probá con otro nombre.</p>
        )}

        {porRubro.map((grupo, i) => (
          <section key={grupo.categoria.id} className={css.rubro}>
            <h2 className={css.rubroTitulo}>{grupo.categoria.nombre}</h2>

            {grupo.platos.map((plato, j) => (
              <button
                key={plato.id}
                type="button"
                className={css.plato}
                data-tour={i === 0 && j === 0 ? 'plato' : undefined}
                onClick={() => setAbierto(plato)}
              >
                {plato.imagen ? (
                  <img className={css.platoFoto} src={foto(plato.imagen)} alt="" loading="lazy" />
                ) : (
                  <span className={[css.platoFoto, css.platoInicial].join(' ')} aria-hidden="true">
                    {plato.nombre.charAt(0)}
                  </span>
                )}

                <span className={css.platoTexto}>
                  <span className={css.platoNombre}>
                    {plato.nombre}
                    {plato.etiqueta && <span className={css.platoEtiqueta}>{plato.etiqueta}</span>}
                  </span>
                  <span className={css.platoDescripcion}>{plato.descripcion}</span>
                </span>

                <span className={css.platoPrecio}>{formatoPesos(plato.precio)}</span>
              </button>
            ))}
          </section>
        ))}
      </div>

      {unidades > 0 && (
        <div className={css.barra}>
          <button type="button" className={css.barraBoton} onClick={onVerPedido}>
            <span className={css.barraCuenta}>{unidades}</span>
            <span>Ver el pedido</span>
            <span className={css.barraTotal}>{formatoPesos(total)}</span>
          </button>
        </div>
      )}

      {abierto && (
        <FichaPlato
          plato={abierto}
          onCerrar={() => setAbierto(null)}
          onAgregar={(cantidad, nota) => {
            onAgregar(abierto.id, cantidad, nota)
            setAbierto(null)
          }}
        />
      )}
    </div>
  )
}
