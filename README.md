# Kinora — live personal-training funnel (web app)

Static, zero-build site. Two entry points:
- `index.html` — marketing landing (CTAs open the funnel)
- `app.html` — the funnel & app shell: quiz → coach match → pricing → signup → dashboard

5 languages (EN/AR/中文/RU/KO) with full RTL, mobile-first, installable PWA (`manifest.webmanifest` + `sw.js`).

## Run locally
Any static server, e.g.: `python3 -m http.server 8000` then open http://localhost:8000/

## Deploy (GitHub Pages)
Pushed to a GitHub repo with Pages enabled (branch `main`, root). Lives at
`https://<user>.github.io/<repo>/`. Relative paths + service-worker scope are `/<repo>/`-safe.

## Enable real accounts (Supabase) — Phase 4
The funnel's email/password signup + login are wired to Supabase, with a mock
fallback so the demo works with no keys. To turn on real accounts:

1. Create a free project at https://supabase.com
2. Project Settings → API → copy **Project URL** and the **anon public** key
3. Paste both into **`config.js`** (`SUPABASE_URL`, `SUPABASE_ANON_KEY`), commit & push
4. In Supabase → Authentication → Providers, keep **Email** enabled (email confirmation
   on/off is your choice — the app handles both)

That's it — signup/login/logout become real, and the Account tab shows the signed-in
user. The anon key is safe to expose (it only works through Row Level Security).

## Still mocked (later phases — marked `// TODO`)
WhatsApp OTP (Supabase phone auth) · Telegram Login Widget · Stripe payments · booking +
live video. The paywall discount (20%) and the "5,000+ sessions" stat are placeholders.
