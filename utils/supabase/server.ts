import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://oneffsurlihlqrudjuzc.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_KEY ||
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9uZWZmc3VybGlobHFydWRqdXpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMTc1ODAsImV4cCI6MjA1MTU5MzU4MH0.oQxC6X3BjWavWQpsgBFHw0dsWZ3nJfHmyJyIBNY24y4",
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
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
