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

## Not yet wired (the "app" phase — marked `// TODO` in app.html)
Supabase auth · WhatsApp OTP · Telegram Login Widget · Stripe payments. The paywall
discount (20%) and the "5,000+ sessions" stat are placeholders.
