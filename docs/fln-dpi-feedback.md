# `/fln-dpi` — FLN & DPI feedback form

Anonymous public-consultation form at `/fln-dpi`, modelled on the
[Exam Reforms Task Force feedback page](https://examreforms-taskforce.dopt.gov.in)
but in the Bodhan design language.

```
src/features/flnDpi/
  data/content.js           copy, role list, topics, limits  ← edit copy here
  components/FlnDpiPage.jsx the page
  components/Turnstile.jsx  Cloudflare Turnstile widget (explicit render, resettable)
scripts/apps-script/
  fln-dpi-feedback.js       the backend: Google Apps Script bound to a Sheet
```

## How a submission flows

1. The browser renders **Cloudflare Turnstile** and gets a one-time token.
2. On submit the page POSTs JSON (role, topic, feedback, optional name / email /
   organisation, honeypot, token) to the Apps Script web app — the same
   mechanism the tender bid form uses.
3. The script verifies the token against Cloudflare's `siteverify` endpoint
   using the **secret key** (never shipped to the browser), validates the
   payload, and appends a row to the Google Sheet.
4. The page shows a success card. On any failure the widget is reset, because a
   Turnstile token cannot be reused.

Bot defences: Turnstile (server-verified), a hidden honeypot field (`website`),
server-side allow-lists for role/topic, length caps, and formula-injection
escaping before the row hits the Sheet.

## One-time setup

### 1. Cloudflare Turnstile widget

Cloudflare dashboard → Turnstile → **Add widget**.

- Hostnames: `bodhan.ai`, `www.bodhan.ai`, `bodhan-google.github.io`, and
  `localhost` if you want to test with real keys locally.
- Widget mode: **Managed** (shows the "Verify you are human" box, like the
  reference site).
- Copy the **Site key** (public) and **Secret key** (private).

### 2. Google Sheet + Apps Script

1. Create a Google Sheet (e.g. "FLN-DPI feedback"). Responses land in a tab
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
   `{"ok":true,"service":"fln-dpi-feedback"}`.

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
- **Local dev:** put them in `.env.local` (git-ignored). Without
  `VITE_TURNSTILE_SITE_KEY` the dev build falls back to Cloudflare's
  always-passes test key `1x00000000000000000000AA`, so the widget renders
  without any setup. Pair it with the test secret
  `1x0000000000000000000000000000000AA` in the script properties if you want an
  end-to-end local run that always verifies.

If `VITE_FLN_DPI_SCRIPT_URL` is missing, the page disables the submit button and
shows an "email us instead" notice rather than posting into the void.

## Editing the form

- Copy, intro paragraphs, prompts, role chips and topics live in
  `src/features/flnDpi/data/content.js`.
- `ROLES` and `TOPICS` are duplicated in the Apps Script (`ROLES`, `TOPICS`) —
  the backend rejects unknown values, so change both together and redeploy the
  script.

## What is stored

One row per submission: timestamp, role, topic, feedback, name, email,
organisation (the last three may be empty), the hostname and action Cloudflare
verified the token for, and `source` (`fln-dpi`). No IP address or user agent
is recorded.
