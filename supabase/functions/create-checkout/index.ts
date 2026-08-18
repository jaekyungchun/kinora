// ============================================================
// Kinora — Stripe Checkout Edge Function (Phase 6)
// Creates a Stripe Checkout Session for a plan + currency and
// returns its URL. The Stripe SECRET key stays here on the server
// (set as the STRIPE_SECRET_KEY secret) — never in the browser.
//
// Deploy:  supabase functions deploy create-checkout --no-verify-jwt
// Secret:  supabase secrets set STRIPE_SECRET_KEY=sk_test_xxx
// ============================================================
import Stripe from "https://esm.sh/stripe@16.12.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// plan amounts in AED (single source of truth — mirrors the funnel)
const PLANS: Record<string, { name: string; aed: number; mode: "payment" | "subscription"; interval?: "month" }> = {
  payg:   { name: "Pay-per-session", aed: 149, mode: "payment" },
  member: { name: "Member",          aed: 449, mode: "subscription", interval: "month" },
  elite:  { name: "Elite",           aed: 899, mode: "subscription", interval: "month" },
};
const RATES: Record<string, number> = { AED:1, USD:0.272, EUR:0.25, GBP:0.214, KRW:377, SAR:1.02, JPY:42, INR:22.8, CNY:1.97, CAD:0.378 };
const ROUND: Record<string, number> = { KRW:100, JPY:10 };
const ZERO_DECIMAL = new Set(["JPY", "KRW"]); // Stripe zero-decimal currencies

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const { plan = "member", currency = "AED", discount = true, email } = await req.json();
    const p = PLANS[plan] ?? PLANS.member;
    const cur = String(currency).toUpperCase();
    const rate = RATES[cur] ?? 1;

    let amt = p.aed * rate * (discount ? 0.8 : 1);          // 20% promo (matches the paywall)
    amt = ROUND[cur] ? Math.round(amt / ROUND[cur]) * ROUND[cur] : Math.round(amt);
    const unit_amount = ZERO_DECIMAL.has(cur) ? Math.round(amt) : Math.round(amt * 100);

    const origin = req.headers.get("origin") ?? "https://jaekyungchun.github.io";
    const base = origin.includes("github.io") ? `${origin}/kinora` : origin;

    const session = await stripe.checkout.sessions.create({
      mode: p.mode,
      customer_email: email || undefined,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: cur.toLowerCase(),
          product_data: { name: `Kinora — ${p.name}` },
          unit_amount,
          ...(p.interval ? { recurring: { interval: p.interval } } : {}),
        },
      }],
      success_url: `${base}/app.html?checkout=success`,
      cancel_url: `${base}/app.html?checkout=cancel`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
