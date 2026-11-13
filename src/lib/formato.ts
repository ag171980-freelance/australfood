const pesos = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** 30000 → "$ 30.000" */
export function formatoPesos(n: number): string {
  return pesos.format(n)
}

/** 30000 → "30.000", sin símbolo, para cuando el "$" ya está en el markup. */
export function formatoNumero(n: number): string {
  return new Intl.NumberFormat('es-AR', { maximumFractionDigits: 0 }).format(n)
}
