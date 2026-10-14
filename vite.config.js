import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// Project site: https://bodhan-google.github.io/Website/
const pagesBase = process.env.VITE_BASE_PATH ?? '/'

// GitHub Pages has no server-side rewrite, so a direct hit on a deep link
// (e.g. /careers) is served 404.html. Shipping a copy of index.html there lets
// BrowserRouter resolve the original URL client-side. Cloudflare (wrangler.jsonc)
// already does this via not_found_handling.
const spaFallback = () => ({
  name: 'spa-404-fallback',
  apply: 'build',
  closeBundle() {
    const dist = fileURLToPath(new URL('./dist/', import.meta.url))
    copyFileSync(dist + 'index.html', dist + '404.html')
  },
})

// Link previews (LinkedIn, WhatsApp, X) for pages people share. Crawlers don't
// run JavaScript, so each page here gets its own copy of index.html with the
// preview tags already in <head>, written as dist/<path>.html. Hosts serve that
// file at /<path> with HTTP 200; without it bodhan.ai (Netlify) answers a deep
// link with 404.html and HTTP 404, and LinkedIn shows no preview for a 404.
// Images are 1200x627 (LinkedIn's size); sources live in scripts/og-images/.
const SITE_URL = 'https://bodhan.ai'
const sharePages = {
  careers: {
    title: 'Careers at Bodhan AI',
    description:
      'Help us build AI that transforms how India learns, teaches, and grows. See our open roles.',
    image: '/og/careers.png',
    imageAlt: 'Join Bodhan AI. Help us build AI that transforms how India learns, teaches, and grows.',
  },
}

const escapeAttr = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const sharePreviews = () => ({
  name: 'share-previews',
  apply: 'build',
  closeBundle() {
    const dist = fileURLToPath(new URL('./dist/', import.meta.url))
    const html = readFileSync(dist + 'index.html', 'utf8')
    if (!html.includes('</head>')) throw new Error('share-previews: no </head> in dist/index.html')

    for (const [path, page] of Object.entries(sharePages)) {
      const url = `${SITE_URL}/${path}`
      const tags = [
        ['name', 'description', page.description],
        ['property', 'og:type', 'website'],
        ['property', 'og:site_name', 'Bodhan.AI'],
        ['property', 'og:url', url],
        ['property', 'og:title', page.title],
        ['property', 'og:description', page.description],
        ['property', 'og:image', SITE_URL + page.image],
        ['property', 'og:image:width', '1200'],
        ['property', 'og:image:height', '627'],
        ['property', 'og:image:alt', page.imageAlt],
        ['name', 'twitter:card', 'summary_large_image'],
      ].map(([attr, key, value]) => `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`)
      writeFileSync(dist + `${path}.html`, html.replace('</head>', `  ${tags.join('\n  ')}\n</head>`))
    }
  },
})

// https://vite.dev/config/
export default defineConfig({
  base: pagesBase,
  plugins: [
    react(),
    tailwindcss(),
    spaFallback(),
    sharePreviews(),
  ],
  server: {
    // Honour an assigned port so several dev servers can run side by side.
    port: process.env.PORT ? Number(process.env.PORT) : 5173,
    host: true,
    open: true,
    allowedHosts: true,
  },
})
