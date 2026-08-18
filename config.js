/* ============================================================
   Kinora runtime config.
   Fill these in to turn on REAL accounts (Supabase auth).
   Leave them blank and the app keeps using the demo/mock auth,
   so the live site never breaks.

   Where to get them:
     Supabase dashboard  ->  your project  ->  Project Settings  ->  API
       • Project URL      -> SUPABASE_URL
       • "anon public" key -> SUPABASE_ANON_KEY

   The anon key is SAFE to expose in client code — it only works
   through Row Level Security (RLS), which you enable on your tables.
   ============================================================ */
window.KINORA_CONFIG = {
  SUPABASE_URL: "",       // e.g. "https://abcdefgh.supabase.co"
  SUPABASE_ANON_KEY: ""   // e.g. "eyJhbGciOiJIUzI1NiIsInR5cCI6..."
};
