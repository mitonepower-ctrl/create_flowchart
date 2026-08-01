import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Privileged client for server-only code (API routes, seed script). Uses the
// service role / secret key, which bypasses Row Level Security entirely.
// NEVER import this from a Client Component or expose the key to the browser.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
