import { copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages has no server-side rewrite, so a direct hit on a deep link
// (e.g. /careers) is served 404.html. Shipping a copy of index.html there lets
// BrowserRouter resolve the original URL client-side.
const spaFallback = () => ({
  name: 'spa-404-fallback',
  apply: 'build',
  closeBundle() {
    const dist = fileURLToPath(new URL('./dist/', import.meta.url))
    copyFileSync(dist + 'index.html', dist + '404.html')
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
    spaFallback(),
  ],
  server: {
    open: true,
  },
})
