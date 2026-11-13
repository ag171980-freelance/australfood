import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' para que el build funcione servido desde cualquier subcarpeta de htdocs
// (por ejemplo http://localhost/australfood-landing/dist/) sin tocar rutas a mano.
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    port: 5173,
    open: true,
    proxy: {
      /* Vite no ejecuta PHP: serviría public/api/contacto.php como texto plano.
         El proxy se adelanta al servidor de estáticos y manda /api a Apache,
         que es quien lo corre. En el build no hace falta nada: public/ se copia
         tal cual, así que dist/index.html y dist/api/ quedan hermanos y el
         fetch relativo de enviarConsulta.ts da en el blanco.

         Va 127.0.0.1 y no 'localhost' a propósito: node resuelve localhost a
         ::1 primero y Apache de XAMPP escucha en IPv4, así que con el nombre
         el proxy muere en ECONNREFUSED ::1:80.

         Si movés el proyecto dentro de htdocs, actualizá esta ruta. */
      '/api': {
        target: 'http://127.0.0.1/australfood-landing/public',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',

    /* Dos páginas y no una sola aplicación con router: la landing y el demo
       no comparten nada más que los tokens, y así el visitante que entra a
       leer no se baja el demo entero. En el servidor son dos carpetas, sin
       necesidad de reescribir rutas. */
    rollupOptions: {
      input: {
        principal: 'index.html',
        demo: 'demo/index.html',
      },
    },
  },
})
