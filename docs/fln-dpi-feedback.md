# FLN DPI & Bodhan Open Models interest form

> **URL shape.** The app uses `BrowserRouter`; old `/#/…` links are redirected
> to the plain path by a script in `index.html`. The form lives at
> `/research/publication/fln-dpi/feedback`; `/fln-dpi` redirects there.
> Dev: `http://localhost:5173/research/publication/fln-dpi/feedback`.

Interest form (linked from the whitepaper publication page) for people met at the FLN Consortium (MoE) and the
Bodhan AI ecosystem consultation (Gates Foundation). It mirrors the Google Form
of the same name, in the Bodhan design language, with Cloudflare Turnstile in
front of it.

```
src/features/flnDpi/
  data/content.js           copy, engagement options, areas, models, limits  ← edit here
  components/FlnDpiPage.jsx the page
  components/Turnstile.jsx  Cloudflare Turnstile widget (explicit render, resettable)
scripts/apps-script/
  fln-dpi-feedback.js       the backend: Google Apps Script bound to a Sheet
```

## The form

1. **About you** — name, organisation / company, email (all optional; the
   email is only format-checked when given).
2. **Contributing to the FLN DPI** — *How can you contribute?* (one merged
   list: vision/policy, standards, trust rails, models, applications, rollout,
   data, funding + Other; at least one required) and *Tell us more* (optional
   long text, also the place for feedback on the whitepaper and its Section 21
   open questions, which the side panel lists).
3. **One last check** — Turnstile.

The side panel describes the DPI in the whitepaper's own words and lists the
seven open questions. The whitepaper itself is a link at the end of the intro
(Google Drive, same pattern as the tender documents; no PDFs ship with the
site); the publication page at `/research/publication/fln-dpi` uses the same
file. An email card sits under the form for longer submissions.

## How a submission flows

1. The browser renders **Cloudflare Turnstile** and gets a one-time token.
2. On submit the page POSTs JSON to the Apps Script web app — the same
   mechanism the tender bid form uses.
3. The script verifies the token against Cloudflare's `siteverify` endpoint
   using the **secret key** (never shipped to the browser), validates every
   option against its allow-list, and appends a row to the Google Sheet.
4. The page shows a success card. On any failure the widget is reset, because a
   Turnstile token cannot be reused.

Bot defences: Turnstile (server-verified), a hidden honeypot field (`website`),
server-side allow-lists for every choice, length caps, and formula-injection
escaping before the row hits the Sheet.

## One-time setup

### 1. Cloudflare Turnstile widget

Cloudflare dashboard → Turnstile → **Add widget**.

- Hostnames: `bodhan.ai`, `www.bodhan.ai`, `bodhan-google.github.io`, and
  `localhost` if you want to test with real keys locally.
- Widget mode: **Managed**.
- Copy the **Site key** (public) and **Secret key** (private).

### 2. Google Sheet + Apps Script

1. Create a Google Sheet (e.g. "FLN DPI interest"). Responses land in a tab
   called `Responses` (created automatically with a bold, frozen header row).
2. Extensions → **Apps Script**. Replace the default `Code.gs` with the contents
   of `scripts/apps-script/fln-dpi-feedback.js`.
3. Project Settings (gear) → **Script properties**:

   | Property            | Required | Value                                                |
   |---------------------|----------|------------------------------------------------------|
   | `TURNSTILE_SECRET`  | yes      | the Turnstile secret key                             |
   | `ALLOWED_HOSTNAMES` | no       | `bodhan.ai,www.bodhan.ai,bodhan-google.github.io`    |
   | `SHEET_NAME`        | no       | tab name, defaults to `Responses`                    |
   | `NOTIFY_EMAIL`      | no       | an inbox to email on every submission                |

4. Deploy → **New deployment** → type *Web app* → Execute as **Me**, Who has
   access **Anyone** → Deploy. Copy the `/exec` URL.
5. Sanity check: opening the `/exec` URL in a browser returns
   `{"ok":true,"service":"fln-dpi-interest"}`.

Every time the script is edited you need **Deploy → Manage deployments → edit →
New version**; the `/exec` URL stays the same.

### 3. Site configuration

The page reads two Vite env vars at build time:

| Variable                  | What                                   |
|---------------------------|----------------------------------------|
| `VITE_FLN_DPI_SCRIPT_URL` | the Apps Script `/exec` URL            |
| `VITE_TURNSTILE_SITE_KEY` | the Turnstile **site** key (public)    |

- **GitHub Pages build:** add both as repository **Variables** (Settings →
  Secrets and variables → Actions → Variables). The deploy workflow passes them
  to `npm run build`.
- **Cloudflare (wrangler.jsonc):** set the same two names as build-time
  environment variables on the Workers/Pages project. They are baked in at
  `vite build`, so a change needs a rebuild, not just a redeploy.
- **Local dev:** put them in `.env.local` (git-ignored). Without
  `VITE_TURNSTILE_SITE_KEY` the dev build falls back to Cloudflare's
  always-passes test key `1x00000000000000000000AA`, so the widget renders
  without any setup. Pair it with the test secret
  `1x0000000000000000000000000000000AA` in the script properties if you want an
  end-to-end local run that always verifies.

If `VITE_FLN_DPI_SCRIPT_URL` is missing, the page disables the submit button and
shows an "email us instead" notice rather than posting into the void.

## Editing the form

- Copy and every option list live in `src/features/flnDpi/data/content.js`.
- `AREAS` is duplicated in the Apps Script — the backend drops values it does
  not recognise, so change both together and redeploy the script.

## What is stored

One row per submission: timestamp, name, organisation, email, engagement
choices, areas (+ other text), "tell us
more", models, use case, whitepaper questions, whitepaper comments, the hostname
Cloudflare verified the token for, and `source` (`fln-dpi`). Multi-select answers are `; `-joined. No IP address or
user agent is recorded.
