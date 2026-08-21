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

## Turn on payments (Phase 6) & live video (Phase 8)
Both use a Supabase Edge Function so secret keys never reach the browser.

**Stripe (Phase 6):**
1. stripe.com (Test mode) → Developers → API keys → copy the **Secret key** (`sk_test_…`)
2. `supabase functions deploy create-checkout --no-verify-jwt`
3. `supabase secrets set STRIPE_SECRET_KEY=sk_test_…`
4. Set `STRIPE_ENABLED: true` in `config.js`, push

**Daily video (Phase 8):**
1. daily.co (free) → Developers → copy your **API key**
2. `supabase functions deploy create-room --no-verify-jwt`
3. `supabase secrets set DAILY_API_KEY=…`
4. Set `VIDEO_ENABLED: true` in `config.js`, push

(Both functions can also be deployed from the Supabase dashboard → Edge Functions, with "Verify JWT" OFF.)

## Still mocked (later phases — marked `// TODO`)
WhatsApp OTP (Supabase phone auth) · Telegram Login Widget. The paywall discount (20%)
and the "5,000+ sessions" stat are placeholders.
