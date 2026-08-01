import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// Server Component / Route Handler client that reads the signed-in admin's
// session from cookies. Subject to RLS - use lib/supabase/admin.ts for
// privileged writes.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component - middleware handles refresh instead.
          }
        },
      },
    }
  );
}
