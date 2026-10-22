# Google Analytics

The site loads Google Analytics 4 (gtag.js) when it is built with a measurement ID.
The `google-analytics` plugin in `vite.config.js` adds the tag to the `<head>` of
`index.html` at build time, so `404.html` and the share-preview pages (`careers.html`),
which are copies of the built `index.html`, get it too.

| Variable                 | What                                                  |
|--------------------------|-------------------------------------------------------|
| `VITE_GA_MEASUREMENT_ID` | GA4 measurement ID, `G-XXXXXXXXXX` (public, not secret) |

If the variable is unset, or isn't in the `G-…` format, no tag is added and the site
builds exactly as before. `npm run dev` never loads it, so local browsing doesn't
show up in reports.

## Where to set it

It's read when `vite build` runs, so changing it needs a rebuild, not just a redeploy.

- **GitHub Pages build:** add it as a repository **Variable** (Settings → Secrets and
  variables → Actions → Variables). The deploy workflow passes it to `npm run build`.
- **Netlify / Cloudflare:** set the same name as a build environment variable on the
  project that serves bodhan.ai.
- **Local check:** `VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX npm run build`, then look for
  `googletagmanager` in `dist/index.html`.

## What it records

- **Page views:** GA4 enhanced measurement ("page changes based on browser history
  events", on by default in a web data stream) counts client-side route changes. No
  router code is needed.
- **Privacy:** Google signals and ad personalisation are turned off in the `config`
  call. The site sends no form contents or other personal data to GA.
- **Embedded posts:** the research posts mounted as iframes from `public/` are their
  own HTML files and don't load the tag. Their parent page's page view is what gets
  counted.
