// ============================================================
// Kinora — Daily video room Edge Function (Phase 8)
// Creates a short-lived Daily room and returns its URL. The Daily
// API key stays here on the server (set as the DAILY_API_KEY secret)
// — never in the browser.
//
// Deploy:  supabase functions deploy create-room --no-verify-jwt
// Secret:  supabase secrets set DAILY_API_KEY=your_daily_api_key
// ============================================================
const DAILY_API_KEY = Deno.env.get("DAILY_API_KEY") ?? "";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;   // room self-destructs in 1 hour
    const res = await fetch("https://api.daily.co/v1/rooms", {
      method: "POST",
      headers: { Authorization: `Bearer ${DAILY_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        privacy: "public",
        properties: {
          exp,
          eject_at_room_exp: true,
          enable_prejoin_ui: true,
          enable_screenshare: true,
          enable_chat: true,
        },
      }),
    });
    const room = await res.json();
    if (!room.url) {
      return new Response(JSON.stringify({ error: room.error || "room_create_failed", info: room.info }), {
        status: 400, headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ url: room.url, name: room.name }), {
      headers: { ...cors, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error)?.message ?? e) }), {
      status: 400, headers: { ...cors, "Content-Type": "application/json" },
    });
  }
});
