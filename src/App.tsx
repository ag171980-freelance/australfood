import { useState } from 'react'
import { Nav } from './components/Nav'
import { Hero } from './components/Hero'
import { Problema } from './components/Problema'
import { ComoFunciona } from './components/ComoFunciona'
import { InvitacionDemo } from './components/InvitacionDemo'
import { Incluye } from './components/Incluye'
import { Comparativa } from './components/Comparativa'
import { Precios } from './components/Precios'
// Testimonios queda fuera a propósito: el contenido es un placeholder con
// corchetes. Se activa recién cuando haya citas reales con autorización.
// import { Testimonios } from './components/Testimonios'
import { Preguntas } from './components/Preguntas'
import { Contacto } from './components/Contacto'
import { Cierre } from './components/Cierre'
import type { PlanId } from './data/contenido'

export default function App() {
  /* El plan elegido vive acá porque lo escriben las tarjetas de precio y lo
     lee el select del formulario, que son hermanos. Arranca en el anual, que
     es el que la sección de precios recomienda. */
  const [plan, setPlan] = useState<PlanId>('anual')

  return (
    <>
      <a className="saltar" href="#contenido">
        Saltar al contenido
      </a>

      <Nav />

      <main id="contenido">
        <Hero />
        <Problema />
        <ComoFunciona />
        <InvitacionDemo />
        <Incluye />
        <Comparativa />
        <Precios onElegirPlan={setPlan} />
        <Preguntas />
        <Contacto plan={plan} onCambiarPlan={setPlan} />
      </main>

      <Cierre />
    </>
  )
}
