/**
 * El aviso de que entró un pedido, como el del panel de verdad: dos notas
 * cortas con WebAudio, sin archivo de audio que bajar.
 *
 * Suena sólo como respuesta a un toque de la persona (confirmar el pago),
 * que es la única forma en que el navegador deja sonar algo. Si el audio no
 * está disponible no pasa nada: el pedido igual aparece resaltado.
 */
export function avisar() {
  try {
    const Audio = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Audio) return

    const ctx = new Audio()
    ;[880, 1175].forEach((hz, i) => {
      const osc = ctx.createOscillator()
      const vol = ctx.createGain()
      const t = ctx.currentTime + i * 0.16

      osc.frequency.value = hz
      vol.gain.setValueAtTime(0.0001, t)
      vol.gain.exponentialRampToValueAtTime(0.14, t + 0.02)
      vol.gain.exponentialRampToValueAtTime(0.0001, t + 0.14)

      osc.connect(vol).connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.18)
    })
  } catch {
    /* Sin audio, el pedido entra igual. */
  }
}
