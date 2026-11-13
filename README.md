# AustralFood — Landing

Landing page de AustralFood: menú digital, cobro con Mercado Pago y un panel de
administración donde entran los pedidos, para casas de comida chicas.

Vite 5 + React 18 + TypeScript, con CSS Modules. Sin dependencias de UI.

---

## Arrancar

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # sale a dist/
npm run preview  # sirve el build
```

### Node

El proyecto corre con **node 18.17.0** (`nvm use 18.17.0`). Es la versión que soporta
Vite 5; Vite 6+ pide node ≥ 20.19.

> Si `npm` tira `Cannot find module '@npmcli/config'`, es porque nvm-windows extrajo
> npm sin symlinks y los workspaces internos quedaron como archivos de texto. Se
> arregla reemplazando esos archivos por junctions hacia `npm/workspaces/*`.

---

## Antes de publicar

Hay tres cosas cargadas con valores de relleno:

| Qué | Dónde |
| --- | --- |
| Número de WhatsApp | `src/data/contenido.ts` → `CONTACTO.whatsapp` |
| Email de contacto | `src/data/contenido.ts` → `CONTACTO.email` |
| Testimonios | `src/data/contenido.ts` → `TESTIMONIOS` |
| Casilla que recibe el formulario | `public/api/contacto.php` → `DESTINO` y `REMITENTE` |

La sección de testimonios muestra un aviso rojo en pantalla a propósito, para que
nadie publique la página con citas inventadas. Completala con clientes reales o
sacá `<Testimonios />` de `src/App.tsx`.

Los números de la sección de comparación (`SUPUESTOS`) son un ejemplo declarado como
tal en la página. Ajustalos si querés otro escenario.

---

## El formulario de contacto

Los tres botones de la sección de precios no abren WhatsApp: bajan a `#contacto`
y dejan el plan ya elegido en el `select`. El formulario postea a un endpoint PHP
que manda el mail y después vos contestás por WhatsApp.

```
Precios  ──clic en un plan──▶  #contacto
                                  │  fetch POST (JSON)
                                  ▼
                       public/api/contacto.php
                                  │  mail()
                                  ▼
                            tu casilla
```

**Antes de que funcione hay que hacer dos cosas.**

1. En `public/api/contacto.php`, poner la casilla real en `DESTINO`. El `REMITENTE`
   tiene que ser una dirección del dominio desde el que se envía: si va el mail de
   quien completa el formulario, los servidores lo tratan como remitente falsificado
   y termina en spam.

2. Dejar el SMTP andando. En XAMPP sobre Windows `mail()` no envía nada hasta que
   se configura `php.ini` (`[mail function]` → `sendmail_path`) y `sendmail.ini` con
   un servidor real. Con Gmail hace falta una *clave de aplicación*, no la contraseña
   de la cuenta. En un hosting compartido suele venir configurado de fábrica.

Mientras tanto el endpoint responde `502` con un mensaje claro, y la página lo
muestra en rojo debajo del botón en vez de fingir que se envió.

Cada consulta se guarda además en `public/api/consultas.log` **antes** de intentar
el envío, así un SMTP mal configurado no hace perder el contacto. Ese archivo no se
versiona ni se copia al build.

### En desarrollo

Vite no ejecuta PHP. `vite.config.ts` manda `/api` por proxy a Apache, así que para
probar el formulario con `npm run dev` **tiene que estar levantado el Apache de
XAMPP**. El proxy apunta a `http://127.0.0.1/landing-claude/public`: si movés la
carpeta dentro de `htdocs`, actualizá esa ruta.

Va `127.0.0.1` y no `localhost` a propósito. Node resuelve `localhost` a `::1`
primero y Apache escucha en IPv4, así que con el nombre el proxy muere en
`ECONNREFUSED ::1:80`.

En el build no hay nada que configurar: `public/` se copia tal cual, así que
`dist/index.html` y `dist/api/` quedan hermanos y el `fetch` relativo da en el blanco.

---

## Estructura

```
src/
  data/
    menu.ts        · menú del local de demostración
    contenido.ts   · precios, textos, FAQ, testimonios
  lib/
    formato.ts     · formato de pesos argentinos
    useReveal.ts   · revelado al entrar en viewport
    useImpresion.ts· revelado línea por línea de la comanda
    enviarConsulta.ts· POST del formulario a api/contacto.php
  components/
    ui/            · Boton, Seccion, Ticket (el papel de comanda)
    Nav · Hero · Problema · ComoFunciona · InvitacionDemo
    Incluye · Comparativa · Precios · Preguntas · Contacto · Cierre
  styles/
    tokens.css     · el sistema de diseño entero
    global.css     · reset y utilidades
```

---

## El sistema de diseño

Todo sale de un solo objeto: **la comanda de cocina**.

- **Color** — papel térmico (`--papel`), tinta (`--tinta`), el rojo del pinche del riel
  (`--pinche`) y el verde del sello (`--pagado`). El verde se usa *solamente* para
  estados de confirmación, nunca de adorno.
- **Tipografía** — Big Shoulders Display para los títulos (condensada, industrial),
  Archivo para el cuerpo, IBM Plex Mono para precios, horas y todo lo que sea dato.
- **Estructura** — de una secuencia se afirma sólo lo que se sabe. `PROBLEMAS` marca
  sus cuatro momentos con **horas** (20:10 a 23:55) porque es una escena, no una
  medición: las horas cuentan que la noche se hace larga. `PASOS`, en cambio, va
  **numerado y sin horas ni duraciones**. Cuánto tarda un cliente en mirar la carta,
  decidirse y pagar no lo sabemos, y ponerle un número exacto sería inventar un dato
  y presentarlo como medido. Que el sistema acorta el ida y vuelta se dice con
  palabras; con cifras no, hasta que haya con qué respaldarlas.
- **Movimiento** — imita mecánica de impresora: avanza a saltos, no flota. Se concentra
  en la demo y casi no aparece en el resto.
- **Sin esquinas redondeadas** salvo el mínimo de botones y chips: el papel se corta,
  no se redondea.

Los tokens están todos en `src/styles/tokens.css`. Cambiar un color ahí lo cambia en
toda la página.

---

## Lo que sigue: la API en PHP

`src/data/` está aislado a propósito. Cuando exista el backend:

- `menu.ts` se reemplaza por un `fetch` a `/api/locales/:slug/menu`. Los tipos
  `Plato`, `Categoria` y `CategoriaId` ya tienen la forma de la respuesta esperada.
- La demo interactiva vive en `/demo` (hoy sólo la invitación, en `InvitacionDemo.tsx`).
  Ahí va la llamada real a la preferencia de Mercado Pago, donde hoy iría un `setTimeout`.
- El panel de administración es una aplicación aparte, no parte de esta landing. La
  landing sólo lo describe y lo vende. El pedido que hoy se arma en el front de demo
  es el mismo payload que después escribe el backend en la cola del panel.

---

## Accesibilidad

- Responsive hasta 320 px.
- Foco de teclado visible en todos los interactivos, con color adaptado sobre fondo oscuro.
- `prefers-reduced-motion` respetado: la comanda aparece completa, sin animación de impresión.
- Enlace de salto al contenido como primer tabulable.
- La demo tiene una sola región `role="status"` con un resumen corto, en vez de releer
  la comanda entera en cada cambio.
