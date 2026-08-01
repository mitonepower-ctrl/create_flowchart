import "server-only";
import { createClient } from "@/lib/supabase/server";

// Confirms the caller has a valid Supabase Auth session (the seeded admin
// account). Used to gate admin-only API routes.
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
